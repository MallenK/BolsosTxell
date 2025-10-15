import { renderHome, renderCatalog, renderProduct, renderAbout, renderContact, renderLegal } from './ui.js';

const routes = [
  { path: '#/', action: renderHome },
  { path: '#/catalogo', action: renderCatalog },
  { path: '#/producto/', action: renderProduct, isPrefix: true },
  { path: '#/sobre', action: renderAbout },
  { path: '#/contacto', action: renderContact },
  { path: '#/legal/', action: renderLegal, isPrefix: true }
];

export function initRouter() {
  const handle = () => {
    const hash = location.hash || '#/';
    for (const r of routes) {
      if (r.isPrefix ? hash.startsWith(r.path) : hash === r.path) {
        return r.action(hash);
      }
    }
    renderHome();
  };
  window.addEventListener('hashchange', handle);
  handle();
}
