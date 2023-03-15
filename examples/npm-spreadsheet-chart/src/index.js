import React  from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import { codeSpreadSheet, codeChart } from './codes';

function App() {
  return (
  <>
    <header>
      <h1 class="header-h1">NPM Spread Sheet and Chart</h1>
    </header>

    <main>
      <section>
        <h3 class="main-sec1-h3">Spread Sheet</h3>
        <button type="button" class="main-sec2-col-button" onClick={() => window.open('https://iddan.github.io/react-spreadsheet/docs/')}>react-spead-sheet document</button>
        <p class="main-sec-p main-purple-600 main-pt"><b>Installation</b></p>
        <p class="main-sec-p main-pb">$ npm install scheduler react-spreadsheet</p>
        <p class="main-sec-p main-purple-600"><b>Source Code</b></p>
        <pre class="main-pb2">{codeSpreadSheet}</pre>
      </section>

      <section>
      <h3 class="main-sec1-h3">Chart</h3>
        <button type="button" class="main-sec2-col-button" onClick={() => window.open('https://recharts.org/en-US/guide/installation')}>recharts document</button>
        <p class="main-sec-p main-purple-600 main-pt"><b>Installation</b></p>
        <p class="main-sec-p main-pb">$ npm install recharts</p>
        <p class="main-sec-p main-purple-600"><b>Source Code</b></p>
        <pre class="main-pb2">{codeChart}</pre>
      </section>
    </main>

    <footer>
      <h3 class="footer-h3">-</h3>
    </footer>
  </>
  );
}

// "index.html"의 <div>중 id="root"를 찾아옵니다.
const root = ReactDOM.createRoot(document.getElementById('root'));
// id="root"를 가진 div에 아래 html 코드를 렌더링 해줍니다.
root.render(<App />);