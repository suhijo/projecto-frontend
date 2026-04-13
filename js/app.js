'use strict';

/* ============================================================
   DATOS DE FALLBACK
   ============================================================ */
const FALLBACK_SERVICES = [
  {
    id: 1,
    nombre: 'Diseño Web',
    descripcion: 'Creamos sitios web modernos, responsivos y optimizados para motores de búsqueda que generan resultados reales para tu negocio.',
    precio: '$999',
    imagen: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    categoria: 'Desarrollo'
  },
  {
    id: 2,
    nombre: 'Marketing Digital',
    descripcion: 'Estrategias de marketing digital personalizadas para hacer crecer tu audiencia y aumentar tus ventas en línea.',
    precio: '$1,499',
    imagen: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    categoria: 'Marketing'
  },
  {
    id: 3,
    nombre: 'Aplicaciones Móviles',
    descripcion: 'Desarrollamos aplicaciones nativas y multiplataforma para iOS y Android con experiencias de usuario excepcionales.',
    precio: '$2,999',
    imagen: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    categoria: 'Desarrollo'
  },
  {
    id: 4,
    nombre: 'Consultoría Tecnológica',
    descripcion: 'Asesoramos a tu empresa para tomar las mejores decisiones tecnológicas y optimizar tus procesos digitales.',
    precio: '$499',
    imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    categoria: 'Consultoría'
  },
  {
    id: 5,
    nombre: 'SEO & Posicionamiento',
    descripcion: 'Mejora la visibilidad de tu negocio en los motores de búsqueda y atrae más clientes de forma orgánica.',
    precio: '$799',
    imagen: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&w=800&q=80',
    categoria: 'Marketing'
  },
  {
    id: 6,
    nombre: 'Soporte Técnico',
    descripcion: 'Mantenemos tu infraestructura digital funcionando al máximo con soporte técnico especializado 24/7.',
    precio: '$299',
    imagen: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    categoria: 'Soporte'
  }
];

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */
let allServices  = [];
let activeFilter = 'all';

/* ============================================================
   MÓDULO: FAVORITOS
   Persiste IDs en localStorage bajo la clave 'ds_favorites'.
   ============================================================ */
const Favorites = {
  /** Devuelve el array de IDs favoritos */
  getAll() {
    try {
      return JSON.parse(localStorage.getItem('ds_favorites') || '[]');
    } catch {
      return [];
    }
  },

  /** Agrega o elimina un servicio de favoritos. Retorna true si quedó como favorito. */
  toggle(id) {
    const favs = this.getAll();
    const idx  = favs.indexOf(id);
    if (idx === -1) { favs.push(id); } else { favs.splice(idx, 1); }
    localStorage.setItem('ds_favorites', JSON.stringify(favs));
    this.updateBadge();
    return favs.includes(id);
  },

  /** Comprueba si un ID está en favoritos */
  has(id) {
    return this.getAll().includes(id);
  },

  /** Actualiza el contador visible en el botón de filtro */
  updateBadge() {
    const badge = document.getElementById('fav-count');
    if (badge) badge.textContent = this.getAll().length;
  }
};

/* ============================================================
   MÓDULO: CARGA DE SERVICIOS
   Intenta fetch('data/services.json'); si falla usa FALLBACK_SERVICES.
   ============================================================ */
async function loadServices() {
  try {
    const res = await fetch('data/services.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.info('[DS] Servicios cargados desde data/services.json');
    return data;
  } catch (err) {
    console.warn('[DS] Usando datos embebidos (fetch no disponible):', err.message);
    return FALLBACK_SERVICES;
  }
}

/* ============================================================
   MÓDULO: RENDERIZADO DE SERVICIOS
   ============================================================ */

/**
 * Escapa texto para uso seguro en innerHTML (previene XSS).
 * @param {*} str
 * @returns {string}
 */
function escHtml(str) {
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(String(str ?? '')));
  return el.innerHTML;
}

/**
 * Construye el HTML de una tarjeta de servicio.
 * @param {object} service
 * @returns {string}
 */
function buildCard(service) {
  const fav = Favorites.has(service.id);
  return `
    <article class="service-card" data-id="${service.id}">
      <div class="card-image">
        <img
          src="${escHtml(service.imagen)}"
          alt="${escHtml(service.nombre)}"
          loading="lazy"
          onerror="this.src='img/default.jpg'"
        >
        <div class="card-overlay">
          <h3>${escHtml(service.nombre)}</h3>
          <p class="price">Desde ${escHtml(service.precio)}</p>
        </div>
        <button
          class="card-fav-btn ${fav ? 'active' : ''}"
          data-service-id="${service.id}"
          aria-label="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
          title="${fav ? 'Quitar de favoritos' : 'Agregar a favoritos'}"
        >
          <i class="${fav ? 'fas' : 'far'} fa-heart"></i>
        </button>
      </div>
      <div class="card-body">
        <p>${escHtml(service.descripcion)}</p>
        <span class="card-tag">${escHtml(service.categoria)}</span>
      </div>
    </article>`;
}

/**
 * Renderiza las tarjetas en el contenedor aplicando el filtro activo.
 * @param {object[]} services
 */
function renderServices(services) {
  const container = document.getElementById('services-container');
  if (!container) return;

  const list = activeFilter === 'favoritos'
    ? services.filter(s => Favorites.has(s.id))
    : services;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-${activeFilter === 'favoritos' ? 'heart-crack' : 'box-open'}"></i>
        <p>${activeFilter === 'favoritos'
          ? 'Aún no has guardado favoritos. ¡Haz clic en el corazón de un servicio!'
          : 'No hay servicios disponibles.'
        }</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(buildCard).join('');

  /* Adjuntar eventos al botón de favorito de cada tarjeta */
  container.querySelectorAll('.card-fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = parseInt(btn.dataset.serviceId, 10);
      const nowFav = Favorites.toggle(id);

      btn.classList.toggle('active', nowFav);
      btn.setAttribute('aria-label', nowFav ? 'Quitar de favoritos' : 'Agregar a favoritos');
      btn.querySelector('i').className = nowFav ? 'fas fa-heart' : 'far fa-heart';

      /* Si estamos en el filtro de favoritos y se desmarcó, re-renderizar */
      if (activeFilter === 'favoritos') renderServices(allServices);
    });
  });
}

/* ============================================================
   MÓDULO: NAVEGACIÓN SPA
   ============================================================ */

/**
 * Muestra la sección indicada y actualiza los enlaces del menú.
 * @param {string} sectionId – 'home' | 'servicios' | 'contacto'
 */
function navigate(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    const isActive = link.dataset.section === sectionId
      && !link.classList.contains('btn-primary');
    link.classList.toggle('active', isActive);
  });
}

/* ============================================================
   MÓDULO: VALIDACIÓN DEL FORMULARIO
   ============================================================ */
const fieldRules = {
  nombre: v => {
    if (!v.trim())            return 'El nombre es obligatorio.';
    if (v.trim().length < 3)  return 'Mínimo 3 caracteres.';
    return '';
  },
  email: v => {
    if (!v.trim()) return 'El email es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Ingresa un email válido.';
    return '';
  },
  telefono: v => {
    if (!v.trim()) return ''; /* opcional */
    if (!/^[+]?[\d\s\-(). ]{7,20}$/.test(v.trim())) return 'Formato de teléfono inválido.';
    return '';
  },
  mensaje: v => {
    if (!v.trim())             return 'El mensaje es obligatorio.';
    if (v.trim().length < 10)  return 'Mínimo 10 caracteres.';
    return '';
  }
};

/**
 * Valida un campo individual y actualiza su estado visual.
 * @param {string} fieldId
 * @returns {boolean}
 */
function validateField(fieldId) {
  const field   = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (!field || !errorEl || !fieldRules[fieldId]) return true;

  const msg = fieldRules[fieldId](field.value);
  errorEl.textContent = msg;

  if (msg) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    return false;
  }
  field.classList.remove('is-invalid');
  if (field.value.trim()) field.classList.add('is-valid');
  return true;
}

/** Configura validación en tiempo real y envío del formulario de contacto. */
function setupForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  Object.keys(fieldRules).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid')) validateField(id);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const allValid = Object.keys(fieldRules).map(validateField).every(Boolean);
    if (!allValid) return;

    const successEl = document.getElementById('form-success');
    if (successEl) {
      successEl.style.display = 'flex';
      form.reset();
      form.querySelectorAll('input, textarea, select').forEach(el => {
        el.classList.remove('is-valid', 'is-invalid');
      });
      setTimeout(() => { successEl.style.display = 'none'; }, 6000);
    }
  });
}

/**
 * Rellena el <select> de "Servicio de interés" con las opciones del JSON.
 * @param {object[]} services
 */
function populateServiceDropdown(services) {
  const select = document.getElementById('servicio');
  if (!select) return;
  services.forEach(s => {
    const opt      = document.createElement('option');
    opt.value      = s.id;
    opt.textContent = s.nombre;
    select.appendChild(opt);
  });
}

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', async () => {
  /* 1. Cargar servicios (fetch o fallback) */
  allServices = await loadServices();

  /* 2. Renderizar tarjetas */
  renderServices(allServices);

  /* 3. Poblar dropdown del formulario */
  populateServiceDropdown(allServices);

  /* 4. Iniciar contador de favoritos */
  Favorites.updateBadge();

  /* 5. Configurar navegación SPA */
  document.querySelectorAll('[data-section]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      navigate(el.dataset.section);
    });
  });

  /* 6. Configurar filtros de servicios */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderServices(allServices);
    });
  });

  /* 7. Inicializar formulario */
  setupForm();

  /* 8. Mostrar sección inicial */
  navigate('home');
});
