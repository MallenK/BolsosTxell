export const store = {
  lang: localStorage.getItem('lang') || 'es',
  products: [],
  productsCA: [],
  filters: { category: 'all', min: 50, max: 150, q: '' },

  // NUEVO: imagen del hero
  heroImage: './assets/img/Cro_Txet.png',

  setLang(l) { 
    this.lang = l; 
    localStorage.setItem('lang', l); 
  }
};
