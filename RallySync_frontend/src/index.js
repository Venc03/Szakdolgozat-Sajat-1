import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SzervezoProvider } from './contexts/SzervezoContext';
import './css/szervezUrlap.css';
import { APIProvider } from './contexts/APIContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <APIProvider><SzervezoProvider><App /></SzervezoProvider></APIProvider>
  </React.StrictMode>
);