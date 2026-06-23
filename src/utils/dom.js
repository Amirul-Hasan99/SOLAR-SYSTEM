// dom.js — DOM helper utilities

export function createElement(tag, className, attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'textContent') el.textContent = val;
    else if (key === 'innerHTML') el.innerHTML = val;
    else if (key === 'onclick') el.addEventListener('click', val);
    else el.setAttribute(key, val);
  });
  return el;
}

export function clearElement(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function appendChildren(parent, ...children) {
  children.forEach(child => {
    if (child) parent.appendChild(child);
  });
}

export function showScreen(container, screenEl) {
  clearElement(container);
  screenEl.classList.add('screen-enter');
  container.appendChild(screenEl);
}

export function isMobile() {
  return window.innerWidth <= 768;
}
