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

async function runScenario1() {
  console.log('======================================================================');
  console.log('TÌNH HUỐNG 1: Ngân hàng không kết nối được, rồi hoạt động lại');
  console.log('======================================================================\n');

  console.log('1. Khởi động Fee Service (Cổng 4001)... Ngân hàng chưa bật.');
  const feeProcess = spawn('node', ['fee-service.js'], {
    cwd: 'd:\\ltw\\nodejs\\dvpt',
    stdio: 'ignore',
    env: { ...process.env, PORT: '4001', BANK_URL: 'http://localhost:4002' }
  });

  await sleep(1000);

  try {
    console.log('\n2. Gọi POST /students/1/payments khi ngân hàng đang tắt:');
    const payRes1 = await request(`${FEE_URL}/students/1/payments`, {
      method: 'POST',
      body: { amount: 100000 }
    });

    console.log(`- HTTP Status: ${payRes1.status} (Kỳ vọng: 503)`);
    console.log(`- Thời gian phản hồi: ${payRes1.duration}ms (Kỳ vọng: < 1500ms)`);
    console.log(`- Thân phản hồi:`, payRes1.data);

    const check1_503 = payRes1.status === 503;
    const check1_time = payRes1.duration < 1500;
    const check1_json = payRes1.data?.error && payRes1.data?.status === 'FAILED' && payRes1.data?.paymentId;

    console.log(`-> [x] Trả 503: ${check1_503 ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] Thời gian < 1.5s: ${check1_time ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] Thân JSON có error, paymentId, status=FAILED: ${check1_json ? 'PASS' : 'FAIL'}`);

    console.log('\n3. Kiểm tra Fee Service còn sống: GET /students/1/fees:');
    const feeRes = await request(`${FEE_URL}/students/1/fees`);
    console.log(`- HTTP Status: ${feeRes.status} (Kỳ vọng: 200)`);
    console.log(`- Thời gian phản hồi: ${feeRes.duration}ms`);
    console.log(`- Dữ liệu:`, feeRes.data);
    const check2_alive = feeRes.status === 200 && feeRes.duration < 200;
    console.log(`-> [x] Fee Service hoạt động bình thường: ${check2_alive ? 'PASS' : 'FAIL'}`);

    console.log('\n4. Khởi động Ngân hàng (Cổng 4002)... (Không restart Fee Service)');
    const bankProcess = spawn('node', ['bank-service.js'], {
      cwd: 'd:\\ltw\\nodejs\\dvpt',
      stdio: 'ignore',
      env: { ...process.env, PORT: '4002', DELAY_MS: '0', FAIL_RATE: '0', DROP_RATE: '0' }
    });

    await sleep(1200);

    console.log('\n5. Gọi lại POST /students/1/payments:');
    const payRes2 = await request(`${FEE_URL}/students/1/payments`, {
      method: 'POST',
      body: { amount: 100000 }
    });

    console.log(`- HTTP Status: ${payRes2.status} (Kỳ vọng: 201)`);
    console.log(`- Thân phản hồi:`, payRes2.data);
    const check3_recovered = payRes2.status === 201 && payRes2.data?.status === 'PAID';
    console.log(`-> [x] Tự động phục hồi, trả 201 PAID: ${check3_recovered ? 'PASS' : 'FAIL'}`);

    const feeResAfter = await request(`${FEE_URL}/students/1/fees`);
    console.log(`- Công nợ sau thanh toán thành công: ${feeResAfter.data?.debt?.toLocaleString()}đ`);

    bankProcess.kill();
    await sleep(500);

    console.log('\n======================================================================');
    console.log('TỔNG KẾT TÌNH HUỐNG 1:');
    console.log(`- Ngân hàng tắt: Trả 503 < 1.5s: ${check1_503 && check1_time ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log(`- Fee Service không sập: ${check2_alive ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log(`- Tự động phục hồi khi ngân hàng bật: ${check3_recovered ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log('======================================================================\n');

  } finally {
    feeProcess.kill();
  }
}

runScenario1().catch(console.error);
