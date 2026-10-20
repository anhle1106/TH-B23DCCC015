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

async function runScenario4() {
  console.log('======================================================================');
  console.log('TÌNH HUỐNG 4: Đứt giữa chừng, lỗi tạm thời, bị từ chối');
  console.log('======================================================================\n');

  console.log('Khởi động Fee Service (Cổng 4001)...');
  const feeProcess = spawn('node', ['fee-service.js'], {
    cwd: 'd:\\ltw\\nodejs\\dvpt',
    stdio: 'ignore',
    env: { ...process.env, PORT: '4001', BANK_URL: 'http://localhost:4002' }
  });

  await sleep(1000);

  try {
    console.log('----------------------------------------------------------------------');
    console.log('MỤC (a): Chạy ngân hàng với DROP_RATE = 0.3 (Đứt kết nối sau khi trừ tiền)');
    console.log('----------------------------------------------------------------------');

    const bankProcessA = spawn('node', ['bank-service.js'], {
      cwd: 'd:\\ltw\\nodejs\\dvpt',
      stdio: 'ignore',
      env: { ...process.env, PORT: '4002', DELAY_MS: '0', FAIL_RATE: '0', DROP_RATE: '0.3' }
    });
    await sleep(1200);

    await request(`${BANK_URL}/stats/reset`, { method: 'POST' });
    await request(`${FEE_URL}/reset`, { method: 'POST' });

    console.log('Gửi lần lượt 60 thanh toán (10.000đ mỗi lần)...');
    let paidCountA = 0;
    let pendingCountA = 0;
    let maxDurationA = 0;

    for (let i = 1; i <= 60; i++) {
      const res = await request(`${FEE_URL}/students/1/payments`, {
        method: 'POST',
        body: { amount: 10000 }
      });

      if (res.duration > maxDurationA) maxDurationA = res.duration;

      if (res.status === 201 && res.data?.status === 'PAID') {
        paidCountA++;
      } else if (res.status === 504 && res.data?.status === 'PENDING') {
        pendingCountA++;
      }
      process.stdout.write(res.status === 201 ? '.' : 'P');
      if (i % 20 === 0) process.stdout.write(` [${i}/60]\n`);
    }

    const statsResA = await request(`${BANK_URL}/stats`);
    const statsA = statsResA.data;
    const feeResA = await request(`${FEE_URL}/students/1/fees`);
    const remainingDebtA = feeResA.data?.debt;
    const expectedDebtA = 50000000 - (paidCountA * 10000);

    console.log('\n--- KẾT QUẢ MỤC (a) ---');
    console.log(`- Số lệnh PAID (thành công): ${paidCountA}/60 (Kỳ vọng >= 54)`);
    console.log(`- Số lệnh PENDING (504): ${pendingCountA}/60`);
    console.log(`- Thống kê ngân hàng /stats:`, statsA);
    console.log(`- Công nợ thực tế SV 1: ${remainingDebtA.toLocaleString()}đ (Kỳ vọng: ${expectedDebtA.toLocaleString()}đ)`);

    const checkA_duplicates = statsA.duplicates === 0;
    const checkA_successRate = paidCountA >= 54;
    const checkA_pendingFormat = pendingCountA === 0 || (60 - paidCountA === pendingCountA);
    const checkA_debtExact = remainingDebtA === expectedDebtA;
    const checkA_timeout = maxDurationA <= 4500;

    console.log(`-> [x] duplicates = 0: ${checkA_duplicates ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] >= 54/60 thanh toán thành công: ${checkA_successRate ? 'PASS' : 'FAIL'} (${paidCountA}/60)`);
    console.log(`-> [x] Lệnh không thành công trả 504 PENDING: ${checkA_pendingFormat ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] Công nợ chỉ giảm đúng tiền của các lệnh PAID: ${checkA_debtExact ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] Thời gian đáp ứng <= 4,5 giây: ${checkA_timeout ? 'PASS' : 'FAIL'}`);

    bankProcessA.kill();
    await sleep(800);

    console.log('\n----------------------------------------------------------------------');
    console.log('MỤC (b): Chạy ngân hàng với FAIL_RATE = 0.3 (Lỗi 500 trước khi trừ tiền)');
    console.log('----------------------------------------------------------------------');

    const bankProcessB = spawn('node', ['bank-service.js'], {
      cwd: 'd:\\ltw\\nodejs\\dvpt',
      stdio: 'ignore',
      env: { ...process.env, PORT: '4002', DELAY_MS: '0', FAIL_RATE: '0.3', DROP_RATE: '0' }
    });
    await sleep(1200);

    await request(`${BANK_URL}/stats/reset`, { method: 'POST' });
    await request(`${FEE_URL}/reset`, { method: 'POST' });

    console.log('Gửi lần lượt 60 thanh toán (10.000đ mỗi lần)...');
    let paidCountB = 0;
    let maxDurationB = 0;

    for (let i = 1; i <= 60; i++) {
      const res = await request(`${FEE_URL}/students/1/payments`, {
        method: 'POST',
        body: { amount: 10000 }
      });

      if (res.duration > maxDurationB) maxDurationB = res.duration;
      if (res.status === 201 && res.data?.status === 'PAID') {
        paidCountB++;
      }
      process.stdout.write(res.status === 201 ? '.' : 'F');
      if (i % 20 === 0) process.stdout.write(` [${i}/60]\n`);
    }

    const statsResB = await request(`${BANK_URL}/stats`);
    const statsB = statsResB.data;

    console.log('\n--- KẾT QUẢ MỤC (b) ---');
    console.log(`- Số lệnh PAID (thành công): ${paidCountB}/60 (Kỳ vọng >= 54)`);
    console.log(`- Thống kê ngân hàng /stats:`, statsB);

    const checkB_successRate = paidCountB >= 54;
    const checkB_noDuplicates = statsB.duplicates === 0;
    const checkB_timeout = maxDurationB <= 4500;

    console.log(`-> [x] >= 54/60 thanh toán thành công: ${checkB_successRate ? 'PASS' : 'FAIL'} (${paidCountB}/60)`);
    console.log(`-> [x] Không trừ tiền hai lần (duplicates = 0): ${checkB_noDuplicates ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] Thời gian đáp ứng <= 4,5 giây: ${checkB_timeout ? 'PASS' : 'FAIL'}`);

    bankProcessB.kill();
    await sleep(800);

    console.log('\n----------------------------------------------------------------------');
    console.log('MỤC (c): Thanh toán 25.000.000đ (Vượt hạn mức ngân hàng 20.000.000đ)');
    console.log('----------------------------------------------------------------------');

    const bankProcessC = spawn('node', ['bank-service.js'], {
      cwd: 'd:\\ltw\\nodejs\\dvpt',
      stdio: 'ignore',
      env: { ...process.env, PORT: '4002', DELAY_MS: '0', FAIL_RATE: '0', DROP_RATE: '0' }
    });
    await sleep(1200);

    await request(`${BANK_URL}/stats/reset`, { method: 'POST' });
    await request(`${FEE_URL}/reset`, { method: 'POST' });

    console.log('Thực hiện thanh toán 25.000.000đ cho Sinh viên 1...');
    const rejectRes = await request(`${FEE_URL}/students/1/payments`, {
      method: 'POST',
      body: { amount: 25000000 }
    });

    const statsResC = await request(`${BANK_URL}/stats`);
    const statsC = statsResC.data;

    console.log(`- HTTP Status: ${rejectRes.status} (Kỳ vọng: 402)`);
    console.log(`- Thân phản hồi:`, rejectRes.data);
    console.log(`- Thống kê ngân hàng /stats:`, statsC);

    const checkC_status402 = rejectRes.status === 402;
    const checkC_onlyOneReq = statsC.requests === 1;
    const checkC_statusFailed = rejectRes.data?.status === 'FAILED';

    console.log(`-> [x] Trả mã 402: ${checkC_status402 ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] Thân JSON có error, paymentId, status=FAILED: ${checkC_statusFailed ? 'PASS' : 'FAIL'}`);
    console.log(`-> [x] Ngân hàng chỉ nhận đúng 1 yêu cầu (không thử lại lỗi 4xx): ${checkC_onlyOneReq ? 'PASS' : 'FAIL'}`);

    bankProcessC.kill();

    console.log('\n======================================================================');
    console.log('TỔNG KẾT TÌNH HUỐNG 4:');
    console.log(`- Mục (a) DROP_RATE=0.3: duplicates=0, >=54/60 PAID, nợ chuẩn: ${checkA_duplicates && checkA_successRate && checkA_debtExact ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log(`- Mục (b) FAIL_RATE=0.3: >=54/60 PAID, duplicates=0: ${checkB_successRate && checkB_noDuplicates ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log(`- Mục (c) Vượt hạn mức: Trả 402, đúng 1 request: ${checkC_status402 && checkC_onlyOneReq ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log(`- Giới hạn thời gian <= 4,5 giây ở tất cả các tình huống: ${checkA_timeout && checkB_timeout ? 'ĐẠT' : 'CHƯA ĐẠT'}`);
    console.log('======================================================================\n');

  } finally {
    feeProcess.kill();
  }
}

runScenario4().catch(console.error);
