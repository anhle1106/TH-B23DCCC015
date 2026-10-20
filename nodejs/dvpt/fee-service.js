import express from 'express';
import http from 'http';

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '4001', 10);
const getBankUrl = () => process.env.BANK_URL || 'http://localhost:4002';

const initialStudents = {
  '1': { id: '1', debt: 50000000, name: 'Nguyen Van A' },
  '2': { id: '2', debt: 0, name: 'Tran Thi B' },
  '3': { id: '3', debt: 3200000, name: 'Le Van C' }
};

let students = JSON.parse(JSON.stringify(initialStudents));
let paymentCounter = 1;
const paymentRecords = new Map();

const resetData = () => {
  students = JSON.parse(JSON.stringify(initialStudents));
  paymentCounter = 1;
  paymentRecords.clear();
};

const keepAliveAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 20,
  maxFreeSockets: 20,
  keepAliveMsecs: 10000
});

const noKeepAliveAgent = new http.Agent({
  keepAlive: false
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function sendBankRequest({ bankUrlStr, payload, idempotencyKey, useKeepAlive, timeoutMs }) {
  return new Promise((resolve, reject) => {
    const bankUrl = new URL(bankUrlStr);
    const postData = JSON.stringify(payload);

    const options = {
      protocol: bankUrl.protocol,
      hostname: bankUrl.hostname,
      port: bankUrl.port,
      path: '/charges',
      method: 'POST',
      agent: useKeepAlive ? keepAliveAgent : noKeepAliveAgent,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Idempotency-Key': idempotencyKey,
        'Connection': useKeepAlive ? 'keep-alive' : 'close'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = body ? JSON.parse(body) : null;
        } catch {
          parsed = { raw: body };
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy(Object.assign(new Error('REQUEST_TIMEOUT'), { code: 'ETIMEDOUT' }));
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function callBankWithResilience({
  payload,
  idempotencyKey,
  useKeepAlive = true,
  maxRetries = 2,
  totalTimeoutMs = 4200,
  attemptTimeoutMs = 1300
}) {
  const bankUrlStr = getBankUrl();
  const startTime = Date.now();
  const deadline = startTime + totalTimeoutMs;

  let attempt = 0;
  let lastError = null;

  while (attempt <= maxRetries) {
    const timeRemaining = deadline - Date.now();
    if (timeRemaining <= 100) {
      break;
    }

    const currentTimeout = Math.min(attemptTimeoutMs, timeRemaining);
    attempt++;

    try {
      const response = await sendBankRequest({
        bankUrlStr,
        payload,
        idempotencyKey,
        useKeepAlive,
        timeoutMs: currentTimeout
      });

      if (response.statusCode === 201) {
        return {
          status: 'SUCCESS',
          httpStatus: 201,
          data: response.data
        };
      }

      if (response.statusCode >= 400 && response.statusCode < 500) {
        return {
          status: 'REJECTED',
          httpStatus: response.statusCode,
          error: response.data?.error || `Bank rejected with status ${response.statusCode}`,
          data: response.data
        };
      }

      lastError = {
        type: 'SERVER_ERROR',
        httpStatus: response.statusCode,
        error: response.data?.error || 'Bank internal server error'
      };

      if (attempt <= maxRetries && Date.now() + 100 < deadline) {
        await sleep(50);
        continue;
      }
    } catch (err) {
      const errorCode = err.code || err.message;

      if (errorCode === 'ECONNREFUSED') {
        return {
          status: 'UNREACHABLE',
          httpStatus: 503,
          error: 'Cannot connect to bank service'
        };
      }

      lastError = {
        type: 'NETWORK_ERROR',
        code: errorCode,
        error: 'Bank timeout or connection dropped during transaction'
      };

      if (Date.now() - startTime >= totalTimeoutMs - 300) {
        break;
      }

      if (attempt <= maxRetries && Date.now() + 100 < deadline) {
        await sleep(50);
        continue;
      }
    }
  }

  return {
    status: 'UNCERTAIN',
    httpStatus: 504,
    error: lastError?.error || 'Bank timeout or disconnected while processing'
  };
}

app.get('/students/:id/fees', (req, res) => {
  const student = students[req.params.id];

  if (!student) {
    return res.status(404).json({
      error: 'Student not found',
      studentId: req.params.id
    });
  }

  res.status(200).json({
    studentId: student.id,
    name: student.name,
    debt: student.debt
  });
});

app.post('/students/:id/payments', async (req, res) => {
  const studentId = req.params.id;
  const student = students[studentId];

  if (!student) {
    return res.status(404).json({
      error: 'Student not found',
      studentId
    });
  }

  const { amount } = req.body || {};

  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      error: 'Invalid payment amount',
      studentId
    });
  }

  if (amount > student.debt) {
    return res.status(400).json({
      error: `Payment amount (${amount} VND) exceeds student debt (${student.debt} VND)`,
      studentId,
      currentDebt: student.debt
    });
  }

  const paymentId = `P${paymentCounter++}`;
  const idempotencyKey = paymentId;
  const useKeepAlive = req.query.keepAlive !== 'false' && process.env.KEEP_ALIVE !== 'false';

  paymentRecords.set(paymentId, {
    paymentId,
    studentId,
    amount,
    status: 'INITIATED',
    createdAt: new Date().toISOString()
  });

  const bankResult = await callBankWithResilience({
    payload: { reference: paymentId, amount },
    idempotencyKey,
    useKeepAlive,
    maxRetries: 2,
    totalTimeoutMs: 4200,
    attemptTimeoutMs: 1300
  });

  if (bankResult.status === 'SUCCESS') {
    student.debt = Math.max(0, student.debt - amount);

    paymentRecords.set(paymentId, {
      paymentId,
      studentId,
      amount,
      status: 'PAID',
      chargeId: bankResult.data?.chargeId,
      remainingDebt: student.debt,
      updatedAt: new Date().toISOString()
    });

    return res.status(201).json({
      paymentId,
      studentId,
      amount,
      status: 'PAID',
      remainingDebt: student.debt,
      chargeId: bankResult.data?.chargeId
    });
  }

  if (bankResult.status === 'REJECTED') {
    paymentRecords.set(paymentId, {
      paymentId,
      studentId,
      amount,
      status: 'FAILED',
      reason: bankResult.error,
      updatedAt: new Date().toISOString()
    });

    return res.status(bankResult.httpStatus).json({
      error: bankResult.error,
      paymentId,
      status: 'FAILED'
    });
  }

  if (bankResult.status === 'UNREACHABLE') {
    paymentRecords.set(paymentId, {
      paymentId,
      studentId,
      amount,
      status: 'FAILED',
      reason: bankResult.error,
      updatedAt: new Date().toISOString()
    });

    return res.status(503).json({
      error: bankResult.error,
      paymentId,
      status: 'FAILED'
    });
  }

  paymentRecords.set(paymentId, {
    paymentId,
    studentId,
    amount,
    status: 'PENDING',
    reason: bankResult.error,
    updatedAt: new Date().toISOString()
  });

  return res.status(504).json({
    error: bankResult.error,
    paymentId,
    status: 'PENDING'
  });
});

app.get('/payments/:paymentId', (req, res) => {
  const record = paymentRecords.get(req.params.paymentId);
  if (!record) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  res.json(record);
});

app.post('/reset', (req, res) => {
  resetData();
  res.json({ message: 'Fee Service data reset successfully', students });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Fee Service running on http://localhost:${PORT}`);
});

export { app, server, students, resetData };
