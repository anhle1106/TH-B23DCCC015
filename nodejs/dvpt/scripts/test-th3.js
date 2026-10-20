import { spawn } from 'child_process';
import http from 'http';

const FEE_URL = 'http://localhost:4001';
const BANK_URL = 'http://localhost:4002';

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

async function sendBatchPayments(total, concurrency, useKeepAlive = true) {
  let completed = 0;
  let success = 0;
  let index = 0;

  const runWorker = async () => {
    while (index < total) {
      const currentIndex = index++;
      try {
        const res = await request(`${FEE_URL}/students/1/payments?keepAlive=${useKeepAlive}`, {
          method: 'POST',
          body: { amount: 1000 }
        });
        if (res.status === 201 && res.data?.status === 'PAID') {
          success++;
        }
      } catch {
        // network error
      }
      completed++;
    }
  };

  const startTime = Date.now();
  const workers = Array.from({ length: concurrency }, () => runWorker());
  await Promise.all(workers);
  const totalDuration = Date.now() - startTime;

  return { total, success, totalDuration };
}

async function runScenario3() {
  console.log('======================================================================');
  console.log('TÌNH HUỐNG 3: Duy trì kết nối (HTTP Keep-Alive Connection Pooling)');
  console.log('======================================================================\n');

  console.log('1. Khởi động Ngân hàng (Cổng 4002)...');
  const bankProcess = spawn('node', ['bank-service.js'], {
    cwd: 'd:\\ltw\\nodejs\\dvpt',
    stdio: 'ignore',
    env: { ...process.env, PORT: '4002', DELAY_MS: '0', FAIL_RATE: '0', DROP_RATE: '0' }
  });

  console.log('2. Khởi động Fee Service (Cổng 4001)...');
  const feeProcess = spawn('node', ['fee-service.js'], {
    cwd: 'd:\\ltw\\nodejs\\dvpt',
    stdio: 'ignore',
    env: { ...process.env, PORT: '4001', BANK_URL: 'http://localhost:4002' }
  });

  await sleep(1500);

  try {
    console.log('\n--- BƯỚC A: ĐO TRƯỚC KHI TỐI ƯU (KHÔNG DÙNG KEEP-ALIVE) ---');
    await request(`${BANK_URL}/stats/reset`, { method: 'POST' });
    await request(`${FEE_URL}/reset`, { method: 'POST' });

    console.log('Gửi 200 thanh toán (10 đồng thời, 1.000đ/lần) với keepAlive = false...');
    const beforeResult = await sendBatchPayments(200, 10, false);
    const beforeStatsRes = await request(`${BANK_URL}/stats`);
    const beforeStats = beforeStatsRes.data;

    console.log(`- Kết quả: ${beforeResult.success}/${beforeResult.total} thành công`);
    console.log(`- Tổng thời gian: ${beforeResult.totalDuration}ms`);
    console.log(`- Thống kê /stats:`, beforeStats);
    console.log(`  -> Số kết nối TCP: ${beforeStats.connections}`);

    console.log('\n--- BƯỚC B: ĐO SAU KHI TỐI ƯU (CÓ KEEP-ALIVE POOL) ---');
    await request(`${BANK_URL}/stats/reset`, { method: 'POST' });
    await request(`${FEE_URL}/reset`, { method: 'POST' });

    console.log('Gửi 200 thanh toán (10 đồng thời, 1.000đ/lần) với keepAlive = true...');
    const afterResult = await sendBatchPayments(200, 10, true);
    const afterStatsRes = await request(`${BANK_URL}/stats`);
    const afterStats = afterStatsRes.data;

    console.log(`- Kết quả: ${afterResult.success}/${afterResult.total} thành công`);
    console.log(`- Tổng thời gian: ${afterResult.totalDuration}ms`);
    console.log(`- Thống kê /stats:`, afterStats);
    console.log(`  -> Số kết nối TCP: ${afterStats.connections}`);

    const check1_success200 = afterResult.success === 200;
    const check2_connections = afterStats.connections <= 20;

    console.log(`\n-> [x] 200/200 thanh toán thành công: ${check1_success200 ? 'PASS' : 'FAIL'} (${afterResult.success}/200)`);
    console.log(`-> [x] Số kết nối TCP ngân hàng mở <= 20: ${check2_connections ? 'PASS' : 'FAIL'} (${afterStats.connections} kết nối)`);

    console.log('\n--- BƯỚC C: KIỂM TRA SAU KHI NHÀN RỖI 6 GIÂY ---');
    console.log('Đang chờ 6 giây (ngân hàng đóng kết nối cũ sau 5s idle)...');
    for (let i = 6; i > 0; i--) {
      process.stdout.write(`... ${i}s `);
      await sleep(1000);
    }
    console.log('\nGửi tiếp 5 thanh toán mới để kiểm tra tái lập kết nối:');

    let idleSuccessCount = 0;
    for (let i = 1; i <= 5; i++) {
      const res = await request(`${FEE_URL}/students/1/payments?keepAlive=true`, {
        method: 'POST',
        body: { amount: 1000 }
      });
      if (res.status === 201 && res.data?.status === 'PAID') {
        idleSuccessCount++;
      }
      console.log(`  Lệnh ${i}: HTTP ${res.status} - Status: ${res.data?.status || 'ERR'} (${res.duration}ms)`);
    }

    const check3_idleRecovered = idleSuccessCount === 5;
    console.log(`-> [x] Sau nhàn rỗi 6 giây, các yêu cầu tiếp theo vẫn thành công: ${check3_idleRecovered ? 'PASS' : 'FAIL'} (${idleSuccessCount}/5)`);

    console.log('\n======================================================================');
    console.log('TỔNG KẾT TÌNH HUỐNG 3:');
    console.log(`- 200/200 thanh toán thành công: ${check1_success200 ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log(`- Số kết nối TCP mở <= 20 (${afterStats.connections}): ${check2_connections ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log(`- Tái lập kết nối sau 6s nhàn rỗi: ${check3_idleRecovered ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log('======================================================================\n');

  } finally {
    bankProcess.kill();
    feeProcess.kill();
  }
}

runScenario3().catch(console.error);
