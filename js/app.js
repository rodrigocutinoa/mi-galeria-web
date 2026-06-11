/* =============================================
   CONFIGURACIÓN TMDB
   ============================================= */
const API_KEY = "c0776826dd9e8fb4d705f0dee584cee3";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL  = "https://image.tmdb.org/t/p/w500";
const IMG_PLACEHOLDER = "https://placehold.co/300x450?text=Sin+imagen";

/* =============================================
   REFERENCIAS AL DOM
   ============================================= */
const contenedorGrid    = document.getElementById("populares");
const contenedorGeneros = document.getElementById("filtro-generos");
const tituloGaleria     = document.getElementById("titulo-galeria");
const numPagina         = document.getElementById("num-pagina");

/* =============================================
   ESTADO DE LA APLICACIÓN
   ============================================= */
let estado = {
  tipo:     "movie",
  pagina:   1,
  idGenero: null,
};

/* =============================================
   FETCH: GÉNEROS
   ============================================= */
async function fetchGeneros(tipo = "movie") {
  const url = `${BASE_URL}/genre/${tipo}/list?api_key=${API_KEY}&language=es-MX`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  return datos.genres;
}

/* =============================================
   FETCH: POPULARES
   ============================================= */
 function fetchPopulares(tipo = "movie", pagina = 1) {
  const url = `${BASE_URL}/${tipo}/popular?api_key=${API_KEY}&language=es-MX&page=${pagina}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  return datos.results;
}

/* =============================================
   HELPERS
   ============================================= */
function obtenerNombreGenero(id, generos) {
  const encontrado = generos.find((g) => g.id === id);
  return encontrado ? encontrado.name : "—";
}

function actualizarNumeroPagina() {
  numPagina.textContent = `Página ${estado.pagina}`;
  contenedorGrid.dataset.pagina = estado.pagina;
}

/* =============================================
   RENDER: TARJETAS
   ============================================= */
function renderTarjetas(resultados, generos) {
  contenedorGrid.innerHTML = "";

  resultados.forEach((item) => {
    // Validación: descarta items sin título
    if (!item || (!item.title && !item.name)) return;

    const titulo = item.title  || item.name  || "Sin título";
    const fecha  = item.release_date || item.first_air_date || "";
    const anio   = fecha ? fecha.substring(0, 4) : "—";
    const genero = item.genre_ids?.[0]
                   ? obtenerNombreGenero(item.genre_ids[0], generos)
                   : "—";
    const imgSrc = item.poster_path
                   ? `${IMG_URL}${item.poster_path}`
                   : IMG_PLACEHOLDER;

    const tarjeta = document.createElement("article");
    tarjeta.className = "main__media";
    tarjeta.setAttribute("data-id", item.id);
    tarjeta.setAttribute("tabindex", "0");
    tarjeta.setAttribute("role", "button");
    tarjeta.setAttribute("aria-label", `Ver detalle de ${titulo}`);

    tarjeta.innerHTML = `
      <img
        class="main__media-img"
        src="${imgSrc}"
        alt="Póster de ${titulo}"
        loading="lazy"
      />
      <div class="main__media-body">
        <p class="main__media-titulo">${titulo}</p>
        <p class="main__media-fecha">${genero} · ${anio}</p>
      </div>
    `;

    contenedorGrid.appendChild(tarjeta);
  });
}

/* =============================================
   RENDER: GÉNEROS EN SIDEBAR
   ============================================= */
function renderGeneros(generos) {
  contenedorGeneros.innerHTML = "";

  generos.forEach((genero) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = genero.name;
    btn.setAttribute("data-id", genero.id);
    btn.setAttribute("aria-pressed", "false");
    contenedorGeneros.appendChild(btn);
  });
}

/* =============================================
   CARGA PRINCIPAL
   ============================================= */
async function cargar() {
  contenedorGrid.innerHTML = "<p style='color:#a0a0ab;padding:20px'>Cargando...</p>";

  const generos    = await fetchGeneros(estado.tipo);
  const resultados = await fetchPopulares(estado.tipo, estado.pagina);

  renderGeneros(generos);
  renderTarjetas(resultados, generos);
  actualizarNumeroPagina();
}

/* =============================================
   INICIO
   ============================================= */
cargar();