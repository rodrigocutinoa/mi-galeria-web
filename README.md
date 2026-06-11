## mi-galeria-web

# Estructura del proyecto
mi-galeria-web/
├── index.html
├── css/
│   └── estilos.css
├── js/
│   └── app.js
├── .gitignore
└── README.md



# 🍽️ Mi Galería Web - Películas
Galería responsiva de recetas que consume una API pública

## 🌐 Demo
[Ver sitio publicado](https://TU-USUARIO.github.io/mi-galeria-web)

## 🛠️ Tecnologías
- HTML5 semántico
- CSS3 (Grid, variables, media queries)
- JavaScript (fetch, async/await)
- API

## 🚀 Cómo correr localmente
Clona el repo y abre index.html en tu navegador. Sin instalaciones.



## 🛠️ Plan de implementación
# feat: estructura inicial del proyecto
Crea carpetas css/, js/ y archivos vacíos index.html, estilos.css, app.js, .gitignore

# feat: agrega esqueleto HTML semántico
header, main, aside, section, footer — aria-*, lang="es", labels asociados

# feat: agrega estilos base y paleta de colores
Variables :root, reset, tipografía Montserrat, clase .sr-only

# feat: agrega layout grid responsivo de tarjetas
CSS Grid con auto-fill, tarjetas article.main__media, 3 media queries

# feat:agrega estilos de sidebar y botones
Sidebar sticky, .btn, .btn--active, :focus outline 3px, :hover con transición

# feat: implementa fetch de películas desde TMDB
fetchPopulares(), fetchGeneros(), renderTarjetas() — estado inicial al cargar

# feat: agrega manejo de errores y estado de carga
try/catch en todos los fetch, response.ok, div#estado con aria-live

# fea: tagrega filtro por género y tipo Película/Serie
fetchDescubrir(), listeners sidebar, estado.tipo / estado.idGenero, aria-pressed

# feat: agrega paginación y popup de detalle
Botones anterior/siguiente, fetchDetalle(), modal accesible, cierre con Escape 

# docsagrega README y configura GitHub Pages
README con enlace al sitio, tabla de commits, instrucciones de instalación