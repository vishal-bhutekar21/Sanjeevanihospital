import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './lib/i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Safety net: if any image fails to load, show a calm neutral tile instead of a broken icon.
const IMG_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"><rect width="4" height="3" fill="#EFEBE3"/></svg>');
window.addEventListener(
  'error',
  (e) => {
    const el = e.target as HTMLImageElement;
    if (el && el.tagName === 'IMG' && el.src !== IMG_FALLBACK) {
      el.src = IMG_FALLBACK;
      el.alt = '';
    }
  },
  true,
);

