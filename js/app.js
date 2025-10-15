import { store } from './store.js';
import { initRouter } from './router.js';
import { loadI18n } from './i18n.js';

async function loadData(){
  const resES = await fetch('./data/products.es.json');
  store.products = await resES.json();

  // opcional CA extendida: se podría mapear nombres/desc si hay más items
  try {
    const resCA = await fetch('./data/products.ca.json');
    store.productsCA = await resCA.json();
  } catch {}
}

function initHeader(){
  const sel = document.getElementById('lang-select');
  sel.value = store.lang;
  sel.addEventListener('sl-change', async (e)=>{
    store.setLang(e.target.value);
    await loadI18n();
    // re-render ruta actual
    window.dispatchEvent(new Event('hashchange'));
  });

  // WhatsApp header link
  const wa = document.getElementById('whats-cta');
  wa.href = 'https://wa.me/34600000000?text=Hola,%20quiero%20informaci%C3%B3n';
}

function initUX(){
  // Lenis smooth scroll
  const lenis = new Lenis();
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // Icons
  lucide.createIcons();
}

(async function boot(){
  await loadData();
  await loadI18n();
  initHeader();
  initUX();
  initRouter();
})();
