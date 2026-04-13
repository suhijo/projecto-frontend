# Digital Solutions – Prototipo Funcional

**Entrega 2 · Semana 5** · Desarrollo Front-end

---

## Descripción

Prototipo funcional del sitio web corporativo **Digital Solutions**, empresa de tecnología y marketing digital. Desarrollado íntegramente con HTML5, CSS3 y JavaScript puro (sin frameworks).

---

## Estado de funcionalidades

| # | Funcionalidad | Estado |
|---|---|---|
| 1 | Desarrollo en HTML, CSS y JavaScript | ✅ |
| 2 | Renderizado dinámico de servicios desde JSON | ✅ |
| 3 | Funcionalidad de favoritos (localStorage) | ✅ |
| 4 | Formularios con validaciones | ✅ |
| 5 | Código estructurado en archivos separados | ✅ |
| 6 | Repositorio en GitHub | ✅ |

---

## Estructura del proyecto

```
digital-solutions/
├── index.html              # Estructura HTML principal (SPA – 3 secciones)
├── css/
│   └── styles.css          # Todos los estilos (variables, layouts, responsive)
├── js/
│   └── app.js              # Lógica JS: servicios, favoritos, navegación, validación
├── data/
│   └── services.json       # Datos de servicios en formato JSON
├── img/
│   └── default.jpg         # Imagen de placeholder
└── README.md
```

---

## Tecnologías

- **HTML5** – Semántica (`<nav>`, `<section>`, `<article>`, `<footer>`, `aria-*`)
- **CSS3** – Variables CSS, Grid, Flexbox, transiciones, diseño responsive
- **JavaScript ES6+** – `async/await`, `fetch()`, `localStorage`, DOM API
- **Font Awesome 6** – Iconografía via CDN

---

## Cómo ejecutar

### Opción A – Archivo directo (sin servidor)
Abrir `index.html` directamente en el navegador.
Los servicios se cargan desde los datos embebidos en `app.js` como fallback automático.

### Opción B – Servidor local (carga real del JSON)
```bash
# Python 3
python -m http.server 8080
# Node.js
npx serve .
```
Luego acceder a `http://localhost:8080`

---

## Detalle de funcionalidades

### Renderizado dinámico de servicios
- Los servicios se definen en `data/services.json`.
- `app.js` usa `fetch()` para cargar el JSON y construye dinámicamente las tarjetas HTML.
- Si `fetch()` falla (apertura desde `file://`), se activa un fallback con los mismos datos embebidos.

### Funcionalidad de favoritos
- Cada tarjeta tiene un botón de **corazón** para marcar/desmarcar favorito.
- Los favoritos se guardan en `localStorage` y persisten entre visitas.
- El filtro **Favoritos** muestra solo los servicios marcados.
- Un contador en el botón indica cuántos favoritos hay.

### Validaciones del formulario

| Campo | ¿Requerido? | Regla |
|---|---|---|
| Nombre completo | Sí | Mínimo 3 caracteres |
| Email | Sí | Formato `usuario@dominio.ext` (regex) |
| Teléfono | No | Si se llena: 7–20 caracteres válidos |
| Mensaje | Sí | Mínimo 10 caracteres |

- Validación en tiempo real al salir de cada campo (`blur`).
- Bordes rojo/verde según estado del campo.
- Mensaje de éxito al enviar correctamente.

---

## Autor

Proyecto universitario – Desarrollo Front-end
© 2026 Digital Solutions
