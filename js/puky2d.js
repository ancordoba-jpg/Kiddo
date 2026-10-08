/**
 * Renderizador del Koala Puky oficial (Imagen 2) para la pantalla de Inicio
 * Con pelaje beige/gris suave, grandes orejas esponjosas con interior rosa,
 * ojos marrones grandes y expresivos, pañuelo verde al cuello y animación de saludo.
 */

class Puky2DManager {
  renderTo(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const size = options.size || 190;
    const isWaving = options.waving !== false;

    container.innerHTML = `
      <div class="puky-official-companion-wrapper" style="width: ${size}px; height: ${size}px; position: relative; margin: 0 auto; display: flex; justify-content: center; align-items: center;">
        <img src="assets/koala_transparent.png" alt="Puky el Koala Oficial" class="puky-official-koala-img ${isWaving ? 'is-waving' : ''}" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 8px 18px rgba(0,0,0,0.12)); cursor: pointer; transition: transform 0.2s;" onclick="if(window.kiddoAudio) window.kiddoAudio.playBubbleSound(); this.classList.add('jump-bounce'); setTimeout(() => this.classList.remove('jump-bounce'), 450);" title="¡Tócame para saludar!">
      </div>
    `;
  }
}

window.puky2D = new Puky2DManager();

