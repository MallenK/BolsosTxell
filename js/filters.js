import { store } from './store.js';

export function applyFilters(list) {
  const f = store.filters;
  return list.filter(p => {
    const byCat = f.category === 'all' || p.categoria === f.category;
    const byPrice = p.precioDesde >= f.min && p.precioDesde <= f.max;
    const byQ = !f.q || (p.nombre.toLowerCase().includes(f.q) );
    return byCat && byPrice && byQ;
  });
}
