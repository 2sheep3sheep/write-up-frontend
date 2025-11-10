import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/auth.css'; // глобальний стиль для auth екранів
import './styles/post-auth.css'; //import styles for post-auth elements

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);