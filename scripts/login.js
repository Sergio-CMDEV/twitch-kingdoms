// scripts/login.js
const BACKEND = window.BACKEND_URL;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('login-button');
  if (btn) {
    btn.addEventListener('click', () => {
      window.location.href = `${BACKEND}/auth/twitch`;
    });
  }
});
