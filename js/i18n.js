import { store } from './store.js';

export async function loadI18n() {
  const path = store.lang === 'ca' ? './data/copy.ca.json' : './data/copy.es.json';
  const res = await fetch(path);
  const dict = await res.json();
  // inyecta textos data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = key.split('.').reduce((o, k) => (o ? o[k] : null), dict);
    if (typeof val === 'string') el.textContent = val;
  });
  return dict;
}
