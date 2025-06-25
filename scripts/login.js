// scripts/login.js
// Se asume que config.js ya se cargó antes
const BACKEND = window.BACKEND_URL;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('login-button');
  btn.addEventListener('click', () => {
    window.location.href = `${BACKEND}/auth/twitch`;
  });
});
