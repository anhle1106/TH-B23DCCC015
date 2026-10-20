import { spawn } from 'child_process';
import http from 'http';

const FEE_URL = 'http://localhost:4001';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function request(urlStr, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const postData = options.body ? JSON.stringify(options.body) : null;
    const reqOptions = {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + (url.search || ''),
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...(options.headers || {})
      }
    };

    const startTime = Date.now();
    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => body += c);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch { json = body; }
        resolve({
          status: res.statusCode,
          data: json,
          duration: Date.now() - startTime
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runScenario2() {
  console.log('======================================================================');
  console.log('TÌNH HUỐNG 2: Ngân hàng phản hồi rất chậm (DELAY_MS=5000)');
  console.log('======================================================================\n');

  console.log('1. Khởi động Ngân hàng (Cổng 4002) với DELAY_MS = 5000ms...');
  const bankProcess = spawn('node', ['bank-service.js'], {
    cwd: 'd:\\ltw\\nodejs\\dvpt',
    stdio: 'ignore',
    env: { ...process.env, PORT: '4002', DELAY_MS: '5000', FAIL_RATE: '0', DROP_RATE: '0' }
  });

  console.log('2. Khởi động Fee Service (Cổng 4001)...');
  const feeProcess = spawn('node', ['fee-service.js'], {
    cwd: 'd:\\ltw\\nodejs\\dvpt',
    stdio: 'ignore',
    env: { ...process.env, PORT: '4001', BANK_URL: 'http://localhost:4002' }
  });

  await sleep(1500);

  try {
    console.log('3. Gọi thanh toán đơn lẻ khi ngân hàng trễ 5 giây:');
    const payRes = await request(`${FEE_URL}/students/1/payments`, {
      method: 'POST',
      body: { amount: 100000 }
    });

    console.log(`- HTTP Status: ${payRes.status} (Kỳ vọng: 504)`);
    console.log(`- Thời gian phản hồi: ${payRes.duration}ms (Kỳ vọng: <= 4500ms)`);
    console.log(`- Thân phản hồi:`, payRes.data);

    const check1_504 = payRes.status === 504;
    const check1_pending = payRes.data?.status === 'PENDING';
    const check1_time = payRes.duration <= 4500;

    console.log(`-> [x] Trả 504: ${check1_504 ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] status là PENDING: ${check1_pending ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] Thời gian phản hồi <= 4,5 giây (${payRes.duration}ms): ${check1_time ? 'PASS' : 'FAIL'}`);

    console.log('\n4. Bắn cùng lúc 20 thanh toán, đồng thời gọi GET /students/1/fees:');
    const paymentPromises = Array.from({ length: 20 }, () => 
      request(`${FEE_URL}/students/1/payments`, {
        method: 'POST',
        body: { amount: 1000 }
      })
    );

    await sleep(200);

    const feeStart = Date.now();
    const feeRes = await request(`${FEE_URL}/students/1/fees`);
    const feeDuration = Date.now() - feeStart;

    console.log(`- Kết quả GET /students/1/fees: HTTP ${feeRes.status}`);
    console.log(`- Thời gian phản hồi GET /fees: ${feeDuration}ms (Kỳ vọng: < 300ms)`);

    const check2_non_blocking = feeRes.status === 200 && feeDuration < 300;
    console.log(`-> [x] GET /fees phản hồi < 300ms: ${check2_non_blocking ? 'PASS' : 'FAIL'}`);

    const allResults = await Promise.all(paymentPromises);
    const count504 = allResults.filter(r => r.status === 504).length;
    const maxPaymentDuration = Math.max(...allResults.map(r => r.duration));
    console.log(`- 20/20 yêu cầu đều trả về HTTP 504: ${count504}/20`);
    console.log(`- Thời gian tối đa của 20 requests: ${maxPaymentDuration}ms <= 4500ms`);

    console.log('\n======================================================================');
    console.log('TỔNG KẾT TÌNH HUỐNG 2:');
    console.log(`- Thanh toán trả 504 PENDING: ${check1_504 && check1_pending ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log(`- Thời gian phản hồi <= 4,5 giây: ${check1_time ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log(`- GET /fees non-blocking < 300ms (${feeDuration}ms): ${check2_non_blocking ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log('======================================================================\n');

  } finally {
    bankProcess.kill();
    feeProcess.kill();
  }
}

runScenario2().catch(console.error);
