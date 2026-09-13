import { Accordion } from './components/Accordion/Accordion';
import { ProductList } from './components/ProductList/ProductList';
import { MOCK_PRODUCTS } from './data/mockProducts';
import './App.css';

export function TH02App() {
  return (
    <div className="app-layout">
      {/* Header chính */}
      <header className="app-header">
        <div className="header-badge">LTWNC - Bài Tập Tuần 2</div>
        <h1 className="app-title">React Advanced Component Patterns</h1>
        <p className="app-subtitle">
          Thực hành Compound Component Architecture &amp; Custom Hook <code>usePagination&lt;T&gt;</code>
        </p>
      </header>

      {/* Nội dung chính */}
      <main className="app-main">
        {/* Bài 2: Custom Hook usePagination<T> */}
        <section className="exercise-section">
          <div className="section-header">
            <span className="exercise-tag">Bài 2</span>
            <h2>Custom Hook <code>usePagination&lt;T&gt;</code></h2>
          </div>
          <ProductList products={MOCK_PRODUCTS} />
        </section>

        {/* Bài 1: Compound Component Accordion */}
        <section className="exercise-section">
          <div className="section-header">
            <span className="exercise-tag">Bài 1</span>
            <h2>Compound Component <code>Accordion</code> (Context API)</h2>
            <p className="section-desc">
              Thiết lập hệ thống Accordion có nhiều panel nhưng chỉ mở 1 panel duy nhất tại một thời điểm.
            </p>
          </div>

          <Accordion defaultOpenId="panel-1">
            <Accordion.Item id="panel-1">
              <Accordion.Header>
                🔍 1. Compound Component Pattern trong React là gì?
              </Accordion.Header>
              <Accordion.Content>
                <p>
                  <strong>Compound Components</strong> là một thiết kế mẫu (design pattern) nâng cao trong React giúp nhóm các component lại với nhau để thực hiện một nhiệm vụ chung và chia sẻ state thông qua Context API.
                </p>
                <p>
                  Giống như thẻ <code>&lt;select&gt;</code> và <code>&lt;option&gt;</code> trong HTML native, pattern này giúp code linh hoạt hơn, sạch sẽ hơn và truyền state ngầm định giữa cha và các con mà không gây <em>prop drilling</em>.
                </p>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item id="panel-2">
              <Accordion.Header>
                ⚙️ 2. Quy tắc single-panel open được xử lý ra sao?
              </Accordion.Header>
              <Accordion.Content>
                <p>
                  Trong <code>AccordionContext</code>, state <code>activeId</code> duy trì ID của panel duy nhất đang được mở.
                </p>
                <p>
                  Khi người dùng nhấn vào một <code>Accordion.Header</code>, hàm <code>toggleItem(id)</code> được gọi:
                </p>
                <ul>
                  <li>Nếu <code>id</code> trùng với <code>activeId</code> &rarr; đóng panel (chuyển sang <code>null</code>).</li>
                  <li>Nếu <code>id</code> khác <code>activeId</code> &rarr; mở panel mới và tự động đóng panel trước đó.</li>
                </ul>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item id="panel-3">
              <Accordion.Header>
                🚀 3. Custom Hook <code>usePagination&lt;T&gt;</code> hoạt động như thế nào?
              </Accordion.Header>
              <Accordion.Content>
                <p>
                  Hook <code>usePagination&lt;T&gt;</code> là một generic hook chấp nhận bất kỳ kiểu dữ liệu mảng nào.
                </p>
                <p>Nó tự động tính toán:</p>
                <ul>
                  <li><code>totalPages</code> = Math.ceil(data.length / itemsPerPage)</li>
                  <li><code>currentData</code> = data.slice(startIndex, endIndex)</li>
                  <li>Các hàm điều khiển: <code>nextPage()</code>, <code>prevPage()</code>, <code>goToPage(page)</code></li>
                </ul>
                <p>
                  Tất cả các hàm và giá trị đều được tối ưu memoization với <code>useMemo</code> và <code>useCallback</code>.
                </p>
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item id="panel-4">
              <Accordion.Header>
                ♿ 4. Tiêu chuẩn Accessibility (ARIA) có được hỗ trợ?
              </Accordion.Header>
              <Accordion.Content>
                <p>
                  Có. Mọi panel và trigger header đều tuân thủ chặt chẽ chuẩn ARIA:
                </p>
                <ul>
                  <li><code>aria-expanded</code> thể hiện trạng thái đóng/mở.</li>
                  <li><code>aria-controls</code> liên kết trigger button với nội dung panel.</li>
                  <li><code>role="region"</code> và <code>aria-labelledby</code> hỗ trợ Screen Reader.</li>
                  <li>Hỗ trợ tương tác hoàn toàn bằng bàn phím (Enter / Space key).</li>
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Báo cáo Bài tập LTWNC - Tuần 2 &copy; 2026</p>
      </footer>
    </div>
  );
}

export default TH02App;
