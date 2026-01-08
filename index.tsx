
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
      <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
        <h2 style="color:#e11d48;">Une erreur est survenue</h2>
        <p style="color:#64748b;">Veuillez rafraîchir la page. Si le problème persiste, contactez le support.</p>
        <button onclick="window.location.reload()" style="margin-top:20px; padding:10px 20px; background:#10b981; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold;">Rafraîchir</button>
      </div>
    `;
  }
}
