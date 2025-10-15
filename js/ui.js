import { store } from './store.js';
import { applyFilters } from './filters.js';
import { waLink } from './whatsapp.js';

function byId(id){ return document.getElementById(id); }
function mount(html){ byId('app').innerHTML = html; window.scrollTo(0,0); }

export function renderHome(){
  const values = ['Hecho a mano','Materiales sostenibles','Pedidos a medida'];
  mount(`
    <section class="max-w-6xl mx-auto px-4 pt-8 pb-16">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 class="font-serif mb-4">Bolsos de crochet con <span class="text-primary">animal painting</span></h1>
          <p class="opacity-80 mb-6">Tonos fríos pastel. Catálogo con contacto para encargar.</p>
          <a href="#/catalogo" class="inline-block bg-primary text-white px-5 py-3 rounded-full shadow-soft">Ver catálogo</a>
        </div>
        <div class="card p-2">
          <div class="swiper hero-swiper rounded-xl2 overflow-hidden">
            <div class="swiper-wrapper">
              ${(store.products.slice(0,3)).map(p=>`
                <div class="swiper-slide aspect-4-3">
                  <img src="${p.fotos[0]}" alt="${p.nombre}" class="w-full h-full object-cover"
                       sizes="(min-width:1024px) 50vw, 90vw">
                </div>
              `).join('')}
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
      </div>

      <ul class="mt-8 flex flex-wrap gap-3">
        ${values.map(v=>`<li class="chip">${v}</li>`).join('')}
      </ul>

      <h2 class="font-serif mt-10 mb-4">Novedades</h2>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        ${store.products.slice(0,8).map(card).join('')}
      </div>
    </section>
  `);
  new Swiper('.hero-swiper',{pagination:{el:'.swiper-pagination'},autoplay:{delay:3000},loop:true});
}

export function renderCatalog(){
  mount(`
    <section class="max-w-6xl mx-auto px-4 pt-8 pb-16">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
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
        <h1 class="font-serif mb-4">Sobre el taller</h1>
        <p class="opacity-80">Creamos bolsos a mano combinando crochet y pintura de animales. Producción por encargo, materiales sostenibles y acabados cuidados.</p>
        <ul class="mt-6 space-y-2">
          <li class="chip">Algodón reciclado</li>
          <li class="chip">Pintura textil</li>
          <li class="chip">Hecho bajo pedido</li>
        </ul>
      </div>
      <div class="card p-2">
        <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
             alt="Taller" class="w-full h-full object-cover aspect-4-3" sizes="(min-width:1024px) 50vw, 100vw" />
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
      <p class="opacity-80">Texto legal de ejemplo para ${page}.</p>
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
