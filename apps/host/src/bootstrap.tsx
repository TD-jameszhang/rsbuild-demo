import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CoreApi from '@ca/core-api'


// @ts-ignore
window.hellojames = __webpack_require__

CoreApi.init({data: {name: 'james', age: 30}})
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
