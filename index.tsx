
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React critical mount error:", err);
    rootElement.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; text-align:center; padding:20px; background:#f8fafc;">
        <div style="font-size:60px; margin-bottom:20px;">⚠️</div>
        <h2 style="color:#0f172a; margin-bottom:10px;">Une erreur est survenue</h2>
        <p style="color:#64748b; max-width:400px; line-height:1.5;">L'application n'a pas pu démarrer correctement. Veuillez rafraîchir la page ou vider le cache de votre navigateur.</p>
        <button onclick="window.location.reload()" style="margin-top:20px; padding:12px 24px; background:#10b981; color:white; border:none; border-radius:12px; font-weight:bold; cursor:pointer;">Réessayer</button>
      </div>
    `;
  }
}
