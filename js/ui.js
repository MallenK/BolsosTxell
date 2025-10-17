
import { store } from './store.js';
import { applyFilters } from './filters.js';
import { waLink } from './whatsapp.js';

function byId(id){ return document.getElementById(id); }
function mount(html){ byId('app').innerHTML = html; window.scrollTo(0,0); }

const CATS = [
  { key: 'Barrel', title: 'Bolsos Barrel', copy: 'Cilíndricos, capacidad y presencia.' },
  { key: 'Clutch', title: 'Clutch', copy: 'Minimal para eventos y noche.' },
  { key: 'Frame',  title: 'Frame',  copy: 'Cierre de marco, aire clásico.' },
  { key: 'Flap',   title: 'Flap',   copy: 'Tapa frontal, uso diario.' },
  { key: 'Barrel', title: 'Barrel Weekender', copy: 'Finde y escapadas ligeras.' },
  { key: 'Clutch', title: 'Clutch Aurora', copy: 'Color sutil, toque elegante.' }
];

function altRows(items){
  return items.slice(0,6).map((it,i)=>{
    const p   = store.products.find(x=>x.categoria===it.key) || store.products[i % store.products.length];
    const img = p?.fotos?.[0] || './assets/img/placeholder.svg';
    const leftImg = i % 2 === 0;

    const ImageBlock = `
      <div class="overflow-hidden w-full h-full" style="border-radius: 10px;">
        <img
          src="${img}"
          alt="${it.title}"
          class="block w-full h-full object-cover md:aspect-4-3"
          loading="lazy"
          sizes="(min-width:1024px) 45vw, 100vw">
      </div>`;

    const TextBlock = `
      <div class="w-full h-full flex items-center justify-center text-center md:aspect-4-3">
        <div class="px-4">
          <h3 class="font-serif text-2xl mb-2">${it.title}</h3>
          <p class="opacity-80 mb-4">${it.copy}</p>
          <a href="#/catalogo"
             class="inline-block px-4 py-2 rounded-full bg-primary text-white"
             data-cat="${it.key}">Ver ${it.key}</a>
        </div>
      </div>`;

    return `
      <div class="grid md:grid-cols-2 gap-0 items-stretch" style="margin-top: 0px;">
        ${leftImg
          ? `${ImageBlock}${TextBlock}`
          : `<div class="order-2 md:order-1">${TextBlock}</div>
             <div class="order-1 md:order-2">${ImageBlock}</div>`}
      </div>`;
  }).join('');
}


export function renderHome(){
  const heroImg = (store.products[0]?.fotos?.[0]) || './assets/img/placeholder.svg';

  mount(`
    <!-- HERO pantalla completa fijo -->
    <section class="hero-full pin-on-scroll">
      <img class="hero-img" src="${heroImg}" alt="Cro and Txet hero">
      <div class="overlay"></div>
      <div class="hero-content grid place-items-center min-h-[100svh] px-4 text-center">
        <div class="max-w-3xl">
          <h1 class="font-serif text-5xl md:text-6xl mb-3 text-white">Crochet refinado en tonos pastel</h1>
          <p class="mx-auto max-w-2xl mb-6 text-white/90">Bolsos hechos a mano con “animal painting”. Elegancia serena, acabados cuidados.</p>
          <a href="#/catalogo" class="inline-block rounded-full bg-primary text-white px-6 py-3 shadow-soft">Ver catálogo</a>
        </div>
      </div>
    </section>

    <!-- Introducción -->
    <section class="max-w-3xl mx-auto px-4 py-10 text-center">
      <p class="text-lg opacity-80">Fondo blanco, acentos salmón pastel y tipografía elegante para la identidad de Cro and Txet.</p>
    </section>

    <!-- 2×3 alterno -->
    <section class="max-w-6xl mx-auto px-4 pb-12 space-y-10">
      ${altRows(CATS.slice(0,6))}
    </section>

    <!-- Galería -->
    <section class="max-w-6xl mx-auto px-4 pb-14">
      <h2 class="font-serif text-3xl mb-4">Galería</h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${store.products.slice(0,8).map(p=>`
          <a href="#/producto/${p.slug}" class="block card overflow-hidden hover:shadow-lg">
            <img class="w-full h-full object-cover aspect-4-3" src="${p.fotos[0]}" alt="${p.nombre}">
            <div class="p-3">
              <h3 class="font-semibold">${p.nombre}</h3>
              <p class="text-sm opacity-70">€${p.precioDesde}</p>
            </div>
          </a>`).join('')}
      </div>
    </section>

    <!-- Instagram -->
    <section class="max-w-6xl mx-auto px-4 pb-16 text-center">
      <div class="card p-8">
        <h3 class="font-serif text-2xl mb-2">Síguenos en Instagram</h3>
        <p class="opacity-80 mb-4">@cro_and_txet</p>
        <a class="inline-block rounded-full bg-ink text-white px-5 py-2"
           href="https://instagram.com/cro_and_txet" target="_blank" rel="noopener">Abrir Instagram</a>
      </div>
    </section>
  `);

  document.querySelectorAll('[data-cat]').forEach(btn=>{
    btn.addEventListener('click', ()=> sessionStorage.setItem('prefCat', btn.getAttribute('data-cat')));
  });
}


export function renderCatalog(){
  mount(`
    <section class="max-w-6xl mx-auto px-4 pt-8 pb-16">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 class="font-serif text-3xl">Catálogo</h1>
        <div class="flex flex-wrap items-center gap-2">
          <select id="f-cat" class="chip">
            <option value="all">Todas</option>
            <option>Barrel</option><option>Clutch</option><option>Frame</option><option>Flap</option>
          </select>
          <input id="f-q" class="chip" placeholder="Buscar..." />
          <input id="f-min" type="number" min="50" max="150" value="${store.filters.min}" class="chip w-24"/>
          <input id="f-max" type="number" min="50" max="150" value="${store.filters.max}" class="chip w-24"/>
          <button id="f-apply" class="chip bg-primary text-white">Aplicar</button>
        </div>
      </div>
      <div id="grid" class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"></div>
      <div class="text-center mt-8">
        <button id="load-more" class="px-4 py-2 rounded-full border">Load more</button>
      </div>
    </section>
  `);

  const grid = document.getElementById('grid');
  let page = 1;
  const pageSize = 8;

  const draw = () => {
    const list = applyFilters(structuredClone(store.products));
    const slice = list.slice(0, page*pageSize);
    grid.innerHTML = slice.map(card).join('');
    if (slice.length >= list.length) byId('load-more').classList.add('hidden');
    attachCardEvents();
  };

  const pref = sessionStorage.getItem('prefCat');
  if (pref){ store.filters.category = pref; sessionStorage.removeItem('prefCat'); }
  byId('f-cat').value = store.filters.category;

  byId('f-apply').onclick = () => {
    store.filters = {
      category: byId('f-cat').value,
      min: Number(byId('f-min').value || 50),
      max: Number(byId('f-max').value || 150),
      q: (byId('f-q').value || '').toLowerCase()
    };
    page = 1; draw();
  };

  byId('load-more').onclick = () => { page++; draw(); };
  draw();
}

export function renderProduct(hash){
  const slug = hash.split('/').pop();
  const p = store.products.find(x=>x.slug===slug);
  if(!p){ mount(`<section class="max-w-6xl mx-auto px-4 py-16"><p>No encontrado.</p></section>`); return; }

  mount(`
    <section class="max-w-6xl mx-auto px-4 pt-8 pb-16 grid md:grid-cols-2 gap-10">
      <div class="card p-2">
        <div id="gallery" class="rounded-xl2 overflow-hidden">
          ${p.fotos.map((src,i)=>`
            <a href="${src}" class="block aspect-4-3">
              <img src="${src}" alt="${p.nombre} ${i+1}" class="w-full h-full object-cover"
                   sizes="(min-width:1024px) 50vw, 100vw">
            </a>`).join('')}
        </div>
      </div>
      <div>
        <h1 class="font-serif text-3xl mb-2">${p.nombre}</h1>
        <p class="text-lg mb-4"><span class="opacity-70">Desde</span> <strong>€${p.precioDesde}</strong></p>
        <p class="mb-3"><strong>Categoría:</strong> ${p.categoria}</p>
        <p class="mb-3"><strong>Animal painting:</strong> ${p.animal}</p>
        <p class="mb-3"><strong>Materiales:</strong> ${p.materiales.join(', ')}</p>
        <p class="mb-3"><strong>Medidas:</strong> ${p.medidas.ancho}×${p.medidas.alto}×${p.medidas.fondo} cm — <strong>Peso:</strong> ${p.peso} g</p>
        <div class="flex gap-2 mb-6 flex-wrap">
          ${p.colores.map(c=>`<span class="chip">${c}</span>`).join('')}
        </div>
        <div class="flex gap-3 flex-wrap">
          <a href="${waLink(p.nombre)}" class="rounded-full bg-primary text-white px-4 py-2">WhatsApp</a>
          <sl-button variant="default" onclick="document.querySelector('#contact-sheet').show()">Enviar consulta</sl-button>
        </div>

        <h3 class="font-serif text-xl mt-10 mb-3">Relacionados</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          ${store.products.filter(x=>x.categoria===p.categoria && x.id!==p.id).slice(0,4).map(card).join('')}
        </div>
      </div>
    </section>

    <sl-dialog label="Consulta" id="contact-sheet">
      <form class="space-y-3" id="contact-form">
        <sl-input name="name" placeholder="Nombre"></sl-input>
        <sl-input name="email" type="email" placeholder="Email"></sl-input>
        <sl-textarea name="msg" placeholder="Mensaje"></sl-textarea>
        <sl-button type="primary" submit>Enviar</sl-button>
      </form>
    </sl-dialog>
  `);

  lightGallery(document.getElementById('gallery'), { plugins:[lgZoom], speed: 300 });

  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e)=>{ e.preventDefault(); alert('Enviado (demo).'); });
}

export function renderAbout(){
  mount(`
    <section class="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div>
        <h1 class="font-serif mb-4">Sobre Cro and Txet</h1>
        <p class="opacity-80">Creamos bolsos a mano combinando crochet y pintura de animales. Producción por encargo, materiales sostenibles y acabados cuidados.</p>
        <ul class="mt-6 space-y-2">
          <li class="chip">Algodón reciclado</li>
          <li class="chip">Pintura textil</li>
          <li class="chip">Hecho bajo pedido</li>
        </ul>
      </div>
      <div class="card p-2">
        <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
             alt="Taller Cro and Txet" class="w-full h-full object-cover aspect-4-3" sizes="(min-width:1024px) 50vw, 100vw" />
      </div>
    </section>
  `);
}

export function renderContact(){
  mount(`
    <section class="max-w-2xl mx-auto px-4 py-12">
      <h1 class="font-serif mb-6">Contacto</h1>
      <form class="card p-5 space-y-4">
        <sl-input required placeholder="Nombre"></sl-input>
        <sl-input required type="email" placeholder="Email"></sl-input>
        <sl-input placeholder="Teléfono"></sl-input>
        <sl-textarea placeholder="Mensaje"></sl-textarea>
        <div class="flex items-center gap-3 flex-wrap">
          <sl-button variant="primary">Enviar</sl-button>
          <a href="#" id="wa-btn" class="inline-block rounded-full bg-primary text-white px-4 py-2">WhatsApp</a>
        </div>
      </form>
    </section>
  `);
  const wa = document.getElementById('wa-btn');
  wa.href = waLink();
}

export function renderLegal(hash){
  const page = hash.split('/').pop();
  mount(`
    <section class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="font-serif mb-4">${page?.toUpperCase()}</h1>
      <p class="opacity-80">Texto legal de ejemplo para Cro and Txet — ${page}.</p>
    </section>
  `);
}

function card(p){
  return `
  <a href="#/producto/${p.slug}" class="block card overflow-hidden hover:shadow-lg transition">
    <div class="aspect-4-3 overflow-hidden">
      <img class="w-full h-full object-cover"
           src="${p.fotos[0]}" alt="${p.nombre}"
           sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 45vw, 90vw">
    </div>
    <div class="p-3">
      <h3 class="font-semibold">${p.nombre}</h3>
      <p class="text-sm opacity-70">€${p.precioDesde}</p>
      <div class="mt-2 flex gap-2 flex-wrap">
        ${p.colores.slice(0,3).map(c=>`<span class="chip">${c}</span>`).join('')}
      </div>
    </div>
  </a>`;
}
function attachCardEvents(){ /* placeholder */ }
