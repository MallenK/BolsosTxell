import { store } from './store.js';
import { applyFilters } from './filters.js';
import { waLink } from './whatsapp.js';
import { t } from './i18n.js';

function byId(id){ return document.getElementById(id); }
function mount(html){ byId('app').innerHTML = html; window.scrollTo(0,0); }

// CATS ahora se localiza desde copy.* (títulos y textos)
const CATS = [
  { k: 'Barrel' },
  { k: 'Clutch' },
  { k: 'Frame' },
  { k: 'Flap' },
  { k: 'BarrelWeekender' },
  { k: 'ClutchAurora' }
];

function altRows(items){
  return items.slice(0,6).map((it,i)=>{
    const p   = store.products.find(x=>x.categoria=== (it.k.includes('Barrel')?'Barrel':it.k.includes('Clutch')?'Clutch':it.k.includes('Frame')?'Frame':'Flap'))
             || store.products[i % store.products.length];
    const img = p?.fotos?.[0] || './assets/img/placeholder.svg';
    const title = t(`cats.${it.k}.title`, it.k);
    const copy  = t(`cats.${it.k}.copy`, '');
    const leftImg = i % 2 === 0;

    const ImageBlock = `
      <div class="overflow-hidden w-full h-full">
        <img src="${img}" alt="${title}" class="block w-full h-full object-cover md:aspect-4-3" loading="lazy"
             sizes="(min-width:1024px) 45vw, 100vw">
      </div>`;

    // NOTA: textos en negro (sin text-white)
    const TextBlock = `
      <div class="w-full h-full flex items-center justify-center text-center md:aspect-4-3">
        <div class="px-4">
          <h3 class="font-serif text-2xl mb-2">${title}</h3>
          <p class="mb-4">${copy}</p>
          <a href="#/catalogo" class="inline-block px-4 py-2 rounded-full bg-primary text-white" data-cat="${it.k}">
            ${t('cta.viewCategory','Ver {{cat}}').replace('{{cat}}', title)}
          </a>
        </div>
      </div>`;

    return `
      <div class="grid md:grid-cols-2 gap-0 items-stretch">
        ${leftImg ? `${ImageBlock}${TextBlock}`
                  : `<div class="order-2 md:order-1">${TextBlock}</div><div class="order-1 md:order-2">${ImageBlock}</div>`}
      </div>`;
  }).join('');
}

export function renderHome(){
  const heroImg = (store.products[0]?.fotos?.[0]) || './assets/img/placeholder.svg';
  mount(`
    <!-- HERO a pantalla completa: SOLO aquí el texto va en blanco -->
    <section class="hero-full pin-on-scroll">
      <img class="hero-img" src="${heroImg}" alt="Cro and Txet hero">
      <div class="overlay"></div>
      <div class="hero-content grid place-items-center min-h-[100svh] px-4 text-center">
        <div class="max-w-3xl">
          <h1 class="text-white">VERSIÓ 3</h1>
          <h2 class="font-serif text-5xl md:text-6xl mb-3 text-white">${t('hero.title')}</h2>
          <p class="mx-auto max-w-2xl mb-6 text-white">${t('hero.subtitle')}</p>
          <a href="#/catalogo" class="inline-block rounded-full bg-primary text-white px-6 py-3 shadow-soft">
            ${t('cta.catalog')}
          </a>
        </div>
      </div>
    </section>

    <!-- Presentació del projecte -->
    <section class="intro max-w-3xl mx-auto px-4 pt-20 pb-24 text-center w-75-desktop">
      <h2 class="intro-title text-4xl md:text-5xl mb-4 font-script">
        ${t('intro.title')}
      </h2>
    
      <p class="lead mx-auto max-w-2xl">
        ${t('intro.lead')}
      </p>
    
      <div class="grid md:grid-cols-3 gap-6 mt-10 text-left">
        <div class="card p-5">
          <h3 class="font-script text-2xl mb-2">${t('intro.points.handmade.title')}</h3>
          <p>${t('intro.points.handmade.copy')}</p>
        </div>
        <div class="card p-5">
          <h3 class="font-script text-2xl mb-2">${t('intro.points.custom.title')}</h3>
          <p>${t('intro.points.custom.copy')}</p>
        </div>
        <div class="card p-5">
          <h3 class="font-script text-2xl mb-2">${t('intro.points.materials.title')}</h3>
          <p>${t('intro.points.materials.copy')}</p>
        </div>
      </div>
    
      <p class="mt-10 mx-auto max-w-2xl">
        ${t('intro.closing')}
      </p>
    </section>



    <!-- Categorías con más separación inferior -->
    <section class="section-cats pb-28 space-y-16">
      ${altRows(CATS)}
    </section>


    <!-- Instagram -->
    <section class="max-w-6xl mx-auto pb-28 text-center">
      <div class="card card-instagram p-10">
        <h3 class="font-serif text-2xl mb-2">${t('instagram.title','Síguenos en Instagram')}</h3>
        <p class="mb-4">${t('instagram.handle','@cro_and_txet')}</p>
        <p class="mb-6 text-base">
          ${t('instagram.desc','Síguenos para descubrir nuevas piezas, ver procesos de creación y contactar de forma más directa. Instagram es la manera más fácil de comunicarte con nosotros y mantenerte al tanto de las novedades.')}
        </p>
        <a class="inline-block rounded-full bg-primary text-white px-5 py-2"
           href="${t('instagram.url','https://instagram.com/cro_and_txet')}" target="_blank" rel="noopener">
           ${t('instagram.open','Abrir Instagram')}
        </a>
      </div>
    </section>



    <!-- Galería -->
    <section class="section-gallery pb-28">
      <h2 class="sr-only">${t('gallery.title','Galería')}</h2>
      <div class="gallery-grid grid grid-cols-1 md:grid-cols-3 gap-8">
        ${store.products.slice(0,6).map(p=>`
          <a href="#/producto/${p.slug}" class="gallery-card block card overflow-hidden transition"
             aria-label="${p.nombre} — €${p.precioDesde}">
            <div class="gcard">
              <div class="gcard-media">
                <img class="w-full h-full object-cover"
                     src="${p.fotos[0]}" alt="${p.nombre}"
                     loading="lazy" decoding="async"
                     sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:768px) 30vw, 90vw">
              </div>
              <div class="gcard-cap">
                <h3 class="font-semibold">${p.nombre}</h3>
                <p class="text-sm">€${p.precioDesde}</p>
              </div>
            </div>
          </a>
        `).join('')}

      </div>
    </section>

  `);

  document.querySelectorAll('[data-cat]').forEach(btn=>{
    btn.addEventListener('click', ()=> sessionStorage.setItem('prefCat', btn.getAttribute('data-cat')));
  });
}



export function renderCatalog(){
  mount(`
    <section class="section-catalog pt-8 pb-16">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
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

      <div id="grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"></div>
    </section>
  `);

  const grid = document.getElementById('grid');
  const pageSize = 9; // 3x3 visibles
  let page = 1;

  const draw = () => {
    const list = applyFilters(structuredClone(store.products));
    const slice = list.slice(0, page * pageSize);
    grid.innerHTML = slice.map(card).join('');
    attachCardEvents();
  };

  const pref = sessionStorage.getItem('prefCat');
  if (pref){
    store.filters.category = pref;
    sessionStorage.removeItem('prefCat');
  }
  byId('f-cat').value = store.filters.category;

  byId('f-apply').onclick = () => {
    store.filters = {
      category: byId('f-cat').value,
      min: Number(byId('f-min').value || 50),
      max: Number(byId('f-max').value || 150),
      q: (byId('f-q').value || '').toLowerCase()
    };
    page = 1;
    draw();
  };

  draw();
}


export function renderProduct(hash){
const slug = hash.split('/').pop();
const p = store.products.find(x=>x.slug===slug);
if(!p){ mount(`<section class="max-w-6xl mx-auto px-4 py-16">
  <p>No encontrado.</p>
</section>`); return; }

mount(`
<section class="max-w-6xl mx-auto px-4 pt-8 pb-16 grid md:grid-cols-2 gap-10">
  <div class="card p-2">
    <div id="gallery" class="rounded-xl2 overflow-hidden">
      ${p.fotos.map((src,i)=>`
      <a href="${src}" class="block aspect-4-3">
        <img src="${src}" alt="${p.nombre} ${i+1}" class="w-full h-full object-cover" sizes="(min-width:1024px) 50vw, 100vw">
      </a>`).join('')}
    </div>
  </div>
  <div>
    <h1 class="font-serif text-3xl mb-2">${p.nombre}</h1>
    <p class="text-lg mb-4"><span>Desde</span> <strong>€${p.precioDesde}</strong></p>
    <p class="mb-3"><strong>Categoría:</strong> ${p.categoria}</p>
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
    <sl-textarea name="msg" placeholder="Mensaje"></sltextarea>
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
        <p>Creamos bolsos a mano combinando crochet y pintura de animales. Producción por encargo, materiales sostenibles y acabados cuidados.</p>
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
    <section class="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 class="font-serif mb-4">${t('contact.title','Contacto')}</h1>
      <p class="mb-6">${t('contact.intro','Escríbenos y cuéntanos qué bolso te interesa.')}</p>
      <div class="mb-6">
        <a class="inline-block rounded-full bg-primary text-white px-5 py-2"
           href="${t('instagram.url','https://instagram.com/cro_and_txet')}" target="_blank" rel="noopener">
           ${t('instagram.handle','@cro_and_txet')}
        </a>
      </div>
      <form class="card p-5 space-y-4 text-left">
        <sl-input required placeholder="${t('contact.form.name','Nombre')}"></sl-input>
        <sl-input required type="email" placeholder="${t('contact.form.email','Email')}"></sl-input>
        <sl-input placeholder="${t('contact.form.phone','Teléfono')}"></sl-input>
        <sl-textarea placeholder="${t('contact.form.msg','Mensaje')}"></sl-textarea>
        <div class="flex items-center gap-3 flex-wrap justify-center">
          <sl-button variant="primary">${t('contact.form.send','Enviar')}</sl-button>
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
      <p>Texto legal de ejemplo para Cro and Txet — ${page}.</p>
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
      <p class="text-sm">€${p.precioDesde}</p>
      <div class="mt-2 flex gap-2 flex-wrap">
        ${p.colores.slice(0,3).map(c=>`<span class="chip">${c}</span>`).join('')}
      </div>
    </div>
  </a>`;
}
function attachCardEvents(){ /* placeholder */ }
