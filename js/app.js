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
const estadoEl          = document.getElementById("estado");
const tituloGaleria     = document.getElementById("titulo-galeria");
const numPagina         = document.getElementById("num-pagina");
const inputAnoMin       = document.getElementById("anos-min");
const inputAnoMax       = document.getElementById("anos-max");
const btnBuscar         = document.getElementById("btn-buscar");
const btnMovie          = document.getElementById("movie");
const btnTv             = document.getElementById("tv");
const btnAnterior       = document.getElementById("pagina-anterior");
const btnSiguiente      = document.getElementById("pagina-siguiente");
const popup             = document.getElementById("media");
const popupContenedor   = document.getElementById("media-contenedor");

/* =============================================
   ESTADO DE LA APLICACIÓN
   ============================================= */
let estado = {
  tipo:          "movie",
  pagina:        1,
  idGenero:      null,
  usarDescubrir: false, // recuerda si el último fetch fue con filtros
};

/* =============================================
   HELPERS DE UI
   ============================================= */
function mostrarEstado(mensaje, tipo = "") {
  estadoEl.textContent = mensaje;
  estadoEl.className   = "estado" + (tipo ? ` estado--${tipo}` : "");
  estadoEl.hidden      = false;
  contenedorGrid.innerHTML = "";
}

function ocultarEstado() {
  estadoEl.hidden = true;
}

function actualizarNumeroPagina() {
  numPagina.textContent = `Página ${estado.pagina}`;
  contenedorGrid.dataset.pagina = estado.pagina;
}

function obtenerNombreGenero(id, generos) {
  const encontrado = generos.find((g) => g.id === id);
  return encontrado ? encontrado.name : "—";
}

/* =============================================
   FETCH: GÉNEROS
   ============================================= */
async function fetchGeneros(tipo = "movie") {
  const url = `${BASE_URL}/genre/${tipo}/list?api_key=${API_KEY}&language=es-MX`;
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const datos = await respuesta.json();
    return datos.genres;
  } catch (e) {
    console.error("Error al cargar géneros:", e);
    return [];
  }
}

/* =============================================
   FETCH: POPULARES
   ============================================= */
async function fetchPopulares(tipo = "movie", pagina = 1) {
  const url = `${BASE_URL}/${tipo}/popular?api_key=${API_KEY}&language=es-MX&page=${pagina}`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  return datos.results;
}

/* =============================================
   FETCH: DESCUBRIR (con filtros)
   ============================================= */
async function fetchDescubrir() {
  const { tipo, pagina, idGenero } = estado;
  const anoMin = inputAnoMin.value || 1950;
  const anoMax = inputAnoMax.value || 2025;

  if (parseInt(anoMin) > parseInt(anoMax)) {
    inputAnoMin.classList.add("sidebar__input--error");
    inputAnoMax.classList.add("sidebar__input--error");
    mostrarEstado("El año mínimo no puede ser mayor que el máximo.", "error");
    return null;
  }

  inputAnoMin.classList.remove("sidebar__input--error");
  inputAnoMax.classList.remove("sidebar__input--error");

  let url;
  if (tipo === "movie") {
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-MX&page=${pagina}`
        + `&release_date.gte=${anoMin}-01-01`
        + `&release_date.lte=${anoMax}-12-31`
        + `&sort_by=popularity.desc`
        + (idGenero ? `&with_genres=${idGenero}` : "");
  } else {
    url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=es-MX&page=${pagina}`
        + `&first_air_date.gte=${anoMin}-01-01`
        + `&first_air_date.lte=${anoMax}-12-31`
        + `&sort_by=popularity.desc`
        + (idGenero ? `&with_genres=${idGenero}` : "");
  }

  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  const datos = await respuesta.json();
  return datos.results;
}

/* =============================================
   FETCH: DETALLE DE UN TÍTULO
   ============================================= */
async function fetchDetalle(id) {
  const url = `${BASE_URL}/${estado.tipo}/${id}?api_key=${API_KEY}&language=es-MX`;
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  return respuesta.json();
}

/* =============================================
   RENDER: TARJETAS
   ============================================= */
function renderTarjetas(resultados, generos) {
  if (!resultados || resultados.length === 0) {
    mostrarEstado("No se encontraron resultados.");
    return;
  }

  ocultarEstado();
  contenedorGrid.innerHTML = "";

  resultados.forEach((item) => {
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
  estado.idGenero = null;

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
   RENDER: POPUP DE DETALLE
   ============================================= */
function mostrarPopup(item) {
  const titulo      = item.title || item.name || "Sin título";
  const fecha       = item.release_date || item.first_air_date || "—";
  const overview    = item.overview || "Sin descripción disponible.";
  const posterSrc   = item.poster_path
                      ? `${IMG_URL}${item.poster_path}`
                      : IMG_PLACEHOLDER;
  const backdropSrc = item.backdrop_path
                      ? `${IMG_URL}${item.backdrop_path}`
                      : null;

  popupContenedor.innerHTML = `
    ${backdropSrc ? `
      <div class="media__backdrop" aria-hidden="true">
        <img src="${backdropSrc}" class="media__backdrop-image" alt="" />
      </div>` : ""}
    <div class="media__imagen">
      <img src="${posterSrc}" class="media__poster" alt="Póster de ${titulo}" />
    </div>
    <div class="media__info">
      <h2 class="media__titulo">${titulo}</h2>
      <p class="media__fecha">${fecha}</p>
      <p class="media__overview">${overview}</p>
    </div>
    <button class="media__btn-cerrar btn" id="btn-cerrar-popup" aria-label="Cerrar detalle">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
      </svg>
    </button>
  `;

  popup.hidden = false;

  // Foco al botón cerrar para accesibilidad
  document.getElementById("btn-cerrar-popup")?.focus();
}

function cerrarPopup() {
  popup.hidden = true;
  popupContenedor.innerHTML = "";
}

/* =============================================
   CARGA PRINCIPAL
   ============================================= */
async function cargar(usarDescubrir = false) {
  estado.usarDescubrir = usarDescubrir;
  mostrarEstado("Cargando...", "cargando");

  try {
    const generos = await fetchGeneros(estado.tipo);
    renderGeneros(generos);

    const resultados = usarDescubrir
      ? await fetchDescubrir()
      : await fetchPopulares(estado.tipo, estado.pagina);

    if (resultados === null) return;

    renderTarjetas(resultados, generos);
    actualizarNumeroPagina();

  } catch (e) {
    console.error("Error al cargar datos:", e);
    mostrarEstado("No se pudieron cargar los datos. Intenta de nuevo.", "error");
  }
}

/* =============================================
   LISTENERS — TIPO (Películas / Series)
   ============================================= */
btnMovie.addEventListener("click", async () => {
  estado.tipo   = "movie";
  estado.pagina = 1;

  btnMovie.classList.add("btn--active");
  btnMovie.setAttribute("aria-pressed", "true");
  btnTv.classList.remove("btn--active");
  btnTv.setAttribute("aria-pressed", "false");

  tituloGaleria.textContent = "Películas Populares";
  await cargar();
});

btnTv.addEventListener("click", async () => {
  estado.tipo   = "tv";
  estado.pagina = 1;

  btnTv.classList.add("btn--active");
  btnTv.setAttribute("aria-pressed", "true");
  btnMovie.classList.remove("btn--active");
  btnMovie.setAttribute("aria-pressed", "false");

  tituloGaleria.textContent = "Series Populares";
  await cargar();
});

/* =============================================
   LISTENERS — GÉNERO
   ============================================= */
contenedorGeneros.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const estaActivo = btn.classList.contains("btn--active");

  contenedorGeneros.querySelectorAll(".btn").forEach((b) => {
    b.classList.remove("btn--active");
    b.setAttribute("aria-pressed", "false");
  });

  if (!estaActivo) {
    btn.classList.add("btn--active");
    btn.setAttribute("aria-pressed", "true");
    estado.idGenero = btn.dataset.id;
  } else {
    estado.idGenero = null;
  }
});

/* =============================================
   LISTENER — BOTÓN BUSCAR
   ============================================= */
btnBuscar.addEventListener("click", async () => {
  estado.pagina = 1;
  const labelTipo = estado.tipo === "movie" ? "Películas" : "Series";
  tituloGaleria.textContent = `Resultados — ${labelTipo}`;
  await cargar(true);
});

/* =============================================
   LISTENERS — PAGINACIÓN
   ============================================= */
btnSiguiente.addEventListener("click", async () => {
  estado.pagina += 1;
  await cargar(estado.usarDescubrir);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

btnAnterior.addEventListener("click", async () => {
  if (estado.pagina <= 1) return;
  estado.pagina -= 1;
  await cargar(estado.usarDescubrir);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =============================================
   LISTENERS — POPUP
   ============================================= */

// Abrir con click
contenedorGrid.addEventListener("click", async (e) => {
  const tarjeta = e.target.closest(".main__media");
  if (!tarjeta) return;

  try {
    const detalle = await fetchDetalle(tarjeta.dataset.id);
    mostrarPopup(detalle);
  } catch (e) {
    console.error("Error al cargar detalle:", e);
  }
});

// Abrir con teclado (Enter / Espacio)
contenedorGrid.addEventListener("keydown", async (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const tarjeta = e.target.closest(".main__media");
  if (!tarjeta) return;
  e.preventDefault();

  try {
    const detalle = await fetchDetalle(tarjeta.dataset.id);
    mostrarPopup(detalle);
  } catch (e) {
    console.error("Error al cargar detalle:", e);
  }
});

// Cerrar con botón o click fuera del contenedor
popup.addEventListener("click", (e) => {
  if (e.target.closest("#btn-cerrar-popup") || e.target === popup) {
    cerrarPopup();
  }
});

// Cerrar con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !popup.hidden) cerrarPopup();
});

/* =============================================
   INICIO
   ============================================= */
cargar();