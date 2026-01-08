
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Critical rendering error:", error);
    container.innerHTML = `
      <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px; background:#f8fafc;">
        <h2 style="color:#e11d48; font-weight:900;">Erreur de chargement</h2>
        <p style="color:#64748b; font-weight:500;">Veuillez vider le cache de votre navigateur et rafraîchir la page.</p>
        <button onclick="window.location.reload()" style="margin-top:24px; padding:12px 32px; background:#10b981; color:white; border:none; border-radius:16px; cursor:pointer; font-weight:900; box-shadow:0 10px 15px -3px rgba(16,185,129,0.2);">RAFRAÎCHIR</button>
      </div>
    `;
  }
}
