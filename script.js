
// 1. REFERENCIAS AL DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsGrid = document.getElementById('results');
const globalPlayer = document.getElementById('globalPlayer');
const mainAudio = document.getElementById('mainAudio');

// ... (Tus referencias al DOM existentes: searchInput, resultsGrid, etc.) ...

// ==========================================
// 1.1 DATOS GLOBALES (NUEVO: MUÉVELOS AQUÍ)
// ==========================================

const ALL_GENRES = [
    { id: '14', name: 'POP', color: '#ff0055' },
    { id: '1229', name: 'URBANO LATINO', color: '#ffff00' },
    { id: '18', name: 'HIP-HOP / RAP', color: '#bc13fe' },
    { id: '21', name: 'ROCK', color: '#00f3ff' },
    { id: '12', name: 'MÚSICA LATINA', color: '#ffaa00' },
    { id: '17', name: 'DANCE', color: '#00ff00' },
    { id: '27', name: 'J-POP', color: '#ff99cc' },
    { id: '51', name: 'K-POP', color: '#ff0099' },
    { id: '15', name: 'R&B / SOUL', color: '#aa00ff' },
    { id: '20', name: 'ALTERNATIVA', color: '#00ccff' },
    { id: '6', name: 'COUNTRY', color: '#ff9900' },
    { id: '1153', name: 'METAL', color: '#666666' },
    { id: '11', name: 'JAZZ', color: '#cc9900' },
    { id: '5', name: 'CLÁSICA', color: '#cccc00' },
    { id: '24', name: 'REGGAE', color: '#009900' },
    { id: '2', name: 'BLUES', color: '#0033cc' },
    { id: '16', name: 'SOUNDTRACK', color: '#ff3333' },
    { id: '10', name: 'SINGER/SONGWRITER', color: '#996633' }
];

const ALL_COUNTRIES = [
    { code: 'do', name: 'DOMINICAN REPUBLIC', flag: '🇩🇴' },
    { code: 'us', name: 'UNITED STATES', flag: '🇺🇸' },
    { code: 'es', name: 'SPAIN', flag: '🇪🇸' },
    { code: 'mx', name: 'MEXICO', flag: '🇲🇽' },
    { code: 'co', name: 'COLOMBIA', flag: '🇨🇴' },
    { code: 'ar', name: 'ARGENTINA', flag: '🇦🇷' },
    { code: 'pr', name: 'PUERTO RICO', flag: '🇵🇷' },
    { code: 'cl', name: 'CHILE', flag: '🇨🇱' },
    { code: 'pe', name: 'PERU', flag: '🇵🇪' },
    { code: 'br', name: 'BRAZIL', flag: '🇧🇷' },
    { code: 'gb', name: 'UNITED KINGDOM', flag: '🇬🇧' },
    { code: 'fr', name: 'FRANCE', flag: '🇫🇷' },
    { code: 'it', name: 'ITALY', flag: '🇮🇹' },
    { code: 'de', name: 'GERMANY', flag: '🇩🇪' },
    { code: 'jp', name: 'JAPAN', flag: '🇯🇵' },
    { code: 'kr', name: 'SOUTH KOREA', flag: '🇰🇷' },
    { code: 'au', name: 'AUSTRALIA', flag: '🇦🇺' },
    { code: 'ca', name: 'CANADA', flag: '🇨🇦' }
];

// ... (Resto de tus variables: allResults, currentPage, etc.) ...
// --- NUEVAS REFERENCIAS DE VISTAS ---
const homeView = document.getElementById('homeView');
const resultsView = document.getElementById('resultsView');
const artistHero = document.getElementById('artistHero');
// Contenedores de carruseles (Asegúrate de que existan en tu HTML)
const carouselTrending = document.getElementById('carouselTrending');
const carouselLatino = document.getElementById('carouselLatino');

// Elementos del reproductor mini
const playerImg = document.getElementById('playerImg');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerExternalLinks = document.getElementById('playerExternalLinks');

let allResults = [];      // Aquí guardaremos TODOS los datos (100 o 50)
let currentPage = 1;      // Página actual
let currentCountry = 'us'; // Estados Unidos por defecto
let currentGenre = '';     // Todo por defecto
let currentType = 'songs'; // 'songs' o 'albums'
const itemsPerPage = 10;  // Tu regla de oro: 10 por página
let previousState = null;
let currentHeaderHTML = '';

let debounceTimer;

// 2. INICIALIZACIÓN (Cargar Top 100 al inicio)
document.addEventListener('DOMContentLoaded', () => {
    initHomeView();
});

const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
        headerTitle.addEventListener('click', () => resetToHome());
    }


// Referencia al contenedor (asegúrate de tener esto arriba en las referencias)
const searchBoxContainer = document.getElementById('searchBoxContainer');

// ==========================================
// 3. EVENT LISTENERS (LIVE SEARCH + DEBOUNCE)
// ==========================================

// Variable para el temporizador (asegúrate de que esté declarada arriba con tus variables let)
// let debounceTimer; <--- Si ya la tienes arriba, genial. Si no, descomenta esta línea.

searchInput.addEventListener('input', (e) => {
    // 1. Limpiamos el temporizador anterior (Cancelamos la búsqueda si sigues escribiendo)
    clearTimeout(debounceTimer);

    const query = e.target.value.trim();

    // 2. Iniciamos un nuevo temporizador
    debounceTimer = setTimeout(() => {
        if (query.length > 0) {
            // Si hay texto -> BUSCAR
            performSearch();
        } else {
            // Si borraste todo -> VOLVER A HOME
            resetToHome();
        }
    }, 400); // Espera 400ms después de que dejes de escribir
});

// Opcional: Si presionan Enter, buscar inmediatamente (sin esperar)
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        clearTimeout(debounceTimer); // Cancelamos el timer automático
        const query = searchInput.value.trim();
        if (query.length > 0) {
            performSearch();
            searchInput.blur(); // Ocultar teclado en móvil
        }
    }
});

// =================================================================
// 4. GESTOR DE VISTAS Y HOME (ACTUALIZADO)
// =================================================================

// A. CONTROL DE VISIBILIDAD
function showHome() {
    if(homeView) homeView.classList.remove('hidden');
    if(resultsView) resultsView.classList.add('hidden');
    if(artistHero) artistHero.classList.add('hidden');
    const albumsSection = document.getElementById('artistAlbumsSection');
    if(albumsSection) albumsSection.classList.add('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showResults() {
    if(homeView) homeView.classList.add('hidden');
    if(resultsView) resultsView.classList.remove('hidden');
    const albumsSection = document.getElementById('artistAlbumsSection');
    if(albumsSection) albumsSection.classList.add('hidden');
}

// B. INICIALIZADOR (Se llama desde DOMContentLoaded)
async function initHomeView() {
    showHome();
    
    // 1. Cargar Mini Top Global (10 canciones)
    loadCarouselData('https://itunes.apple.com/us/rss/topsongs/limit=10/json', 'carouselGlobal');

    renderCollectionList(ALL_GENRES, 8, 'carouselGenres', '', 'genre');
renderCollectionList(ALL_COUNTRIES, 8, 'carouselCountries', '', 'country');
}

// 4.1 RENDERIZADOR GENÉRICO DE LISTAS (GÉNEROS Y PAÍSES)
function renderCollectionList(dataArray, limit, containerId, title, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Limpiar

    // Renderizar Header si es vista completa ("Ver Todo")
    if (!limit) {
        const headerDiv = document.createElement('div');
        headerDiv.style.gridColumn = "1 / -1";
        headerDiv.innerHTML = `
            <div style="width:100%; text-align:left; margin-bottom:20px;">
                 <button class="back-btn-header" onclick="resetToHome()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2 class="neon-text-light" style="margin-top:10px;">${title}</h2>
            </div>`;
        container.appendChild(headerDiv);
    }

    // Cortar array si hay límite (Carrusel Home)
    const itemsToShow = limit ? dataArray.slice(0, limit) : dataArray;

    itemsToShow.forEach(item => {
        const card = document.createElement('div');
        card.className = 'playlist-card';
        
        if (!limit) {
            card.style.width = '100%';
            card.style.minWidth = 'auto';
        }

        // Lógica Visual Diferenciada
        let cardContent = '';
        let clickAction = null;

        if (type === 'genre') {
            // ESTILO GÉNERO
            card.style.background = `linear-gradient(45deg, ${item.color}44, #000)`;
            cardContent = `
                <div class="playlist-overlay">
                    <i class="fas fa-music" style="font-size:1.5rem; margin-bottom:5px; color:${item.color}"></i>
                    <span class="playlist-title">${item.name}</span>
                </div>`;
            clickAction = () => loadCollection('us', item.id, item.name); // Géneros siempre usan 'us' como base, o podrías usar currentCountry

        } else if (type === 'country') {
            // ESTILO PAÍS
            cardContent = `
                <div class="playlist-overlay">
                    <span class="playlist-flag">${item.flag}</span>
                    <span class="playlist-title" style="font-size:0.9rem">TOP<br>${item.name}</span>
                </div>`;
            clickAction = () => loadCollection(item.code, '', `TOP ${item.name}`);
        }

        card.innerHTML = cardContent;
        card.addEventListener('click', clickAction);
        container.appendChild(card);
    });
}


// C. HELPER PARA CARRUSELES (AHORA CON HIDRATACIÓN / LOOKUP)
async function loadCarouselData(url, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; 
    
    container.innerHTML = '<div style="padding:20px; color:#666;">Cargando éxitos...</div>';

    try {
        // 1. Obtener RSS Crudo
        const response = await fetch(url);
        const data = await response.json();
        const entries = data.feed.entry || [];

        if (entries.length === 0) {
            container.innerHTML = 'No hay datos.';
            return;
        }

        // 2. 🔥 HIDRATACIÓN: Extraer IDs para pedir metadatos reales a Apple
        // (Esto asegura que tengamos ArtistID y CollectionID válidos para el reproductor)
        const trackIds = entries
            .map(entry => entry.id.attributes['im:id'])
            .slice(0, 20) // Limitamos a 20 para carruseles para no saturar
            .join(',');

        const lookupResponse = await fetch(`https://itunes.apple.com/lookup?id=${trackIds}&entity=song`);
        const lookupData = await lookupResponse.json();

        // Mapa para cruzar datos
        const cleanSongsMap = new Map();
        if (lookupData.results) {
            lookupData.results.forEach(song => {
                cleanSongsMap.set(String(song.trackId), song);
            });
        }

        container.innerHTML = ''; // Limpiar loader

        entries.forEach(entry => {
            const rssId = entry.id.attributes['im:id'];
            const cleanData = cleanSongsMap.get(rssId);

            // Usamos datos limpios si existen (Search), si no, el fallback (Feed)
            // Esto es CRUCIAL para que los links del reproductor funcionen.
            const song = cleanData ? normalizeTrackData(cleanData, 'search') : normalizeTrackData(entry, 'feed');

            // Imagen de alta calidad
            const imgHighRes = song.artworkUrl100.replace(/\d+x\d+bb/, '300x300bb');
            
            // Crear Tarjeta
            const card = document.createElement('div');
            card.className = 'carousel-card';
            card.innerHTML = `
                <img src="${imgHighRes}" loading="lazy" alt="${song.trackName}">
                <div class="carousel-info">
                    <h4>${song.trackName}</h4>
                    <p>${song.artistName}</p>
                </div>
            `;
            
            // Click: Reproducir
            card.addEventListener('click', () => {
                 // Ahora 'song' lleva los IDs correctos (artistId y collectionId)
                 playTrack(song, imgHighRes, song.id);
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading carousel:", error);
        container.innerHTML = '<div style="padding:20px; color:red;">Error de carga</div>';
    }
}

// 4. FUNCIÓN DE NORMALIZACIÓN (CON LÓGICA "RSS HÍBRIDO")
function normalizeTrackData(rawSong, source = 'search') {
    
    // Función auxiliar para extraer ID limpio de Apple de una URL
    const extractAppleID = (url) => {
        if (!url) return null;
        const match = url.match(/\/id(\d+)/);
        return match ? match[1] : null;
    };

    if (source === 'feed') {
        // --- LÓGICA RSS (FEED) ---
        // Obtenemos la info visual del RSS, pero forzamos la extracción de IDs limpios
        
        // 1. ID del Artista
        let artistId = null;
        if (rawSong['im:artist'] && rawSong['im:artist'].attributes) {
            artistId = extractAppleID(rawSong['im:artist'].attributes.href);
        }

        // 2. ID del Álbum (Collection)
        let collectionId = null;
        if (rawSong['im:collection'] && rawSong['im:collection'].link) {
            collectionId = extractAppleID(rawSong['im:collection'].link.attributes.href);
        }

        // 3. ID de la Canción
        const trackId = rawSong.id.attributes['im:id'];

        // 4. URLs de Audio
        // Blindamos los arrays para evitar errores si falta el preview
        const linkPreview = (rawSong.link && rawSong.link[1]) ? rawSong.link[1].attributes.href : '';
        const linkView = (rawSong.link && rawSong.link[0]) ? rawSong.link[0].attributes.href : '';

        return {
            id: trackId,
            trackName: rawSong['im:name'].label,
            artistName: rawSong['im:artist'].label,
            artistId: artistId, // Ahora es un ID limpio numérico o null
            collectionName: rawSong['im:collection'] ? rawSong['im:collection']['im:name'].label : 'Single / Desconocido',
            collectionId: collectionId, // Ahora es un ID limpio numérico o null
            artworkUrl100: rawSong['im:image'][2].label,
            previewUrl: linkPreview,
            trackViewUrl: linkView
        };

    } else {
        // --- LÓGICA SEARCH API (YA ESTANDARIZADA) ---
        // Aquí los datos ya vienen limpios de Apple
        return {
            id: rawSong.trackId,
            trackName: rawSong.trackName,
            artistName: rawSong.artistName,
            artistId: rawSong.artistId,
            collectionName: rawSong.collectionName,
            collectionId: rawSong.collectionId,
            artworkUrl100: rawSong.artworkUrl100,
            previewUrl: rawSong.previewUrl,
            trackViewUrl: rawSong.trackViewUrl
        };
    }
}



// 4. FUNCIÓN: CARGAR TOP 100 GLOBAL (Corregida y Optimizada)
async function loadTopCharts() {
    
    // 1. 🔥 IMPORTANTE: CAMBIAR DE VISTA (Ocultar Home, Mostrar Grid)
    showResults(); 
    if (artistHero) artistHero.classList.add('hidden'); // Ocultamos el banner de artista si estaba

    // 2. UI de carga
    resultsGrid.innerHTML =
     '<div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i> LOADING...</div>';

    // 3. Configurar Header con botón de Inicio
    currentHeaderHTML = `
        <div style="width:100%; text-align:left;">
             <button class="back-btn-header" onclick="resetToHome()">
                <i class="fas fa-arrow-left"></i>
            </button>
           
        </div>
        
         <h2 class="neon-text-light" style="margin-top:10px;">
                <i class="fas fa-globe"></i> TOP GLOBAL 100
            </h2>`;

    try {
        // PASO A: Obtener el Ranking desde el RSS (Top 100)
        const rssResponse = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=100/json');
        const rssData = await rssResponse.json();
        const feedEntries = rssData.feed.entry;

        // PASO B: Extraer IDs para obtener metadata de alta calidad (Hidratación)
        // Esto asegura que las imágenes sean HD y los links de artista funcionen
        const trackIds = feedEntries.map(entry => entry.id.attributes['im:id']).join(',');

        const lookupResponse = await fetch(`https://itunes.apple.com/lookup?id=${trackIds}&entity=song`);
        const lookupData = await lookupResponse.json();
        const cleanSongsMap = new Map();

        if (lookupData.results) {
            lookupData.results.forEach(song => {
                cleanSongsMap.set(String(song.trackId), song);
            });
        }

        // PASO C: Mapear resultados manteniendo el orden del Ranking #1, #2...
        const hydratedResults = feedEntries.map((entry) => {
            const rssId = entry.id.attributes['im:id'];
            const cleanData = cleanSongsMap.get(rssId);

            // Usamos datos limpios si existen, si no, respaldo del RSS
            return cleanData ? normalizeTrackData(cleanData, 'search') : normalizeTrackData(entry, 'feed');
        });

        // 4. Renderizar
        allResults = hydratedResults;
        currentPage = 1;
        updatePagination(true); // true = Modo Ranking (#1, #2...)

    } catch (error) {
        console.error('Error cargando charts:', error);
        resultsGrid.innerHTML = '<div class="empty-state">⚠️ ERROR DE CONEXIÓN.</div>';
    }
}
// 6. BUSCADOR GLOBAL TIPO SPOTIFY (ARTISTAS + ÁLBUMES + TRACKS)
async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // 1. Preparar UI
    showResults();
    artistHero.classList.add('hidden'); 
    saveCurrentState(); // Guardar estado por si quiere volver

    resultsGrid.innerHTML = '<div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i> LOADING...</div>';
    document.getElementById('pagination').innerHTML = '';

    currentHeaderHTML = '';

    try {
        // 2. 🔥 PETICIONES PARALELAS (LO QUE HACE UN SENIOR)
        // Pedimos Artistas (Limit 6), Álbumes (Limit 6) y Canciones (Limit 20) al mismo tiempo.
        const [artistsRes, albumsRes, songsRes] = await Promise.all([
            fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=musicArtist&limit=6`),
            fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=6`),
            fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=24`)
        ]);

        const artistsData = await artistsRes.json();
        const albumsData = await albumsRes.json();
        const songsData = await songsRes.json();

        // 3. Renderizar Vista Global
        renderGlobalSearch(query, {
            artists: artistsData.results || [],
            albums: albumsData.results || [],
            songs: songsData.results || []
        });

    } catch (error) {
        console.error('Search Error:', error);
        resultsGrid.innerHTML = '<div class="empty-state">ERROR DE CONEXIÓN</div>';
    }
}



// --- SISTEMA DE PAGINACIÓN ---

function updatePagination(isChart) {
    // 1. Calcular dónde empieza esta página (0, 10, 20...)
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    // 2. Cortar el array global para obtener solo los 10 de esta página
    const songsToRender = allResults.slice(start, end);

    // 3. Renderizar pasando el 'start' para calcular el ranking correcto
    renderResults(songsToRender, isChart, start);

    // 4. Actualizar botones
    renderPaginationControls(isChart);
}

function renderPaginationControls(isChart) {
    const container = document.getElementById('pagination');
    const totalPages = Math.ceil(allResults.length / itemsPerPage);

    if (totalPages <= 1) {
        container.innerHTML = ''; 
        return;
    }

    container.innerHTML = `
        <button class="page-btn" id="prevBtn" ${currentPage === 1 ? 'disabled' : ''}> < PREV </button>
        <span class="page-info">PAGE ${currentPage} / ${totalPages}</span>
        <button class="page-btn" id="nextBtn" ${currentPage === totalPages ? 'disabled' : ''}> NEXT > </button>
    `;

    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination(isChart);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination(isChart);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}


// 6. RENDERIZADO DE TARJETAS (MODIFICADA)
// 🔥 AHORA RECIBE 'startIndex' PARA CALCULAR EL RANKING REAL (11, 12, 13...)
// 8. RENDERIZADO DE TARJETAS (CON LÓGICA DE ÁLBUM INTELIGENTE)
function renderResults(songs, isChart = false, startIndex = 0) {
    resultsGrid.innerHTML = ''; 

    // 🔥 NUEVA LÓGICA: Si hay un header guardado, lo pintamos
    if (currentHeaderHTML) {
        const headerDiv = document.createElement('div');
        headerDiv.style.gridColumn = "1 / -1"; // Ocupa todo el ancho
        headerDiv.style.marginBottom = "20px";
        headerDiv.innerHTML = currentHeaderHTML;
        resultsGrid.appendChild(headerDiv);
    }
    
    // (Nota: Puedes borrar el bloque antiguo 'if (isChart)' que pintaba el título aquí dentro,
    // ya que ahora lo controlaremos desde fuera con la variable).

    if (songs.length === 0) {
        resultsGrid.innerHTML = '<div class="empty-state">NO SE ENCONTRARON DATOS.</div>';
        return;
    }

    songs.forEach((song, index) => {
        let rawUrl = song.artworkUrl100 || ''; 
        let highResImage = rawUrl.replace(/\d+x\d+bb/, '600x600bb');
        const currentId = song.trackId || song.id || index;
        const realRank = startIndex + index + 1;
        const externalLinksHTML = generateExternalLinks(song);
        const rankBadge = isChart ? `<div style="position:absolute; top:10px; left:10px; background:var(--neon-pink); color:white; font-weight:bold; padding:2px 8px; border-radius:5px; z-index:10; box-shadow:0 0 10px var(--neon-pink);">#${realRank}</div>` : '';

        const safeArtist = song.artistName.replace(/'/g, "\\'");
        const safeAlbum = song.collectionName.replace(/'/g, "\\'");

        // 🔥 LÓGICA NUEVA: ¿TIENE ÁLBUM VÁLIDO?
        let albumHTML = '';
        // Verificamos que tenga ID y que no sea 0 (a veces iTunes devuelve 0)
        if (song.collectionId && song.collectionId != 0) {
            albumHTML = `
            <span class="clickable-link album-link" onclick="event.stopPropagation(); loadAlbumData('${song.collectionId}', '${safeAlbum}')">
                <i class="fas fa-compact-disc"></i> ${song.collectionName}
            </span>`;
        } else {
            // Si no tiene ID, mostramos texto plano sin click
            albumHTML = `
            <span class="album-text-only">
                <i class="fas fa-compact-disc"></i> ${song.collectionName}
            </span>`;
        }

        const card = document.createElement('div');
        card.className = 'song-card';
        card.setAttribute('data-id', currentId);
        
        card.innerHTML = `
            <div class="image-container" style="position: relative;">
                ${rankBadge}
                <img src="${highResImage}" alt="${song.trackName}" loading="lazy">
                <div class="play-overlay">
                    <i class="play-btn-card icon-state fas fa-play"></i>
                </div>
            </div>
            <div class="song-info">
                <h3>${song.trackName}</h3>
                <p>
                    <span class="clickable-link" onclick="event.stopPropagation(); loadArtistData('${song.artistId}', '${safeArtist}')">
                        <i class="fas fa-user"></i> ${song.artistName}
                    </span>
                </p>
                ${albumHTML} 
            </div>

            ${externalLinksHTML}
        `;

        card.addEventListener('click', (e) => {
            if (e.target.closest('.external-links')) return;
            playTrack(song, highResImage, currentId);
        });

        resultsGrid.appendChild(card);
    });
}


// 7. GENERAR LINKS (CON FONT AWESOME)
function generateExternalLinks(song) {
    const searchQuery = encodeURIComponent(`${song.trackName} ${song.artistName}`);
    
    const iTunesLink = song.trackViewUrl;
    const spotifyLink = `https://open.spotify.com/search/${searchQuery}`;
    const youtubeLink = `https://www.youtube.com/results?search_query=${searchQuery}`;

    return `
        <div class="external-links">
            <a href="${iTunesLink}" target="_blank" title="Ver en Apple Music">
                <i class="icon fab fa-apple apple-music-icon"></i> 
            </a>
            <a href="${spotifyLink}" target="_blank" title="Buscar en Spotify">
                <i class="icon fab fa-spotify spotify-icon"></i>
            </a>
            <a href="${youtubeLink}" target="_blank" title="Buscar en YouTube">
                <i class="icon fab fa-youtube youtube-icon"></i>
            </a>
        </div>
    `;
}

// 8. GESTOR DE ESTADO VISUAL (NUEVO)
let currentPlayingId = null; // Variable global para rastrear qué suena

function updateVisualState(newId, isPlaying = true) {
    // 1. Apagar la canción anterior
    if (currentPlayingId && currentPlayingId !== newId) {
        const prevCard = document.querySelector(`.song-card[data-id="${currentPlayingId}"]`);
        if (prevCard) {
            prevCard.classList.remove('active-track');
            // Cambiar clase de icono: Pausa -> Play
            const icon = prevCard.querySelector('.icon-state');
            if(icon) {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        }
    }

    // 2. Encender la nueva canción
    if (newId) {
        const currentCard = document.querySelector(`.song-card[data-id="${newId}"]`);
        if (currentCard) {
            const icon = currentCard.querySelector('.icon-state');
            
            if (isPlaying) {
                currentCard.classList.add('active-track');
                // Cambiar clase de icono: Play -> Pausa
                if(icon) {
                    icon.classList.remove('fa-play');
                    icon.classList.add('fa-pause');
                }
            } else {
                // Pausa visual
                currentCard.classList.remove('active-track'); 
                if(icon) {
                    icon.classList.remove('fa-pause');
                    icon.classList.add('fa-play');
                }
            }
        }
        currentPlayingId = newId; 
    }
}

// =================================================================
// 20. HELPER DE TEXTO DESLIZANTE (MARQUEE)
// =================================================================
function setMarquee(element, text, isHtml = false) {
    // 1. Limpiar estado previo
    element.innerHTML = '';
    element.className = ''; // Quitar clases viejas
    
    // 2. Crear estructura de prueba para medir
    // Usamos un 'span' temporal para ver cuánto ocupa el texto realmente
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.style.font = window.getComputedStyle(element).font;
    
    if (isHtml) tempSpan.innerHTML = text;
    else tempSpan.textContent = text;
    
    document.body.appendChild(tempSpan);
    const textWidth = tempSpan.getBoundingClientRect().width;
    const containerWidth = element.parentElement.clientWidth; // Ancho disponible en el player
    document.body.removeChild(tempSpan);

    // 3. LÓGICA DE DECISIÓN
    if (textWidth > containerWidth) {
        // A. CASO: NO CABE -> ACTIVAR MARQUEE
        element.classList.add('marquee-container');
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'marquee-content animate-scroll';
        
        // Calculamos velocidad basada en el largo del texto (para que sea constante)
        // Ejemplo: 10 segundos para textos cortos, más para largos
        const duration = textWidth / 30; // Ajusta este '30' para cambiar velocidad
        contentDiv.style.animationDuration = `${Math.max(duration, 10)}s`;

        // Duplicamos el contenido para el efecto loop infinito (Texto + Espacio + Texto)
        const separator = '<span class="marquee-spacer"></span>';
        contentDiv.innerHTML = isHtml 
            ? `${text}${separator}${text}`
            : `${text}${separator}${text}`;

        element.appendChild(contentDiv);

    } else {
        // B. CASO: SÍ CABE -> TEXTO ESTÁTICO NORMAL
        if (isHtml) element.innerHTML = text;
        else element.textContent = text;

        // 🔥 AGREGAR ESTO: Limpieza de estilos residuales
        element.style.textAlign = ''; // Dejar que el CSS controle la alineación
        element.style.justifyContent = '';
    }
}

// 8. REPRODUCTOR GLOBAL (ACTUALIZADO CON MARQUEE)
function playTrack(song, imageUrl, id) {
    // 1. Mostrar la barra del reproductor
    globalPlayer.classList.add('visible');

    // 2. Actualizar Imagen
    playerImg.src = imageUrl;
    playerImg.classList.remove('hidden');
    
    // 3. Título (Texto plano con Marquee)
    // 🔥 CAMBIO AQUÍ: Usamos setMarquee
    setMarquee(playerTitle, song.trackName, false);

    // 4. Preparar datos seguros
    const safeArtist = song.artistName ? song.artistName.replace(/'/g, "\\'") : '';
    const safeAlbum = song.collectionName ? song.collectionName.replace(/'/g, "\\'") : '';
    
    // 5. Inyectar ARTISTA (HTML con Marquee)
    // Creamos el HTML string del link
    const artistHTML = `
        <span class="clickable-link" onclick="event.stopPropagation(); toggleFullScreen(false); loadArtistData('${song.artistId}', '${safeArtist}')">
            ${song.artistName}
        </span>
    `;
    // 🔥 CAMBIO AQUÍ: Pasamos true porque es HTML
    setMarquee(playerArtist, artistHTML, true);

    // 6. Inyectar ÁLBUM (HTML con Marquee)
    const playerAlbum = document.getElementById('playerAlbum');
    if (playerAlbum) {
        if (song.collectionName && song.collectionName !== 'Single / Desconocido') {
            playerAlbum.style.display = 'block';
            
            let albumHTML = '';
            if (song.collectionId && song.collectionId != 0 && song.collectionId !== 'null') {
                albumHTML = `
                    <span class="clickable-link album-link" onclick="event.stopPropagation(); toggleFullScreen(false); loadAlbumData('${song.collectionId}', '${safeAlbum}')">
                        ${song.collectionName}
                    </span>
                `;
            } else {
                albumHTML = `<span style="cursor:default; color:#aaa;">${song.collectionName}</span>`;
            }
            
            // 🔥 CAMBIO AQUÍ
            setMarquee(playerAlbum, albumHTML, true);

        } else {
            playerAlbum.style.display = 'none';
        }
    }

    // ... (EL RESTO DE TU FUNCIÓN PLAYTRACK SIGUE IGUAL: Visualizer, Audio, etc.) ...
    if (!isVisualizerInit) initVisualizer();
    if (audioContext && audioContext.state === 'suspended') audioContext.resume();

    if (mainAudio.src !== song.previewUrl) {
        mainAudio.src = song.previewUrl;
        mainAudio.play();
        updateVisualState(id, true);
    } else {
        if (mainAudio.paused) {
            mainAudio.play();
            updateVisualState(id, true);
        } else {
            mainAudio.pause();
            updateVisualState(id, false);
        }
    }
}

// 🔥 BONUS: Sincronizar si el usuario usa los controles nativos del footer
mainAudio.addEventListener('pause', () => {
    if (currentPlayingId) updateVisualState(currentPlayingId, false);
});

mainAudio.addEventListener('play', () => {
    if (currentPlayingId) updateVisualState(currentPlayingId, true);
});


// =================================================================
// 9. AUDIO VISUALIZER ENGINE (Web Audio API)
// =================================================================

let audioContext;
let analyser;
let source;
let gainNode;
let isVisualizerInit = false; // Bandera para no reinicializarlo mil veces

function initVisualizer() {
    if (isVisualizerInit) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    // 🔥 CREAMOS EL NODO DE GANANCIA (VOLUMEN)
    gainNode = audioContext.createGain();
    
    // Configuramos el volumen inicial al valor de la barra (normalizado de 0 a 1)
    gainNode.gain.value = document.getElementById('volumeBar').value / 100;

    try {
        source = audioContext.createMediaElementSource(mainAudio);
        
        // 🔥 NUEVO CABLEADO:
        // 1. Del Audio al Volumen
        source.connect(gainNode);
        // 2. Del Volumen al Visualizador
        gainNode.connect(analyser);
        // 3. Del Visualizador a los Altavoces
        analyser.connect(audioContext.destination);

        isVisualizerInit = true;
        drawVisualizer();
    } catch (e) {
        console.error("Error inicializando audio context:", e);
    }
}

// LÓGICA DE UI: BOTÓN DE VOLUMEN DESPLEGABLE
const volumeContainer = document.getElementById('volumeContainer');
const toggleVolumeBtn = document.getElementById('toggleVolumeBtn');

if (toggleVolumeBtn && volumeContainer) {
    toggleVolumeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita cerrar otros menús
        // Alternar clase para mostrar/ocultar la barra
        volumeContainer.classList.toggle('active');
    });

    // Opcional: Cerrar la barra si haces clic fuera de ella
    document.addEventListener('click', (e) => {
        if (!volumeContainer.contains(e.target)) {
            volumeContainer.classList.remove('active');
        }
    });
}

function drawVisualizer() {
    const canvas = document.getElementById('audioVisualizer');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    // Ajustar tamaño real del canvas al tamaño visual CSS
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function renderFrame() {
        requestAnimationFrame(renderFrame); // Bucle infinito eficiente

        // Obtener datos de frecuencia actuales (0 a 255)
        analyser.getByteFrequencyData(dataArray);

        // Limpiar el frame anterior
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        // Dibujar cada barra
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 1.5; // Escalar altura

            // Color degradado Cyberpunk: Cyan a Purple
            // Usamos la altura para variar el color dinámicamente
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
            gradient.addColorStop(0, '#00f3ff'); // Cyan base
            gradient.addColorStop(1, '#bc13fe'); // Purple punta

            ctx.fillStyle = gradient;
            
            // Efecto espejo: dibujamos rectángulos redondeados
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 2; // Espacio entre barras
        }
    }

    renderFrame();

}

// =================================================================
// 10. CONTROLES CUSTOM DEL REPRODUCTOR
// =================================================================

const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeText = document.getElementById('currentTimeText');
const durationText = document.getElementById('durationText');
const volumeBar = document.getElementById('volumeBar');
const prevTrackBtn = document.getElementById('prevTrackBtn');
const nextTrackBtn = document.getElementById('nextTrackBtn');
const progressiveBtn = document.getElementById('progressiveBtn');
let isProgressiveMode = false;


function playTrackByIndex(index) {
    // Validar límites
    if (index < 0) index = allResults.length - 1; // Loop al final
    if (index >= allResults.length) index = 0;    // Loop al inicio

    const song = allResults[index];
    
    // Necesitamos la imagen HD igual que en render
    let rawUrl = song.artworkUrl100 || '';
    let highResImage = rawUrl.replace(/\d+x\d+bb/, '600x600bb');
    
    // Importante: currentPlayingId debe ser el ID de esta canción
    const id = song.id || song.trackId;

    playTrack(song, highResImage, id);
}

progressiveBtn.addEventListener('click', () => {
    isProgressiveMode = !isProgressiveMode; // Invertir valor
    
    if (isProgressiveMode) {
        // Activar visualmente
        progressiveBtn.classList.add('active-mode');
        // Opcional: Feedback visual temporal (Tooltip o log)
        console.log("AUTOPLAY: ACTIVADO");
    } else {
        // Desactivar visualmente
        progressiveBtn.classList.remove('active-mode');
        console.log("AUTOPLAY: DESACTIVADO");
    }
});

// Obtener índice actual
function getCurrentIndex() {
    if (!currentPlayingId) return -1;
    return allResults.findIndex(s => (s.id || s.trackId) == currentPlayingId);
}

prevTrackBtn.addEventListener('click', () => {
    const currentIdx = getCurrentIndex();
    if (currentIdx !== -1) {
        playTrackByIndex(currentIdx - 1);
    }
});

nextTrackBtn.addEventListener('click', () => {
    const currentIdx = getCurrentIndex();
    if (currentIdx !== -1) {
        playTrackByIndex(currentIdx + 1);
    }
});


// EVENTO: AL TERMINAR LA CANCIÓN (LÓGICA CORREGIDA)
mainAudio.addEventListener('ended', () => {
    
    // 1. PRIMERO: Si el botón de Autoplay está APAGADO
    if (!isProgressiveMode) {
        // REQUISITO: "Si el botón está apagado no debe haber ninguna funcion autoplay"
        // Simplemente detenemos la UI visualmente
        updatePlayIcon(false); // Ponemos el icono en 'Play'
        progressBar.value = 0; // Reseteamos la barra
        return; // 🔥 IMPORTANTE: Cortamos la ejecución aquí. No hace nada más.
    }

    // 2. SEGUNDO: Si el botón está ENCENDIDO (Autoplay Activo)
    // REQUISITO: "Si tiene cola siga... Si no, repita"
    const currentIdx = getCurrentIndex();
    
    if (currentIdx !== -1) {
    
        playTrackByIndex(currentIdx + 1);
    }
});

// 1. Alternar Play/Pause
// 1. Alternar Play/Pause (MEJORADO PARA iOS)
playPauseBtn.addEventListener('click', () => {
    
    // 🔥 PASO CRÍTICO PARA IPHONE:
    // Verificar si el motor de audio existe y está dormido (suspended).
    // Al estar dentro de un 'click', el navegador nos da permiso para despertarlo.
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }

    if (mainAudio.paused) {
        // Intentamos reproducir
        const playPromise = mainAudio.play();
        
        // Manejo de promesas (Por si el navegador aún bloquea el audio)
        if (playPromise !== undefined) {
            playPromise.then(() => {
                updatePlayIcon(true);
            }).catch(error => {
                console.error("Error al intentar reproducir (iOS restriction?):", error);
            });
        }
    } else {
        mainAudio.pause();
        updatePlayIcon(false);
    }
});

// Función auxiliar para cambiar el icono
function updatePlayIcon(isPlaying) {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
        // También actualizar el visualizador si es necesario
        if(currentPlayingId) updateVisualState(currentPlayingId, true);
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
        if(currentPlayingId) updateVisualState(currentPlayingId, false);
    }
}

// 2. Actualizar barra de progreso mientras suena
mainAudio.addEventListener('timeupdate', () => {
    const { currentTime, duration } = mainAudio;
    
    // Evitar NaN al inicio
    if (isNaN(duration)) return;

    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;

    // Actualizar textos de tiempo
    currentTimeText.textContent = formatTime(currentTime);
    durationText.textContent = formatTime(duration);
});

// 3. Permitir al usuario mover la barra (Seeking)
progressBar.addEventListener('input', () => {
    const { duration } = mainAudio;
    mainAudio.currentTime = (progressBar.value / 100) * duration;
});

// 4. Control de Volumen
// 4. Control de Volumen (Híbrido: PC/Android + iOS GainNode)
volumeBar.addEventListener('input', (e) => {
    const volumeValue = e.target.value / 100;
    
    // A. Logica de Audio
    // 1. Intentar método nativo (PC/Android)
    mainAudio.volume = volumeValue;

    // 2. Intentar método Web Audio API (iOS Fix)
    if (gainNode) {
        // Usamos setTargetAtTime para evitar "clicks" o ruidos bruscos al mover rápido
        gainNode.gain.setTargetAtTime(volumeValue, audioContext.currentTime, 0.01);
    }

    // B. Lógica Visual (Cambiar icono si es 0)
    const volumeIcon = document.querySelector('.volume-container i');
    if (volumeValue === 0) {
        volumeIcon.className = 'fas fa-volume-mute'; // Icono Muteado
        volumeIcon.style.color = 'var(--neon-pink)'; // Feedback visual rojo/rosa
    } else if (volumeValue < 0.5) {
        volumeIcon.className = 'fas fa-volume-down'; // Icono Volumen Bajo
        volumeIcon.style.color = 'var(--neon-cyan)';
    } else {
        volumeIcon.className = 'fas fa-volume-up'; // Icono Volumen Alto
        volumeIcon.style.color = 'var(--neon-cyan)';
    }
});

// 5. Formatear tiempo (de segundos a MM:SS)
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// 🔥 IMPORTANTE: Conectar eventos nativos del audio al botón custom
// (Por si el audio se pausa solo o termina)
mainAudio.addEventListener('play', () => updatePlayIcon(true));
mainAudio.addEventListener('pause', () => updatePlayIcon(false));
mainAudio.addEventListener('ended', () => {
    updatePlayIcon(false);
    progressBar.value = 0;
});


// =================================================================
// 11. BIENVENIDA FUTURISTA (TTS & OVERLAY)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const initBtn = document.getElementById('initBtn');

    // 1. Comprobar si el usuario ya vio la intro en esta sesión
    // (Para no molestar si recarga la página)
    if (sessionStorage.getItem('introPlayed') === 'true') {
        welcomeScreen.style.display = 'none'; // Ocultar inmediatamente
    } else {
        // 2. Si es la primera vez, preparamos el evento
        initBtn.addEventListener('click', () => {
            playWelcomeVoice();
            
            // Efecto visual de apagado
            welcomeScreen.classList.add('hidden');
            
            // Guardar en memoria que ya entró
            sessionStorage.setItem('introPlayed', 'true');

            // Iniciar contexto de audio (para el visualizador más tarde)
            // Esto desbloquea el audio para todo el sitio
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                new AudioContext().resume();
            }
        });
    }
});

function playWelcomeVoice() {
    // Verificar soporte del navegador
    if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance();
        msg.text = "Welcome to Beat Finder. Hope you find your music.";
        
        // Configuración Robótica 🤖
        msg.volume = 1; // 0 a 1
        msg.rate = 0.9; // Velocidad (0.1 a 10) - Un poco lento es más solemne
        msg.pitch = 0.8; // Tono (0 a 2) - Bajo es más robótico
        
        // Intentar buscar una voz en inglés
        const voices = window.speechSynthesis.getVoices();
        // Preferimos voces de "Google US English" o "Samantha" si existen
        const robotVoice = voices.find(v => v.lang.includes('en-US'));
        if (robotVoice) msg.voice = robotVoice;

        window.speechSynthesis.speak(msg);
    }
}


// =================================================================
// 12. LÓGICA FULL SCREEN (NUEVO)
// =================================================================

// =================================================================
// 12. LÓGICA FULL SCREEN & GESTOS (MEJORADA)
// =================================================================

const togglePlayerBtn = document.getElementById('togglePlayerBtn');
const fsMinimizeBtn = document.getElementById('fsMinimizeBtn');
let isFullScreen = false;

// B. FUNCIÓN TOGGLE PRINCIPAL (ACTUALIZADA)
function toggleFullScreen(forceState = null) {
    // ... (Tu código existente de forceState e isFullScreen) ...
    if (forceState !== null) {
        isFullScreen = forceState;
    } else {
        isFullScreen = !isFullScreen;
    }
    
    // ... (Tu código existente de clases CSS e iconos) ...
    globalPlayer.classList.toggle('full-screen', isFullScreen);
    
    const icon = togglePlayerBtn.querySelector('i');
    if (isFullScreen) {
        icon.classList.remove('fa-expand-alt');
        icon.classList.add('fa-compress-alt');
        document.body.style.overflow = 'hidden';
    } else {
        icon.classList.remove('fa-compress-alt');
        icon.classList.add('fa-expand-alt');
        document.body.style.overflow = 'auto';
    }

    // 🔥 ESTO ES LO NUEVO QUE DEBES AGREGAR AL FINAL:
    // Esperamos 450ms (lo que tarda tu transición CSS) para recalcular
    setTimeout(() => {
        resizeVisualizerCanvas(); // Tu función existente
        refreshMarquees();        // LA NUEVA FUNCIÓN MÁGICA
    }, 450);
}


// HELPER: Recalcular textos (Marquees)
function refreshMarquees() {
    if (!currentPlayingId) return;

    // Buscamos la canción actual en tus datos
    const currentSong = allResults.find(s => (s.id || s.trackId) == currentPlayingId);
    if (currentSong) {
        // 1. Título
        setMarquee(playerTitle, currentSong.trackName, false);
        
        // 2. Artista (HTML)
        const safeArtist = currentSong.artistName.replace(/'/g, "\\'");
        const artistHTML = `<span class="clickable-link" onclick="event.stopPropagation(); toggleFullScreen(false); loadArtistData('${currentSong.artistId}', '${safeArtist}')">${currentSong.artistName}</span>`;
        setMarquee(playerArtist, artistHTML, true);

        // 3. Álbum (HTML)
        const playerAlbum = document.getElementById('playerAlbum');
        if (playerAlbum && currentSong.collectionName) {
             const safeAlbum = currentSong.collectionName.replace(/'/g, "\\'");
             let albumHTML = `<span style="cursor:default; color:#aaa;">${currentSong.collectionName}</span>`;
             if (currentSong.collectionId) {
                 albumHTML = `<span class="clickable-link album-link" onclick="event.stopPropagation(); toggleFullScreen(false); loadAlbumData('${currentSong.collectionId}', '${safeAlbum}')">${currentSong.collectionName}</span>`;
             }
             setMarquee(playerAlbum, albumHTML, true);
        }
    }
}

if (fsMinimizeBtn) {
    fsMinimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita conflictos con otros clicks
        toggleFullScreen(false); // Fuerza el cierre
    });
}

// Click en el botón de esquina
togglePlayerBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evitar que el click se propague al fondo
    toggleFullScreen();
});


// B. GESTOS: CLICK PARA ABRIR (MINI PLAYER)
globalPlayer.addEventListener('click', (e) => {
    // Si ya está en pantalla completa, no hacemos nada aquí (el cierre es por swipe o botón)
    if (isFullScreen) return;

    // Si el click fue en un control interactivo (botones, inputs), ignorar
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.corner-fold-btn')) {
        return;
    }

    // Si clickea en el área vacía del mini player -> ABRIR
    toggleFullScreen(true);
});


// C. GESTOS: SWIPE DOWN PARA CERRAR (FULL SCREEN)
let touchStartY = 0;
let touchEndY = 0;

// Capturar inicio del toque
globalPlayer.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, {passive: true});

// Capturar final del toque
globalPlayer.addEventListener('touchend', (e) => {
    if (!isFullScreen) return; // Solo funciona si está abierto

    touchEndY = e.changedTouches[0].screenY;
    handleGesture();
}, {passive: true});

function handleGesture() {
    const swipeDistance = touchEndY - touchStartY;
    
    // Umbral: si desliza más de 50px hacia abajo
    if (swipeDistance > 50) {
        console.log("Swipe Down Detectado: Cerrando Player");
        toggleFullScreen(false);
    }
}

// Ajuste adicional: Tecla ESC para salir en PC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullScreen) {
        toggleFullScreen(false);
    }
});


// =================================================================
// 15. NAVEGACIÓN AVANZADA (HISTORIAL Y ESTADO)
// =================================================================

// Función para VOLVER ATRÁS
function goBack() {
    if (!previousState) return;

    allResults = previousState.results;
    currentPage = previousState.page;
    // 🔥 Restauramos el encabezado anterior
    currentHeaderHTML = previousState.header; 
    
    updatePagination(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    previousState = null;
}
// Función para guardar el estado actual antes de navegar
function saveCurrentState() {
    previousState = {
        results: [...allResults],
        page: currentPage,
        // 🔥 Guardamos también el HTML del encabezado
        header: currentHeaderHTML 
    };
}

async function loadArtistData(artistId, artistName) {
    // ---------------------------------------------------------
    // 1. NUEVO: VALIDACIÓN Y RECUPERACIÓN INTELIGENTE (FALLBACK)
    // ---------------------------------------------------------
    // Si el ID no existe o es inválido, intentamos buscarlo por nombre antes de rendirnos.
    if (!artistId || artistId === 'null' || artistId === 'undefined' || artistId == 0) {
        console.warn("ID de artista no válido, buscando por nombre:", artistName);
        try {
            const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=1`;
            const res = await fetch(searchUrl);
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
                artistId = data.results[0].artistId; // ¡ID Recuperado!
                console.log("ID recuperado exitosamente:", artistId);
            } else {
                console.error("No se encontró el artista por nombre.");
                return; // No hay ID ni se pudo encontrar, detenemos la función.
            }
        } catch (e) {
            console.error("Error en fallback de artista:", e);
            return; // Error de conexión en la búsqueda, detenemos.
        }
    }

    // ---------------------------------------------------------
    // 2. CÓDIGO EXISTENTE (FLUJO ORIGINAL)
    // ---------------------------------------------------------
    
    saveCurrentState();
    showResults(); 

    // Referencias DOM
    const albumsSection = document.getElementById('artistAlbumsSection');
    const albumsCarousel = document.getElementById('artistAlbumsCarousel');

    // Configurar UI de Carga
    resultsGrid.innerHTML = '<div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i> Conectando con base de datos de ' + artistName + '...</div>';
    document.getElementById('pagination').innerHTML = '';
    artistHero.classList.add('hidden'); 
    if(albumsSection) albumsSection.classList.add('hidden'); // Ocultar álbumes mientras carga
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        // 🔥 PASO A: Fetch Songs de iTunes (Top 50 canciones)
        // Nota: Aquí ya usamos el 'artistId' (sea el original o el recuperado arriba)
        const songsUrl = `https://itunes.apple.com/lookup?id=${artistId}&entity=song&limit=50`;
        
        // 🔥 PASO B: Fetch Albums de iTunes (Top 20 álbumes recientes)
        const albumsUrl = `https://itunes.apple.com/lookup?id=${artistId}&entity=album&limit=20&sort=recent`;

        // Ejecutamos ambas peticiones en paralelo para mayor velocidad
        const [songsRes, albumsRes] = await Promise.all([
            fetch(songsUrl),
            fetch(albumsUrl)
        ]);

        const songsData = await songsRes.json();
        const albumsData = await albumsRes.json();

        // --- PROCESAR CANCIONES ---
        const rawSongResults = songsData.results || [];
        const tracks = rawSongResults.filter(item => item.wrapperType === 'track');
        allResults = tracks.map(song => normalizeTrackData(song, 'search'));

        // --- PROCESAR ÁLBUMES (CARRUSEL) ---
        const rawAlbumResults = albumsData.results || [];
        // Filtramos para que sean 'collection' y no el artista mismo
        const albums = rawAlbumResults.filter(item => item.wrapperType === 'collection');

        if (albums.length > 0 && albumsSection && albumsCarousel) {
            albumsCarousel.innerHTML = ''; // Limpiar carrusel anterior

            albums.forEach(album => {
                // Obtener imagen de alta calidad
                const albumImg = album.artworkUrl100.replace(/\d+x\d+bb/, '300x300bb');
                const safeAlbumName = album.collectionName.replace(/'/g, "\\'");

                const card = document.createElement('div');
                card.className = 'carousel-card';
                card.innerHTML = `
                    <img src="${albumImg}" loading="lazy" alt="${album.collectionName}">
                    <div class="carousel-info">
                        <h4 style="font-size:0.8rem;">${album.collectionName}</h4>
                        <p style="font-size:0.7rem;">${album.releaseDate.substring(0, 4)}</p>
                    </div>
                `;
                
                // Click en el álbum -> Cargar ese álbum
                card.addEventListener('click', () => {
                    loadAlbumData(album.collectionId, safeAlbumName);
                });

                albumsCarousel.appendChild(card);
            });
            
            // Mostrar la sección de álbumes
            albumsSection.classList.remove('hidden');
        }

        // --- IMAGEN DEL ARTISTA (LOGICA DEEZER MANTENIDA) ---
        let visualsUrl = '';
        if (tracks.length > 0) {
            visualsUrl = tracks[0].artworkUrl100.replace(/\d+x\d+bb/, '1000x1000bb'); 
        }

        try {
            const cleanName = artistName.split('(')[0].trim();
            const deezerUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(cleanName)}`;
            const deezerRes = await fetch(`https://corsproxy.io/?` + encodeURIComponent(deezerUrl));
            const deezerData = await deezerRes.json();

            if (deezerData.data && deezerData.data.length > 0) {
                const bestMatch = deezerData.data[0];
                if (bestMatch.picture_xl) visualsUrl = bestMatch.picture_xl;
                else if (bestMatch.picture_big) visualsUrl = bestMatch.picture_big;
            }
        } catch (err) { console.warn("Deezer fallback failed"); }

        // 2. CONFIGURAR HERO VISUAL
        const backdrop = document.getElementById('heroBackdrop');
        const avatar = document.getElementById('heroAvatar');
        const title = document.getElementById('heroTitle');

        backdrop.style.backgroundImage = `url('${visualsUrl}')`;
        avatar.src = visualsUrl;
        title.textContent = artistName;

        artistHero.classList.remove('hidden');

        // Render Grid de Canciones
        currentHeaderHTML = ''; 
        currentPage = 1;
        updatePagination(false);

    } catch (error) {
        console.error(error);
        resultsGrid.innerHTML = '<div class="empty-state">Error cargando datos del artista.</div>';
    }
}

async function loadAlbumData(collectionId, albumName) {
    if (!collectionId || collectionId === 'null' || collectionId == 0) {
        return;
    }

    // 1. Guardamos estado
    saveCurrentState();

    resultsGrid.innerHTML = '<div class="empty-state">LOADING' + albumName + '...</div>';
    document.getElementById('pagination').innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const response = await fetch(`https://itunes.apple.com/lookup?id=${collectionId}&entity=song`);
        const data = await response.json();
        const rawResults = data.results || [];
        
        allResults = rawResults
            .filter(item => item.wrapperType === 'track')
            .map(song => normalizeTrackData(song, 'search'));

        // 2. Configurar Header Global
        currentHeaderHTML = `
            <div style="width:100%; text-align:left;">
                <button class="back-btn-header" onclick="goBack()">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2 class="neon-text-light" style="margin-top:10px;">ALBUM: ${albumName}</h2>
            </div>`;

        currentPage = 1;
        updatePagination(false);

    

    } catch (error) {
        console.error(error);
        resultsGrid.innerHTML = '<div class="empty-state">Error cargando álbum.</div>';
    }
}

// =================================================================
// 16. CONTROLES DEL DASHBOARD (NUEVO)
// =================================================================

// Evento para el selector de país
const countrySelectRef = document.getElementById('countrySelect');
if (countrySelectRef) {
    countrySelectRef.addEventListener('change', (e) => {
        currentCountry = e.target.value;
        loadTopCharts();
    });
}

// Función para cambiar Tipo (Songs/Albums)
function switchChartType(type) {
    currentType = type;
    
    // Actualizar botones visualmente
    document.getElementById('btnTypeSongs').classList.toggle('active', type === 'songs');
    document.getElementById('btnTypeAlbums').classList.toggle('active', type === 'albums');
    
    loadTopCharts();
}

// Función para filtrar por Género
function filterByGenre(genreId) {
    currentGenre = genreId;
    
    // Actualizar chips visualmente
    document.querySelectorAll('.genre-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    
    // Buscar el botón clickeado y activarlo (usamos event.target no funcionará directo aquí, 
    // así que buscamos por atributo onclick es un truco rápido)
    const clickedBtn = document.querySelector(`button[onclick="filterByGenre('${genreId}')"]`);
    if(clickedBtn) clickedBtn.classList.add('active');

    loadTopCharts();
}

// Modificamos resetToHome para resetear también los filtros visuales

// FUNCIÓN: RESETEAR A INICIO (HOME) - CORREGIDA
function resetToHome() {
    // 1. Buscamos el elemento directamente para asegurar que existe
    const inputRef = document.getElementById('searchInput');
    if (inputRef) {
        inputRef.value = '';
    }

    previousState = null;

    showHome(); // Volver a mostrar los carruseles

    // Resetear valores por defecto
    currentCountry = 'us';
    currentGenre = '';
    currentType = 'songs';
    
    // Resetear UI del Dashboard (con protección por si los elementos no existen)
    const countrySelect = document.getElementById('countrySelect');
    if(countrySelect) countrySelect.value = 'us';
    
    // Reset visual manual de botones
    const btnSongs = document.getElementById('btnTypeSongs');
    const btnAlbums = document.getElementById('btnTypeAlbums');
    if(btnSongs) btnSongs.classList.add('active');
    if(btnAlbums) btnAlbums.classList.remove('active');
    
    document.querySelectorAll('.genre-chip').forEach(c => c.classList.remove('active'));
    
}

// =================================================================
// 16. LÓGICA DE CARGA PARA PLAYLISTS (GÉNEROS Y PAÍSES)
// =================================================================

// Esta función se activa al dar clic en las tarjetas de colores o banderas
function loadCollection(country, genreId, title) {
    
    // 1. Configurar el Título del Header
    currentHeaderHTML = `
        <div style="width:100%; text-align:left;">
             <button class="back-btn-header" onclick="resetToHome()">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 class="neon-text-light" style="margin-top:10px;">${title}</h2>
        </div>`;

    // 2. Construir la URL de Apple Music dinámicamente
    // Base: https://itunes.apple.com/{PAIS}/rss/topsongs/limit=50/genre={GENERO}/json
    let url = `https://itunes.apple.com/${country}/rss/topsongs/limit=50`;
    
    if (genreId) {
        url += `/genre=${genreId}`;
    }
    
    url += `/json`;

    // 3. Ejecutar la descarga
    fetchAndRenderList(url);
}

// Función auxiliar para descargar, HIDRATAR y mostrar la lista
async function fetchAndRenderList(url) {
    // 1. Preparar UI
    showResults(); 
    if(artistHero) artistHero.classList.add('hidden');
    
    resultsGrid.innerHTML = '<div class="empty-state"><i class="fas fa-circle-notch fa-spin"></i> LOADING...</div>';
    document.getElementById('pagination').innerHTML = '';

    try {
        // A. Descargar el RSS Feed (Datos crudos/sucios)
        const response = await fetch(url);
        const data = await response.json();
        const entries = data.feed.entry || [];

        if (entries.length === 0) {
             resultsGrid.innerHTML = '<div class="empty-state">NOT FOUND.</div>';
             return;
        }

        // B. 🔥 HIDRATACIÓN (EL SECRETO): 
        // Extraemos los IDs de las canciones del RSS para pedirle a Apple los datos LIMPIOS.
        // Esto nos asegura tener artistId, collectionId y carátulas HD.
        const trackIds = entries
            .map(entry => entry.id.attributes['im:id'])
            .slice(0, 50) // Límite de seguridad para la API
            .join(',');

        // C. Consulta de Lookup (Datos limpios)
        // Nota: Usamos 'songs' para buscar canciones por ID
        const lookupResponse = await fetch(`https://itunes.apple.com/lookup?id=${trackIds}&entity=song`);
        const lookupData = await lookupResponse.json();

        // Creamos un mapa para acceso rápido por ID
        const cleanSongsMap = new Map();
        if (lookupData.results) {
            lookupData.results.forEach(song => {
                cleanSongsMap.set(String(song.trackId), song);
            });
        }

        // D. Fusionar manteniendo el orden del Ranking RSS
        // Si la hidratación falla para alguna canción, usamos el fallback del RSS original
        allResults = entries.map(entry => {
            const rssId = entry.id.attributes['im:id'];
            const cleanData = cleanSongsMap.get(rssId);

            if (cleanData) {
                // Usamos la normalización 'search' porque ahora tenemos datos limpios de API
                return normalizeTrackData(cleanData, 'search');
            } else {
                // Fallback (por si acaso)
                return normalizeTrackData(entry, 'feed');
            }
        });

        // E. Renderizar
        currentPage = 1;
        updatePagination(true); // true = mostramos números de ranking (#1, #2...)

    } catch (error) {
        console.error("Error cargando lista hidratada:", error);
        resultsGrid.innerHTML = '<div class="empty-state">ERROR DE CONEXIÓN CON APPLE MUSIC.</div>';
    }
}


// --- FUNCIÓN PARA MOSTRAR EL MENÚ COMPLETO (VER TODO) ---
function showFullMenu(type) {
    // 1. Preparar la Vista
    showResults(); // Ocultar Home, Mostrar Grid
    if(artistHero) artistHero.classList.add('hidden');
    resultsGrid.innerHTML = ''; // Limpiar Grid
    document.getElementById('pagination').innerHTML = ''; // Sin paginación para el menú
    
    let title = '';

   if (type === 'genres') {
    renderCollectionList(ALL_GENRES, null, 'results', 'GENRES', 'genre');
} else if (type === 'countries') {
    renderCollectionList(ALL_COUNTRIES, null, 'results', 'COUNTRIES', 'country');
}

}

// =================================================================
// 17. FUNCIONES UTILITARIAS FALTANTES (FIX)
// =================================================================

// Esta función arregla el error "resizeVisualizerCanvas is not defined"
function resizeVisualizerCanvas() {
    const canvas = document.getElementById('audioVisualizer');
    if (canvas) {
        // Ajustamos el tamaño interno del canvas al tamaño visual de la ventana
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
}

// Opcional: Asegurar que se redimensione si el usuario cambia el tamaño de la ventana manualmente
window.addEventListener('resize', () => {
    if (isFullScreen) {
        resizeVisualizerCanvas();
    }
});


// 6.1 RENDERIZADOR DE BÚSQUEDA GLOBAL (SECCIONES)
function renderGlobalSearch(query, data) {
    resultsGrid.innerHTML = ''; // Limpiar


    // --- A. SECCIÓN ARTISTAS (CON FOTOS DE DEEZER) ---
    if (data.artists.length > 0) {
        renderSectionTitle('ARTISTS');
        
        const artistContainer = document.createElement('div');
        artistContainer.className = 'global-section-container'; 
        artistContainer.style.cssText = "grid-column: 1/-1; display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 30px; justify-content: center;";

        data.artists.forEach(artist => {
            const card = document.createElement('div');
            card.className = 'artist-card-circle'; 
            card.style.cssText = "display:flex; flex-direction:column; align-items:center; width:120px; cursor:pointer; text-align:center;";
            
            // 1. Creamos el elemento de imagen
            const imgEl = document.createElement('img');
            // Ponemos un placeholder inicial mientras carga la real
            imgEl.src = 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png'; 
            imgEl.style.cssText = "width:100%; height:100%; object-fit:cover; transition:transform 0.3s;";

            // 2. 🔥 MAGIA ASÍNCRONA: Buscamos la foto en Deezer en segundo plano
            // Limpiamos el nombre (quitamos paréntesis) para mejorar la búsqueda
            const cleanName = artist.artistName.split('(')[0].trim();
            const deezerUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(cleanName)}`;
            
            // Hacemos el fetch sin detener la carga de la página (Promesa en fondo)
            fetch(`https://corsproxy.io/?` + encodeURIComponent(deezerUrl))
                .then(res => res.json())
                .then(d => {
                    if (d.data && d.data.length > 0) {
                        // ¡Éxito! Reemplazamos el icono por la foto real
                        imgEl.src = d.data[0].picture_medium;
                    }
                })
                .catch(err => { /* Si falla, se queda el icono placeholder */ });

            // 3. Contenedor del círculo
            const circleDiv = document.createElement('div');
            circleDiv.style.cssText = "width:100px; height:100px; border-radius:50%; overflow:hidden; border: 2px solid var(--neon-cyan); margin-bottom:10px; background:#000; position:relative;";
            
            circleDiv.appendChild(imgEl);

            card.appendChild(circleDiv);
            
            // 4. Nombre y Subtítulo
            const nameSpan = document.createElement('span');
            nameSpan.style.cssText = "color:#fff; font-size:0.9rem; font-weight:bold; max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;";
            nameSpan.textContent = artist.artistName;
            
            const typeSpan = document.createElement('span');
            typeSpan.style.cssText = "color:var(--neon-pink); font-size:0.7rem;";
            typeSpan.textContent = "Artista";

            card.appendChild(nameSpan);
            card.appendChild(typeSpan);

            // Eventos
            card.onmouseenter = () => imgEl.style.transform = "scale(1.1)";
            card.onmouseleave = () => imgEl.style.transform = "scale(1)";
            card.onclick = () => loadArtistData(artist.artistId, artist.artistName);
            
            artistContainer.appendChild(card);
        });
        resultsGrid.appendChild(artistContainer);
    }

    // --- B. SECCIÓN ÁLBUMES ---
    if (data.albums.length > 0) {
        renderSectionTitle('ALBUMS');
        
        const albumContainer = document.createElement('div');
        albumContainer.className = 'results-grid'; // Reutilizamos tu grid
        albumContainer.style.cssText = "grid-column: 1/-1; margin-bottom: 30px; padding:0;";

        data.albums.forEach(album => {
            const imgHighRes = album.artworkUrl100.replace('100x100bb', '300x300bb');
            const safeName = album.collectionName.replace(/'/g, "\\'");
            
            const card = document.createElement('div');
            card.className = 'song-card'; // Reutilizamos estilo de carta
            card.innerHTML = `
                <img src="${imgHighRes}" loading="lazy" style="border-radius:8px; margin-bottom:8px;">
                <div class="song-info">
                    <h3 style="font-size:0.9rem;">${album.collectionName}</h3>
                    <p style="color:var(--neon-purple); font-size:0.8rem;">${album.artistName}</p>
                    <span style="font-size:0.7rem; color:#666;">${album.releaseDate.substring(0,4)} • Álbum</span>
                </div>
            `;
            card.onclick = () => loadAlbumData(album.collectionId, safeName);
            albumContainer.appendChild(card);
        });
        resultsGrid.appendChild(albumContainer);
    }

    // --- C. SECCIÓN CANCIONES ---
    if (data.songs.length > 0) {
        renderSectionTitle('SONGS');
        
        // Para las canciones, necesitamos normalizarlas primero
        const normalizedSongs = data.songs
            .filter(item => item.wrapperType === 'track')
            .map(song => normalizeTrackData(song, 'search'));

        // Guardamos en allResults para que funcione el reproductor (Prev/Next)
        allResults = normalizedSongs;
        currentPage = 1; // Reset paginación interna (aunque aquí mostramos todo scroll)

        // Renderizamos usando tu lógica existente pero dentro de un contenedor
        // Truco: Llamamos a renderResults pero cuidado, renderResults limpia el grid.
        // Así que haremos un loop manual aquí para appendearlas.
        
        const songsContainer = document.createElement('div');
        songsContainer.className = 'results-grid';
        songsContainer.style.cssText = "grid-column: 1/-1; padding:0;";

        normalizedSongs.forEach((song, index) => {
            // Reutilizamos lógica visual de cartas
            const card = createSongCardHTML(song, index); // Helper que crearemos abajo
            songsContainer.appendChild(card);
        });
        resultsGrid.appendChild(songsContainer);
    } else {
        if (data.artists.length === 0 && data.albums.length === 0) {
            resultsGrid.innerHTML = '<div class="empty-state">NOT FOUND.</div>';
        }
    }
}

// Helper para Títulos de Sección
function renderSectionTitle(title) {
    const div = document.createElement('div');
    div.style.gridColumn = "1 / -1";
    div.style.marginTop = "10px";
    div.style.marginBottom = "10px";
    div.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
    div.innerHTML = `<h3 style="color:var(--neon-cyan); font-family:var(--font-title); font-size:1.2rem;">${title}</h3>`;
    resultsGrid.appendChild(div);
}

// Helper para crear carta de canción (Extraído de tu renderResults para reutilizar)
function createSongCardHTML(song, index) {
    let rawUrl = song.artworkUrl100 || ''; 
    let highResImage = rawUrl.replace(/\d+x\d+bb/, '600x600bb');
    const currentId = song.trackId || song.id || index;
    const safeArtist = song.artistName.replace(/'/g, "\\'");
    const safeAlbum = song.collectionName.replace(/'/g, "\\'");

    const card = document.createElement('div');
    card.className = 'song-card';
    card.setAttribute('data-id', currentId);

    // HTML interno igual a tu diseño
    card.innerHTML = `
        <div class="image-container" style="position: relative;">
            <img src="${highResImage}" alt="${song.trackName}" loading="lazy">
            <div class="play-overlay">
                <i class="play-btn-card icon-state fas fa-play"></i>
            </div>
        </div>
        <div class="song-info">
            <h3>${song.trackName}</h3>
            <p onclick="event.stopPropagation(); loadArtistData('${song.artistId}', '${safeArtist}')" class="clickable-link">
                <i class="fas fa-user"></i> ${song.artistName}
            </p>
             ${song.collectionId ? 
                `<span class="clickable-link album-link" onclick="event.stopPropagation(); loadAlbumData('${song.collectionId}', '${safeAlbum}')">
                    <i class="fas fa-compact-disc"></i> ${song.collectionName}
                </span>` : 
                `<span class="album-text-only">${song.collectionName}</span>`
            }
        </div>
        ${generateExternalLinks(song)}
    `;

    card.addEventListener('click', (e) => {
        if (e.target.closest('.external-links') || e.target.closest('.clickable-link')) return;
        playTrack(song, highResImage, currentId);
    });

    return card;
}

// Recalcular Marquees al cambiar tamaño de ventana
window.addEventListener('resize', () => {
    // Solo si hay algo reproduciéndose
    if (currentPlayingId) {
        // Buscamos la canción actual en allResults
        const currentSong = allResults.find(s => (s.id || s.trackId) == currentPlayingId);
        if (currentSong) {
            // Volvemos a llamar a la lógica de renderizado del texto del player
            // pero sin reiniciar el audio.
            
            // Título
            setMarquee(playerTitle, currentSong.trackName, false);
            
            // Artista
            const safeArtist = currentSong.artistName.replace(/'/g, "\\'");
            const artistHTML = `<span class="clickable-link" onclick="event.stopPropagation(); toggleFullScreen(false); loadArtistData('${currentSong.artistId}', '${safeArtist}')">${currentSong.artistName}</span>`;
            setMarquee(playerArtist, artistHTML, true);

            // Álbum
            const playerAlbum = document.getElementById('playerAlbum');
            if (playerAlbum && currentSong.collectionName) {
                 const safeAlbum = currentSong.collectionName.replace(/'/g, "\\'");
                 let albumHTML = `<span style="cursor:default; color:#aaa;">${currentSong.collectionName}</span>`;
                 if (currentSong.collectionId) {
                     albumHTML = `<span class="clickable-link album-link" onclick="event.stopPropagation(); toggleFullScreen(false); loadAlbumData('${currentSong.collectionId}', '${safeAlbum}')">${currentSong.collectionName}</span>`;
                 }
                 setMarquee(playerAlbum, albumHTML, true);
            }
        }
    }
});