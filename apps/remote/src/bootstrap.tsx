import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import CoreApi from '@ca/core-api'


new CoreApi().init()
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);