# 🎬 Mi Galería de Películas

Galería web responsiva que consume la API pública de **The Movie Database (TMDB)**
y muestra películas y series con filtros por género, rango de años y paginación.


## 🌐 Demo en vivo

👉 [Ver sitio publicado](https://rodrigocutinoa.github.io/mi-galeria-web/)

----------


## 🛠️ Tecnologías utilizadas

| Tecnología   | Uso                                                                 |
|--------------|---------------------------------------------------------------------|
| HTML5        | Estructura semántica: `aside`, `main`, `section`, `nav`, `footer`  |
| CSS3         | Variables `:root`, Grid responsivo, Flexbox, media queries, `:focus`|
| JavaScript   | `fetch`, `async/await`, `try/catch`, manipulación del DOM           |
| TMDB API     | Datos reales de películas y series (gratuita, sin clave de pago)    |

----------


## 📁 Estructura del proyecto

mi-galeria-web/
├── index.html          # Estructura HTML semántica y accesible
├── css/
│   └── estilos.css     # Variables, Grid, Flexbox, responsive, a11y
├── js/
│   └── app.js          # fetch, filtros, paginación, popup, errores
├── .gitignore
└── README.md


## ✨ Funcionalidades

- Galería de películas o series populares al cargar
- Filtro por tipo: Películas / Series
- Filtro por género desde el sidebar
- Filtro por rango de años con validación
- Paginación: anterior / siguiente manteniendo el contexto
- Popup de detalle al hacer click en una tarjeta
- Estado de carga y mensajes de error visibles al usuario
- Diseño responsivo: móvil, tablet y escritorio
- Accesibilidad: `aria-label`, `aria-live`, `aria-pressed`, navegación por teclado

----------


## 🚀 Cómo ejecutar localmente

No requiere instalación ni dependencias:

```bash
git clone git clone https://github.com/rodrigocutinoa/mi-galeria-web.git
cd mi-galeria-web
```

Abre `index.html` en tu navegador.
Si usas VS Code instala **Live Server** para evitar problemas de CORS.

----------


## 📡 API utilizada

**The Movie Database (TMDB)** — [themoviedb.org](https://www.themoviedb.org)

| Endpoint                  | Uso                              |
|---------------------------|----------------------------------|
| `GET /movie/popular`      | Películas populares              |
| `GET /tv/popular`         | Series populares                 |
| `GET /discover/movie`     | Películas con filtros            |
| `GET /discover/tv`        | Series con filtros               |
| `GET /genre/movie/list`   | Lista de géneros de películas    |
| `GET /genre/tv/list`      | Lista de géneros de series       |
| `GET /{tipo}/{id}`        | Detalle de un título             |

----------
