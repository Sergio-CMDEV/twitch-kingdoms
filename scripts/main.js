// URL base del backend desplegado en Render
const BACKEND_URL = 'https://backend-twitch-project.onrender.com';
const API_URL = 'https://backend-twitch-project.onrender.com';

// Este script hace una petición al backend para obtener datos y mostrarlos en la página

async function cargarUsuarios() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/usuarios`, {
      credentials: 'include'
    });
    const data = await response.json();
    const lista = document.getElementById('usuarios-lista');
    lista.innerHTML = '';
    data.forEach(usuario => {
      const li = document.createElement('li');
      li.textContent = usuario.nombre || JSON.stringify(usuario);
      lista.appendChild(li);
    });
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarUsuarios);

    let currentLang = 'es';

    const translations = {
      es: {
        dashboard: 'Tablero',
        tropas: 'Tropas',
        edificios: 'Edificios',
        tienda: 'Tienda',
        chat: 'Chat',
        noticias: 'Noticias',
        estadisticas: 'Estadísticas',
        logout: 'Cerrar sesión',
        changeLang: 'Cambiar Idioma'
      },
      en: {
        dashboard: 'Dashboard',
        tropas: 'Troops',
        edificios: 'Buildings',
        tienda: 'Shop',
        chat: 'Chat',
        noticias: 'News',
        estadisticas: 'Statistics',
        logout: 'Log out',
        changeLang: 'Change Language'
      }
    };

    async function obtenerDatosUsuario() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/usuario`, {
          credentials: 'include'
        });
        const data = await res.json();
        return data;
      } catch (err) {
        console.error("Error al obtener datos del usuario:", err);
        return null;
      }
    }
    function updateSidebarText() {
      const t = translations[currentLang];
      document.getElementById('menu-dashboard').textContent = t.dashboard;
      document.getElementById('menu-tropas').textContent = t.tropas;
      document.getElementById('menu-edificios').textContent = t.edificios;
      document.getElementById('menu-tienda').textContent = t.tienda;
      document.getElementById('menu-chat').textContent = t.chat;
      document.getElementById('menu-noticias').textContent = t.noticias;
      document.getElementById('menu-estadisticas').textContent = t.estadisticas;
      document.getElementById('logout-btn').textContent = t.logout;
      document.getElementById('lang-btn').textContent = t.changeLang;
    }

    function toggleLanguage() {
      currentLang = currentLang === 'es' ? 'en' : 'es';
      updateSidebarText();
      // Notificar a la sección cargada del cambio de idioma
      const event = new CustomEvent('setLang', { detail: currentLang });
      window.dispatchEvent(event);
    }

    function animateTransition(element) {
      element.classList.remove('fade-enter', 'fade-enter-active');
      void element.offsetWidth;
      element.classList.add('fade-enter');
      setTimeout(() => {
        element.classList.add('fade-enter-active');
      }, 10);
      setTimeout(() => {
        element.classList.remove('fade-enter');
        element.classList.remove('fade-enter-active');
      }, 210);
    }

    function logout() {
      alert(currentLang === 'es' ? 'Cerrando sesión...' : 'Logging out...');
    }

    function crearTarjetaTropa(nombre, cantidad) {
      return `
        <div class="bg-gray-800 p-5 rounded-lg shadow flex flex-col justify-between space-y-4 transition duration-150 hover:scale-105">
          <div>
            <h2 class="text-xl font-bold">${nombre}</h2>
            <p class="text-gray-400">Cantidad: <span class="font-semibold">${cantidad}</span></p>
          </div>
          <div class="flex gap-2">
            <button class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full transition duration-150">Reclutar</button>
            <button class="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded w-full transition duration-150">Mejorar</button>
          </div>
        </div>
      `;
    }

    function loadSection(section = 'dashboard') {
      localStorage.setItem('currentSection', section);
      const content = document.getElementById('main-content');
      animateTransition(content);
      fetch(`/sections/${section}.html`)
        .then(res => {
          if (!res.ok) throw new Error('No se pudo cargar la sección');
          return res.text();
        })
        .then(html => {
          content.innerHTML = html;
          // Ejecutar scripts embebidos manualmente (siempre, incluso si ya existen)
          const scripts = content.querySelectorAll('script');
          scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            if (oldScript.src) {
              newScript.src = oldScript.src;
            } else {
              newScript.textContent = oldScript.textContent;
            }
            document.body.appendChild(newScript);
            oldScript.remove();
          });
          // Si es la sección de tropas, ejecuta las funciones de renderizado
          if (section === 'tropas') {
            if (typeof renderTropas === 'function') renderTropas();
            if (typeof renderDetails === 'function') renderDetails(null);
          }
          // Si es la sección de noticias, fuerza la carga de noticias
          if (section === 'noticias') {
            if (typeof setLangNoticias === 'function') setLangNoticias(currentLang);
          }
          // Si es la sección de dashboard, fuerza la carga de actividad y noticias
          if (section === 'dashboard') {
            if (typeof cargarActividad === 'function') cargarActividad();
            if (typeof cargarNoticias === 'function') cargarNoticias();
            if (typeof mostrarBotonAdmin === 'function') mostrarBotonAdmin();
            if (typeof cargarDashboard === 'function') cargarDashboard();
          }
          // Si es la sección de actividad, fuerza la carga de actividad
          if (section === 'actividad') {
            if (typeof cargarActividad === 'function') cargarActividad();
          }
        })
        .catch(err => {
          content.innerHTML = `<div class='text-red-500'>${err.message}</div>`;
        });
    }

    // Al cargar la página, restaura la sección guardada SOLO si no está ya cargada
    document.addEventListener('DOMContentLoaded', () => {
      setSidebarUserName();
      updateSidebarText();
      checkTwitchLive();
      const lastSection = localStorage.getItem('currentSection') || 'dashboard';
      if (!window._sectionLoaded) {
        window._sectionLoaded = true;
        loadSection(lastSection);
      }
    });

    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      const showBtn = document.getElementById('show-sidebar-btn');
      if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        showBtn.classList.add('hidden');
      } else {
        sidebar.classList.add('hidden');
        showBtn.classList.remove('hidden');
      }
    }

    async function setSidebarUserName() {
      const user = await obtenerDatosUsuario();
      const sidebarTitle = document.querySelector('#sidebar h2');
      let sidebarProfileImg = document.getElementById('sidebar-profile-img');
      // Usar imagen de perfil de Twitch o fallback
      if (user && user.profile_image_url) {
        sidebarProfileImg.src = user.profile_image_url;
        sidebarProfileImg.onerror = function() {
          sidebarProfileImg.src = '/img/default-profile.png';
        };
        sidebarProfileImg.style.display = '';
      } else {
        sidebarProfileImg.src = '/img/default-profile.png';
        sidebarProfileImg.style.display = '';
      }
      // Limita el nombre y añade puntos suspensivos si es largo
      if (user && user.display_name) {
        let nombre = user.display_name;
        if (nombre.length > 10) {
          nombre = nombre.slice(0, 7) + '...';
        }
        sidebarTitle.textContent = nombre;
      } else {
        sidebarTitle.textContent = 'DearBird';
      }
    }

    async function checkTwitchLive() {
      try {
        const res = await fetch('https://api.twitch.tv/helix/streams?user_login=DearBird', {
          headers: {
            'Client-ID': 'YOUR_TWITCH_CLIENT_ID',
            'Authorization': 'Bearer YOUR_TWITCH_OAUTH_TOKEN'
          }
        });
        const data = await res.json();
        const isLive = data.data && data.data.length > 0;
        const chatMenu = document.getElementById('menu-chat');
        let indicator = document.getElementById('chat-live-indicator');
        if (isLive) {
          if (!indicator) {
            indicator = document.createElement('span');
            indicator.id = 'chat-live-indicator';
            indicator.className = 'chat-live-indicator';
            chatMenu.appendChild(indicator);
          }
        } else if (indicator) {
          indicator.remove();
        }
      } catch (e) { /* Silenciar error */ }
    }

    document.addEventListener('DOMContentLoaded', () => {
      setSidebarUserName();
      updateSidebarText();
      checkTwitchLive();
      setInterval(checkTwitchLive, 60000); // Actualiza cada minuto
    });

    window.onload = () => {
      loadSection('dashboard');
    };

    // async function mostrarBotonAdminSidebar() {
    //   const usuario = await fetch('/api/usuario').then(r => r.json());
    //   if (usuario.is_admin) {
    //     const sidebar = document.getElementById('sidebar-menu');
    //     const adminBtn = document.createElement('a');
    //     adminBtn.href = '/admin';
    //     adminBtn.className = 'bg-purple-700 hover:bg-purple-800 text-white p-2 rounded font-bold flex items-center gap-2 mt-2';
    //     adminBtn.innerHTML = "<i class='fa-solid fa-crown'></i> Panel Admin";
    //     sidebar.insertBefore(adminBtn, document.getElementById('logout-btn'));
    //   }
    // }

    function getAccessTokenFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get("access_token");
    }

    const accessToken = getAccessTokenFromUrl();
    if (accessToken) {
      console.log("Token de Twitch:", accessToken);
      // Puedes guardar el token en localStorage para usarlo después
      localStorage.setItem('twitch_access_token', accessToken);
      // Aquí puedes hacer peticiones autenticadas o redirigir si es necesario
    }

    // Botón de login con Twitch (asegura siempre la URL completa del backend)
    const loginTwitchBtn = document.getElementById('loginTwitch');
    if (loginTwitchBtn) {
      loginTwitchBtn.onclick = () => {
        window.location.href = `${BACKEND_URL}/auth/twitch`;
      };
    }

    // Si usas un enlace HTML, asegúrate de que apunte a la URL completa:
    // <a href="https://backend-twitch-project.onrender.com/auth/twitch">Login con Twitch</a>

fetch(`${API_URL}/api/usuario`, { credentials: 'include' })
  .then(res => res.json())
  .then(data => console.log(data));
