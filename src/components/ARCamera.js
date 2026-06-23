// ARCamera.js — AR camera mode with fallback
import { createElement } from '../utils/dom.js';
import { AudioManager } from '../services/AudioManager.js';

export function createARCamera({ onBack }) {
  const screen = createElement('div', 'ar-screen screen-enter');

  let stream = null;

  // Try camera access
  async function initCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      // Create video element
      const video = createElement('video', 'ar-video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true;
      screen.appendChild(video);

      // Overlay controls
      const overlay = createElement('div', 'ar-overlay');

      const label = createElement('div', 'ar-label', { textContent: 'SIMULASI 3D & INFO PLANET' });
      overlay.appendChild(label);

      const backBtnContainer = createElement('div', 'ar-back-btn');
      const backBtn = createElement('button', 'back-btn', { textContent: '←' });
      backBtn.addEventListener('click', () => {
        cleanup();
        AudioManager.playClick();
        onBack();
      });
      backBtnContainer.appendChild(backBtn);
      overlay.appendChild(backBtnContainer);

      // AR return button
      const returnBtn = createElement('button', 'ar-btn');
      returnBtn.style.cssText = 'position:absolute;bottom:120px;left:50%;transform:translateX(-50%);';
      returnBtn.innerHTML = '← KEMBALI JELAJAH AR';
      returnBtn.addEventListener('click', () => {
        cleanup();
        AudioManager.playClick();
        onBack();
      });
      overlay.appendChild(returnBtn);

      screen.appendChild(overlay);

    } catch (error) {
      console.warn('Camera access error:', error);
      showFallback();
    }
  }

  function showFallback() {
    const fallback = createElement('div', 'ar-fallback');
    const icon = createElement('div', 'ar-fallback-icon', { textContent: '📷' });
    const title = createElement('div', 'ar-fallback-title', { textContent: 'Kamera AR Tidak Tersedia' });
    const text = createElement('div', 'ar-fallback-text', {
      textContent: 'Perangkat kamu tidak mendukung kamera AR atau izin kamera belum diberikan. Pastikan menggunakan HTTPS dan browser yang mendukung.',
    });
    const backBtn = createElement('button', 'btn btn-purple btn-pill', {
      textContent: '← Kembali ke Jelajah',
    });
    backBtn.addEventListener('click', () => {
      AudioManager.playClick();
      onBack();
    });

    fallback.appendChild(icon);
    fallback.appendChild(title);
    fallback.appendChild(text);
    fallback.appendChild(backBtn);
    screen.appendChild(fallback);
  }

  function cleanup() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
  }

  initCamera();

  // Store cleanup reference
  screen._cleanup = cleanup;

  return screen;
}
