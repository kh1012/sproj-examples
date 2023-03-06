import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (<>요거슨 테스트!</>);
}

function Entry() {
  return (<App />);
}

// "index.html"의 <div>중 id="root"를 찾아옵니다.
const root = ReactDOM.createRoot(document.getElementById('root'));
// id="root"를 가진 div에 아래 html 코드를 렌더링 해줍니다.
root.render(<Entry />);