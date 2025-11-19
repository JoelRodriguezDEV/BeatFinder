
// 1. REFERENCIAS AL DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsGrid = document.getElementById('results');
const globalPlayer = document.getElementById('globalPlayer');
const mainAudio = document.getElementById('mainAudio');

// Elementos del reproductor mini
const playerImg = document.getElementById('playerImg');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerExternalLinks = document.getElementById('playerExternalLinks');

let allResults = [];      // Aquí guardaremos TODOS los datos (100 o 50)
let currentPage = 1;      // Página actual
const itemsPerPage = 10;  // Tu regla de oro: 10 por página

let debounceTimer;

// 2. INICIALIZACIÓN (Cargar Top 100 al inicio)
document.addEventListener('DOMContentLoaded', () => {
    loadTopCharts();
});

// 3. EVENT LISTENERS
searchBtn.addEventListener('click', () => performSearch());

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = searchInput.value.trim();
        if(query.length > 2) {
            performSearch();
        } else if (query.length === 0) {
            // Si borra todo, volvemos a cargar el Top 100
            loadTopCharts();
        }
    }, 600);
});


// 4. FUNCIÓN: CARGAR TOP 100 GLOBAL (Apple Music RSS)
async function loadTopCharts() {
    resultsGrid.innerHTML = '<div class="empty-state">🔥 CARGANDO TOP 100 GLOBAL...</div>';
    document.getElementById('pagination').innerHTML = ''; // Limpiar paginación vieja

    try {
        const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=100/json');
        const data = await response.json();
        const feed = data.feed.entry;

        const normalizedSongs = feed.map(song => {
            return {
                id: song.id.attributes['im:id'], 
                trackName: song['im:name'].label,
                artistName: song['im:artist'].label,
                artworkUrl100: song['im:image'][2].label, 
                previewUrl: song.link[1].attributes.href,
                trackViewUrl: song.link[0].attributes.href
            };
        });

        // 🔥 CAMBIO CRÍTICO: Guardamos en global y paginamos
        allResults = normalizedSongs;
        currentPage = 1;
        updatePagination(true); // true = es modo Chart

    } catch (error) {
        console.error('Error cargando charts:', error);
        resultsGrid.innerHTML = '<div class="empty-state">⚠️ ERROR AL CARGAR CHARTS.</div>';
    }
}

// =================================================================
// 5. BUSCADOR Y PAGINACIÓN (FALTABA ESTA LÓGICA)
// =================================================================

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    resultsGrid.innerHTML = '<div class="empty-state">SCANNING DATABASE...</div>';
    document.getElementById('pagination').innerHTML = '';

    try {
        // Pedimos 50 resultados
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=50`);
        const data = await response.json();
        
        // Guardamos en la variable global 'allResults'
        allResults = data.results || [];
        currentPage = 1; 
        
        // Llamamos a la paginación (false = no es Chart)
        updatePagination(false);

    } catch (error) {
        console.error('Error:', error);
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
function renderResults(songs, isChart = false, startIndex = 0) {
    resultsGrid.innerHTML = ''; 

    if (isChart) {
        const titleChart = document.createElement('div');
        titleChart.style.gridColumn = "1 / -1";
        titleChart.style.marginBottom = "20px";
        titleChart.innerHTML = `<h2 class="neon-text-light" style="font-size: 1.5rem;">🚀 GLOBAL TOP 100 HITS</h2>`;
        resultsGrid.appendChild(titleChart);
    }

    if (songs.length === 0) {
        resultsGrid.innerHTML = '<div class="empty-state">NO SE ENCONTRARON DATOS.</div>';
        return;
    }

    songs.forEach((song, index) => {
        let highResImage = song.artworkUrl100;
        if (!isChart) {
            highResImage = song.artworkUrl100.replace('100x100bb', '600x600bb');
        } else {
            highResImage = song.artworkUrl100.replace('170x170bb', '600x600bb');
        }
        
        const currentId = song.trackId || song.id || index;

        // 🔥 AQUÍ ESTÁ EL CÁLCULO NUEVO QUE NO TENÍAS:
        // Si estamos en página 2 (startIndex = 10) y es el primer item (index = 0):
        // 10 + 0 + 1 = Ranking #11. ¡Perfecto!
        const realRank = startIndex + index + 1;
        
        const externalLinksHTML = generateExternalLinks(song);
        
        // Usamos 'realRank' en lugar de 'index + 1'
        const rankBadge = isChart ? `<div style="position:absolute; top:10px; left:10px; background:var(--neon-pink); color:white; font-weight:bold; padding:2px 8px; border-radius:5px; z-index:10; box-shadow:0 0 10px var(--neon-pink);">#${realRank}</div>` : '';

        const card = document.createElement('div');
        card.className = 'song-card';
        card.setAttribute('data-id', currentId);
        
        card.innerHTML = `
            <div class="image-container" style="position: relative;">
                ${rankBadge}
                <img src="${highResImage}" alt="${song.trackName}" loading="lazy">
                <div class="play-overlay">
                    <span class="play-btn-card icon-state">▶</span>
                </div>
            </div>
            <div class="song-info">
                <h3>${song.trackName}</h3>
                <p>${song.artistName}</p>
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
    // 1. Apagar la canción anterior (si existe)
    if (currentPlayingId && currentPlayingId !== newId) {
        const prevCard = document.querySelector(`.song-card[data-id="${currentPlayingId}"]`);
        if (prevCard) {
            prevCard.classList.remove('active-track');
            prevCard.querySelector('.icon-state').textContent = '▶';
        }
    }

    // 2. Encender la nueva canción
    if (newId) {
        const currentCard = document.querySelector(`.song-card[data-id="${newId}"]`);
        if (currentCard) {
            if (isPlaying) {
                currentCard.classList.add('active-track');
                // Cambiamos el icono a Pausa visualmente en el grid
                currentCard.querySelector('.icon-state').textContent = '⏸'; 
            } else {
                // Si está en pausa, mantenemos el borde rosa pero el icono vuelve a play
                currentCard.classList.remove('active-track'); // Opcional: quitar borde si pausas
                currentCard.querySelector('.icon-state').textContent = '▶';
            }
        }
        currentPlayingId = newId; // Actualizamos el rastro
    }
}

// 8. REPRODUCTOR GLOBAL
function playTrack(song, imageUrl, id) {
    globalPlayer.classList.add('visible');

    // ... (tu código de actualización de UI del player sigue igual) ...
    playerImg.src = imageUrl;
    playerImg.classList.remove('hidden');
    playerTitle.textContent = song.trackName;
    playerArtist.textContent = song.artistName;
    
    // Actualizar links... (tu código sigue igual)

    if (!isVisualizerInit) {
        initVisualizer();
    }

    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Lógica de Audio
    if (mainAudio.src !== song.previewUrl) {
        mainAudio.src = song.previewUrl;
        mainAudio.play();
        // 🔥 Actualizamos visualmente el Grid
        updateVisualState(id, true);
    } else {
        // Si el usuario clica la MISMA canción, alternamos pausa/play
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
let isVisualizerInit = false; // Bandera para no reinicializarlo mil veces

function initVisualizer() {
    if (isVisualizerInit) return; // Si ya está listo, no hacemos nada

    // 1. Crear contexto de audio (Soporte para Safari incluido)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();

    // 2. Crear el Analizador (el cerebro que extrae frecuencias)
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Resolución de las barras (32, 64, 128, 256, 512...)

    // 3. Conectar el audio del HTML al sistema de Web Audio
    // OJO: mainAudio ya lo tienes declarado arriba
    try {
        source = audioContext.createMediaElementSource(mainAudio);
        source.connect(analyser);
        analyser.connect(audioContext.destination); // Conectar a los altavoces
        isVisualizerInit = true;
        
        // Iniciar el bucle de dibujo
        drawVisualizer();
    } catch (e) {
        console.error("Error inicializando audio context:", e);
    }
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

// 1. Alternar Play/Pause
playPauseBtn.addEventListener('click', () => {
    if (mainAudio.paused) {
        mainAudio.play();
        updatePlayIcon(true);
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
volumeBar.addEventListener('input', (e) => {
    mainAudio.volume = e.target.value / 100;
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