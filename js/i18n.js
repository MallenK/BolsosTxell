import { store } from './store.js';

export let dict = {};

export async function loadI18n() {
  const path = store.lang === 'ca' ? './data/copy.ca.json' : './data/copy.es.json';
  const res = await fetch(path);
  dict = await res.json();

  // Inyecta elementos con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key, null);
    if (typeof val === 'string') el.textContent = val;
  });
  return dict;
}

export function t(key, fallback = '') {
  const val = key.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), dict);
  return (typeof val === 'string' || typeof val === 'number') ? val : (fallback ?? key);
}
