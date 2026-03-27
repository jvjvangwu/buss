import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 检查环境变量
if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL环境变量未设置，将使用默认值: http://localhost:3000/api');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);