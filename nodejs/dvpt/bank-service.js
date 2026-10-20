import express from 'express';
import http from 'http';

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '4002', 10);
const DELAY_MS = parseInt(process.env.DELAY_MS || '0', 10);
const FAIL_RATE = parseFloat(process.env.FAIL_RATE || '0');
const DROP_RATE = parseFloat(process.env.DROP_RATE || '0');

const stats = {
  connections: 0,
  requests: 0,
  charges: 0,
  duplicates: 0
};

const idempotencyStore = new Map();
const processedReferences = new Set();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post('/charges', async (req, res) => {
  stats.requests++;
  const idempotencyKey = req.header('idempotency-key') || req.header('Idempotency-Key');
  const { reference, amount } = req.body || {};

  if (DELAY_MS > 0) {
    await sleep(DELAY_MS);
  }

  if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
    return res.status(201).json(idempotencyStore.get(idempotencyKey));
  }

  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      error: 'Invalid payment amount',
      status: 'FAILED'
    });
  }

  if (amount > 20000000) {
    return res.status(402).json({
      error: 'Payment amount exceeds transaction limit of 20,000,000 VND',
      status: 'FAILED'
    });
  }

  if (FAIL_RATE > 0 && Math.random() < FAIL_RATE) {
    return res.status(500).json({
      error: 'Internal bank service error before charging',
      status: 'FAILED'
    });
  }

  stats.charges++;
  
  if (reference && processedReferences.has(reference)) {
    stats.duplicates++;
    console.warn(`[BANK WARNING] Duplicate charge detected for reference: ${reference}`);
  } else if (reference) {
    processedReferences.add(reference);
  }

  const chargeId = `CHG_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
  const record = {
    chargeId,
    reference: reference || null,
    amount,
    status: 'SUCCESS',
    timestamp: new Date().toISOString()
  };

  if (idempotencyKey) {
    idempotencyStore.set(idempotencyKey, record);
  }

  if (DROP_RATE > 0 && Math.random() < DROP_RATE) {
    if (res.socket) {
      res.socket.destroy();
    }
    return;
  }

  return res.status(201).json(record);
});

app.get('/stats', (req, res) => {
  res.json({
    connections: stats.connections,
    requests: stats.requests,
    charges: stats.charges,
    duplicates: stats.duplicates
  });
});

app.post('/stats/reset', (req, res) => {
  stats.connections = 0;
  stats.requests = 0;
  stats.charges = 0;
  stats.duplicates = 0;
  idempotencyStore.clear();
  processedReferences.clear();
  res.json({ message: 'Stats reset successfully', stats });
});

const server = http.createServer(app);

server.keepAliveTimeout = 5000;
server.headersTimeout = 6000;

server.on('connection', (socket) => {
  stats.connections++;
  console.log(`[BANK] TCP connection #${stats.connections} from port ${socket.remotePort}`);
});

server.listen(PORT, () => {
  console.log(`Bank Mock Service running on http://localhost:${PORT}`);
});

export { app, server, stats };
