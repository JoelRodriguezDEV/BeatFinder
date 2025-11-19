
-----

# 🎵 B3AT FIND3R (Antes Find My Songz)

**B3AT FIND3R** es una evolución radical de mi buscador de música original. Lo que comenzó como una herramienta sencilla para consultar la iTunes API se ha transformado en una **experiencia audiovisual inmersiva** con estética Cyberpunk/Neon.

Esta versión no solo busca canciones; te sumerge en ellas con un visualizador de audio en tiempo real, controles personalizados flotantes y una interfaz que respira neón.

*(Reemplaza este link con tu captura de la pantalla principal)*

## 🌐 Accede al proyecto online

🔗 [https://joelrodriguezdev.github.io/BeatFinder/](https://joelrodriguezdev.github.io/BeatFinder/)

-----

## 🛠️ Tecnologías y Nuevas Herramientas

Hemos elevado el nivel técnico del proyecto integrando APIs modernas del navegador:

| Recurso                  | Uso e Implementación                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| **HTML5 Semántico** | Estructura base optimizada.                                                              |
| **CSS3 Avanzado** | Variables CSS, Flexbox/Grid, Animaciones Keyframes, Backdrop-filter (Glassmorphism).     |
| **Vanilla JavaScript** | Lógica de estado, manejo del DOM, y control de APIs asíncronas.                          |
| **Web Audio API** | **(Nuevo)** Motor para el visualizador de audio y análisis de frecuencias en tiempo real. |
| **Speech Synthesis API** | **(Nuevo)** Voz robótica TTS (Text-to-Speech) para la bienvenida del sistema.            |
| **iTunes Search API** | Fuente de datos (Charts Top 100 Global y Búsquedas).                                     |

-----

## 🚀 Evolución y Novedades (Changelog)

Este proyecto ha sufrido una reingeniería completa (Refactoring) enfocada en la **Experiencia de Usuario (UX)** y el **Diseño de Interfaz (UI)**. Aquí los detalles de los cambios más importantes:

### 1\. Estética Cyberpunk & Neon 🌃

Abandonamos el diseño plano por una interfaz oscura y vibrante.

  * **Fondo Animado:** Grid en movimiento que simula un entorno digital 3D.
  * **Feedback Visual:** Las tarjetas de las canciones brillan y "pulsan" en rosa neón cuando se reproducen.
  * **Tipografías:** Integración de fuentes futuristas (`Orbitron` y `Rajdhani`).

### 2\. Visualizador de Audio Real 📊

Ya no es solo escuchar, es ver la música.

  * Implementamos un `<canvas>` que dibuja barras de frecuencia en tiempo real usando la **Web Audio API**.
  * El visualizador se renderiza a 60fps detrás de los controles, creando un efecto de profundidad.

### 3\. Reproductor "Glassmorphism" Personalizado 🎧

Adiós a la etiqueta `<audio controls>` nativa y aburrida del navegador.

  * Creamos un reproductor flotante con efecto de cristal esmerilado (blur).
  * Sliders de rango personalizados (CSS) para el volumen y la barra de progreso.
  * Lógica inteligente: El reproductor aparece suavemente desde abajo solo cuando das "Play".

### 4\. Sistema de Bienvenida e Inicialización 🤖

Para cumplir con las políticas de *Autoplay* de los navegadores modernos y añadir inmersión:

  * Pantalla de bloqueo tipo "Terminal" al entrar.
  * Botón **"INITIALIZE SYSTEM"** que desbloquea el contexto de audio.
  * Bienvenida por voz sintética (TTS) tipo IA: *"Welcome to BeatFinder. System Online"*.

### 5\. Optimización y Rendimiento (Paginación) ⚡

Para evitar sobrecargar el navegador en móviles:

  * Implementamos **Paginación en el Cliente**: Descargamos 100 canciones pero solo renderizamos 10 a la vez.
  * Navegación fluida entre páginas sin volver a llamar a la API.
  * Cálculo dinámico del ranking (Ej: El \#11 aparece correctamente en la página 2).

-----

## 📸 Galería del Sistema

### 1\. Búsqueda y Resultados

Interfaz limpia con paginación y tarjetas interactivas.

### 2\. Reproductor Activo con Visualizador

El reproductor flotante en acción con las barras de audio de fondo.

### 3\. Pantalla de Bienvenida (Intro)

Overlay inicial para activar el sistema.

-----

## 🧠 Cómo funciona internamente (Lógica Senior)

1.  **Gestión de Estado (State Management):**

      * Variables globales controlan qué canción suena (`currentPlayingId`), el array de resultados (`allResults`) y la página actual.
      * Esto permite pausar una canción visualmente en el grid si le das click al botón de pausa del footer.

2.  **Sincronización Visual:**

      * Al dar Play, el código busca la tarjeta específica por su ID y le añade la clase `.active-track` (borde neón y animación), apagando cualquier otra que estuviera sonando.

3.  **Manejo de Errores y CORS:**

      * Se configuró el atributo `crossorigin="anonymous"` para permitir que el *Audio Context* analice el flujo de datos proveniente de los servidores de Apple sin bloqueos de seguridad.

-----

## 🧑‍💻 Autor

Desarrollado con pasión y mucho café por **Joel Rodríguez**.
Este proyecto representa mi evolución como desarrollador Full Stack, prestando atención obsesiva a los detalles visuales y la experiencia de usuario.

> "El código es poesía, la interfaz es la melodía."

-----

## 📬 Contacto

¿Te gustó el rediseño? ¡Hablemos\!

📧 Email: [joerh0803@gmail.com](mailto:joerh0803@gmail.com)
💻 GitHub: [Joel-D-Rodriguez](https://github.com/Joel-D-Rodriguez)

-----

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Si usas este código, ¡menciónalo y sigue creando cosas increíbles\!
