
# 🎵 B3AT FIND3R v2.0 (Cyberpunk Edition)

**B3AT FIND3R** ha evolucionado. Lo que comenzó como un buscador de música estándar se ha transformado en una **Web App Progresiva (PWA-like)** con una experiencia de usuario que rivaliza con aplicaciones nativas.

Esta **Versión 2.0** introduce una arquitectura de "Live Search" (búsqueda en vivo), un sistema híbrido de APIs para obtener imágenes de alta resolución (iTunes + Deezer), y un reproductor inmersivo con modo Pantalla Completa y gestos táctiles.

*(Reemplaza este link con tu captura de la pantalla principal v2)*

## 🌐 Accede al proyecto online

🔗 [https://joelrodriguezdev.github.io/BeatFinder/](https://joelrodriguezdev.github.io/BeatFinder/)

---

## 🛠️ Stack Tecnológico y Arquitectura

Hemos escalado la complejidad técnica integrando múltiples fuentes de datos y optimizaciones de rendimiento:

| Recurso | Implementación Técnica |
| :--- | :--- |
| **HTML5 / CSS3** | Variables CSS, Grid/Flexbox, Animaciones `cubic-bezier` y Glassmorphism avanzado. |
| **Vanilla JavaScript (ES6+)** | Arquitectura basada en eventos, manejo de Estado (`State Management`) y Promesas. |
| **Fetch API & Async/Await** | Peticiones paralelas (`Promise.all`) y manejo de errores robusto. |
| **Web Audio API** | Motor de visualización de frecuencias (FFT) en tiempo real sincronizado con el DOM. |
| **iTunes Search API** | Data principal (Metadatos de canciones, álbumes y rankings globales). |
| **Deezer API** | **(Nuevo)** Hidratación asíncrona para obtener fotos de artistas en HD. |
| **Speech Synthesis** | Interfaz de voz (TTS) para feedback auditivo del sistema. |

---

## 🚀 Novedades de la Versión 2.0 (Changelog)

Esta actualización se centró en la **UX Móvil** y la **calidad de los datos**.

### 1. Live Scanner & Debouncing ⚡
Eliminamos el botón de "Buscar" estático.
* **Live Search:** Los resultados aparecen mientras escribes.
* **Optimización (Debounce):** Implementamos un temporizador lógico (400ms) que espera a que el usuario termine de escribir antes de lanzar la petición, protegiendo la API de saturación y mejorando el rendimiento.
* **UI Escáner:** Animación de luz láser sobre el input para indicar estado de espera.

### 2. Modo "Full Screen" Inmersivo 📱
Transformamos el reproductor mini en una experiencia de pantalla completa.
* **Gestos Táctiles:** Desliza hacia abajo (Swipe Down) para minimizar el reproductor.
* **Diseño Adaptativo:** El layout cambia drásticamente entre móvil y escritorio, centrando la información y expandiendo la carátula.
* **Marquee Text:** Títulos largos se desplazan automáticamente (efecto scroll infinito) como en Spotify/Apple Music.

### 3. Hidratación Híbrida de Datos (iTunes + Deezer) 🧬
La API de iTunes no provee fotos de artistas, así que creamos una solución inteligente:
1.  Buscamos la metadata en **iTunes**.
2.  Mientras se renderiza la tarjeta, lanzamos una petición en segundo plano a **Deezer**.
3.  **Hot-Swap:** En cuanto Deezer responde, reemplazamos el icono genérico por la foto HD del artista en tiempo real sin bloquear la interfaz.

### 4. Dashboard Global 🌍
Agregamos un panel de control para filtrar las tendencias mundiales.
* **Selector de Países:** Explora el Top 100 de Japón, España, USA, etc.
* **Filtro por Géneros:** Chips interactivos para cambiar entre Rock, Urbano, K-Pop, etc.

### 5. Visualizador de Audio Mejorado 📊
* Refinamiento de los gradientes de color (Cyan a Purple) en el elemento `<canvas>`.
* Ajuste de sensibilidad de frecuencias para una respuesta visual más precisa.

---

## 🧠 Lógica Senior: ¿Cómo funciona por dentro?

### A. Patrón de "Estado y Restauración"
Implementamos un sistema de historial manual. Si entras al perfil de un artista o un álbum, el sistema guarda el estado exacto de la búsqueda anterior (resultados, posición del scroll, paginación). Al dar al botón "Atrás", la aplicación restaura la vista instantáneamente sin volver a recargar datos.

### B. Normalización de Datos
Dado que usamos dos endpoints de iTunes (`RSS Feed` para el Top 100 y `Search API` para búsquedas), los formatos de datos JSON son diferentes. Creamos una **Capa de Normalización** que transforma cualquier respuesta en un objeto estandarizado antes de que llegue a la UI.

```javascript
// Ejemplo conceptual de la normalización
function normalizeTrackData(rawDetails) {
    return {
        id: rawDetails.trackId || rawDetails.id.attributes['im:id'],
        image: rawDetails.artworkUrl100.replace('100x100', '600x600'), // Hack para HD
        // ...
    };
}
````

### C. Hack de Audio para iOS

Los iPhones bloquean el contexto de audio si no es activado por un gesto del usuario.

  * **Solución:** "Despertamos" el `AudioContext` y el `GainNode` en el primer evento `touchstart` o `click` del usuario, permitiendo que el visualizador y el control de volumen funcionen nativamente en Safari Mobile.

-----

## 📸 Galería del Sistema

### 1\. Live Scanner & Dashboard

*Nueva barra de búsqueda viva y filtros globales.*

### 2\. Perfil de Artista (Data Híbrida)

*Datos de iTunes combinados con fotos de Deezer.*

### 3\. Reproductor Full Screen

*Modo inmersivo con Marquee y Visualizador.*

-----

## 🧑‍💻 Autor

Desarrollado por **Joel Rodríguez**.
Enfocado en crear experiencias web que se sientan nativas, rápidas y visualmente impactantes.

> "No es solo código, es una experiencia."

-----

## 📬 Conecta conmigo

💻 **GitHub:** [JoelRodriguezDEV](https://github.com/JoelRodriguezDEV)
💼 **LinkedIn:** [Joel Rodríguez](https://www.linkedin.com/in/joel-rodriguez-414202285/)

-----

## 📄 Licencia

Este proyecto es para fines educativos y no comerciales.
*Metadata cortesía de Apple Inc. & Deezer.*
Licencia MIT.

```
```
