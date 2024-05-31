import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import CoreApi from '@ca/core-api'


new CoreApi().init()
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
