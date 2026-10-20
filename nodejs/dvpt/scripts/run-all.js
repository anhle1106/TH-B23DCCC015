import { spawn } from 'child_process';

const scenarios = [
  { name: 'Tình huống 1: Ngân hàng không kết nối được rồi hoạt động lại', file: 'scripts/test-th1.js' },
  { name: 'Tình huống 2: Ngân hàng phản hồi rất chậm (DELAY_MS=5000)', file: 'scripts/test-th2.js' },
  { name: 'Tình huống 3: Duy trì kết nối TCP (Keep-Alive Connection Pool)', file: 'scripts/test-th3.js' },
  { name: 'Tình huống 4: Đứt giữa chừng, lỗi tạm thời, bị từ chối', file: 'scripts/test-th4.js' },
];

function runScript(scriptPath) {
  return new Promise((resolve) => {
    console.log(`\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`);
    console.log(`BẮT ĐẦU: ${scriptPath}`);
    console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n`);

    const child = spawn('node', [scriptPath], {
      cwd: 'd:\\ltw\\nodejs\\dvpt',
      stdio: 'inherit'
    });

    child.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

async function main() {
  console.log('######################################################################');
  console.log('HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG (PTIT)');
  console.log('MÔN HỌC: PHÁT TRIỂN PHẦN MỀM HƯỚNG DỊCH VỤ - INT1448');
  console.log('LAB 3: KẾT NỐI NỘI DUNG - THANH TOÁN HỌC PHÍ TRỰC TUYẾN');
  console.log('######################################################################\n');

  const results = [];

  for (const sc of scenarios) {
    const success = await runScript(sc.file);
    results.push({ ...sc, success });
  }

  console.log('\n======================================================================');
  console.log('BẢNG TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ 4 TÌNH HUỐNG (LAB 3)');
  console.log('======================================================================');
  results.forEach((r, idx) => {
    const statusText = r.success ? '✅ HOÀN THÀNH XUẤT SẮC' : '❌ CẦN KIỂM TRA LẠI';
    console.log(`${idx + 1}. ${r.name}`);
    console.log(`   Trạng thái: ${statusText}`);
  });
  console.log('======================================================================\n');
}

main().catch(console.error);
