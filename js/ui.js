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
    const p = store.products.find(x =>
      x.categoria === (
        it.k.includes('Barrel') ? 'Barrel' :
        it.k.includes('Clutch') ? 'Clutch' :
        it.k.includes('Frame')  ? 'Frame'  : 'Flap'
      )
    ) || store.products[i % store.products.length];

    const img   = p?.fotos?.[0] || './assets/img/placeholder.svg';
    const title = t(`cats.${it.k}.title`, it.k);
    const copy  = t(`cats.${it.k}.copy`, '');
    const leftImg = i % 2 === 0;

    const ImageBlock = `
      <div class="glare-img-wrapper overflow-hidden w-full h-full relative">
        <span class="glare-layer" aria-hidden="true"></span>
        <img src="${img}" alt="${title}" 
             class="block w-full h-full object-cover md:aspect-4-3 glare-target"
             loading="lazy"
             sizes="(min-width:1024px) 45vw, 100vw">
      </div>`;

    const TextBlock = `
      <div class="w-full h-full flex items-center justify-center text-center md:aspect-4-3">
        <div class="px-4">
          <h3 class="font-serif text-2xl mb-2">${title}</h3>
          <p class="mb-4">${copy}</p>
          <a href="#/catalogo" class="inline-block px-4 py-2 rounded-full bg-success" data-cat="${it.k}">
            ${t('cta.viewCategory','Ver {{cat}}').replace('{{cat}}', title)}
          </a>
        </div>
      </div>`;

    return `
      <div class="grid md:grid-cols-2 gap-0 items-stretch">
        ${leftImg
          ? `${ImageBlock}${TextBlock}`
          : `<div class="order-2 md:order-1">${TextBlock}</div><div class="order-1 md:order-2">${ImageBlock}</div>`}
      </div>`;
  }).join('');
}


function initGlareOnImages(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wrappers = document.querySelectorAll('.glare-img-wrapper');
  if (!wrappers.length) return;

  const MAX_TILT = 18;

  wrappers.forEach(wrapper=>{
    const glare = wrapper.querySelector('.glare-layer');
    let raf = null;

    function onMove(e){
      const r = wrapper.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top)  / r.height;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        if (!reduce){
          const rx = (0.5 - y) * (MAX_TILT * 2);
          const ry = (x - 0.5) * (MAX_TILT * 2);
          wrapper.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        }
        if (glare){
          glare.style.setProperty('--gx', (x * 100) + '%');
          glare.style.setProperty('--gy', (y * 100) + '%');
        }
      });
    }

    function onLeave(){
      if (raf) cancelAnimationFrame(raf);
      wrapper.style.transform = '';
    }

    wrapper.addEventListener('mousemove', onMove);
    wrapper.addEventListener('mouseleave', onLeave);
  });
}



export function renderHome(){
  const heroImg = (store.products[0]?.fotos?.[0]) || './assets/img/Cro_Txet.png';
  const CroAndTxetImg = store.heroImage || './assets/img/Cro-and-Txet.png';

  mount(`
    <!-- HERO -->
    <section class="hero-full pin-on-scroll relative">
      <img class="hero-img" src="${heroImg}" alt="Cro and Txet hero">
      <div class="overlay"></div>

      <div class="hero-content grid place-items-center min-h-[100svh] px-4 text-center">
        <div class="max-w-3xl">
        <!-- LOGOTIPO / FOTO ESPECIAL -->
        <div class="max-w-xl mx-auto mb-20">
          <img class="cro-and-txet-img w-full" src="${CroAndTxetImg}" alt="Cro and Txet marca"  style="filter: invert(1);">
        </div>

          <p class="mx-auto max-w-2xl mb-6 text-white text-lg opacity-95">
            ${t('hero.subtitle')}
          </p>

          <a href="#/catalogo"
             class="inline-block rounded-full bg-primary text-white px-6 py-3 shadow-soft">
            ${t('cta.catalog')}
          </a>
        </div>
      </div>
    </section>


    <!-- PRESENTACIÓN -->
    <section class="intro max-w-4xl mx-auto pt-20 pb-24 text-center w-75-desktop space-y-12">

      <div class="card-neo-soft p-10 space-y-4">
        <h2 class="intro-title text-4xl md:text-5xl font-script">
          ${t('intro.title')}
        </h2>

        <p class="lead mx-auto max-w-2xl">
          ${t('intro.lead')}
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="card-neo-soft p-6 text-center">
          <h3 class="font-script text-2xl mb-2">${t('intro.points.handmade.title')}</h3>
          <p>${t('intro.points.handmade.copy')}</p>
        </div>

        <div class="card-neo-soft p-6 text-center">
          <h3 class="font-script text-2xl mb-2">${t('intro.points.custom.title')}</h3>
          <p>${t('intro.points.custom.copy')}</p>
        </div>

        <div class="card-neo-soft p-6 text-center">
          <h3 class="font-script text-2xl mb-2">${t('intro.points.materials.title')}</h3>
          <p>${t('intro.points.materials.copy')}</p>
        </div>
      </div>

      <p class="mt-8 mx-auto max-w-2xl opacity-90">
        ${t('intro.closing')}
      </p>

    </section>


    <!-- CATEGORÍAS -->
    <section class="section-cats pb-28 space-y-16">
      ${altRows(CATS)}
    </section>


    <!-- INSTAGRAM -->
    <section class="max-w-6xl mx-auto pb-28 text-center">
      <div class="card-neo-soft p-10">
        <h3 class="font-serif text-2xl mb-2">
          ${t('instagram.title','Síguenos en Instagram')}
        </h3>

        <p class="mb-4 font-medium opacity-70">
          ${t('instagram.handle','@cro_and_txet')}
        </p>

        <p class="mb-6 text-base opacity-80">
          ${t('instagram.desc','Síguenos para descubrir nuevas piezas, ver procesos de creación y contactar de forma más directa.')}
        </p>

        <a class="inline-block rounded-full bg-primary text-white px-5 py-2"
           href="${t('instagram.url','https://instagram.com/cro_and_txet')}"
           target="_blank" rel="noopener">
           ${t('instagram.open','Abrir Instagram')}
        </a>
      </div>
    </section>


    <!-- GALERÍA -->
    <section class="section-gallery pb-28">
      <div class="gallery-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        ${store.products.slice(0,6).map(p=>`
          <a href="#/producto/${p.slug}"
             class="gallery-card block overflow-hidden transition"
             aria-label="${p.nombre} — €${p.precioDesde}">
            <div class="gcard">
              <div class="gcard-media">
                <img class="w-full h-full object-cover"
                    src="${p.fotos[0]}" alt="${p.nombre}"
                    loading="lazy" decoding="async">
              </div>
              <div class="gcard-cap">
                <h3 class="font-semibold text-base md:text-lg">${p.nombre}</h3>
                <p class="text-sm">€${p.precioDesde}</p>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    </section>


    <!-- LOGOTIPO / FOTO ESPECIAL -->
    <div class="max-w-xl mx-auto mb-20 cro-and-txet-img-div">
      <img class="cro-and-txet-img w-full opacity-95"
           src="${CroAndTxetImg}"
           alt="Cro and Txet marca">
    </div>

  `);

  // Animación del título
  const h1 = document.getElementById('heroTitle');
  if (h1) {
    const full = h1.dataset.title?.toString() || h1.textContent || '';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      h1.textContent = full;
      h1.classList.remove('type-caret');
    } else {
      h1.textContent = '';

      if (window.__heroAnime) window.__heroAnime.pause();

      window.__heroAnime = anime({
        targets: { i: 0 },
        i: full.length,
        duration: 2400,
        delay: 300,
        easing: 'linear',
        round: 1,
        update: (a) => {
          const n = a.animations[0].currentValue;
          h1.textContent = full.slice(0, n);
        },
        complete: () => h1.classList.remove('type-caret')
      });
    }
  }

  // Categorías → guardar última categoría clicada
  document.querySelectorAll('[data-cat]').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      sessionStorage.setItem('prefCat', btn.getAttribute('data-cat'));
    });
  });
}



export function renderCatalog(){
  mount(`
    <section class="section-catalog pt-8 pb-16 space-y-10 max-w-6xl mx-auto px-4">

      <!-- CABECERA EN CARTA -->
      <div class="card-neo-soft mb-10">
        <h1 class="font-serif text-3xl mb-2">Catálogo</h1>
        <p class="text-neutral-700">
          Explora nuestros bolsos hechos a mano y filtra por estilo, color o precio.
        </p>
      </div>

      <!-- FILTROS -->
      <div class="card-neo-soft flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div class="flex flex-wrap items-center gap-3">

          <select id="f-cat" class="chip">
            <option value="all">Todas</option>
            <option>Barrel</option>
            <option>Clutch</option>
            <option>Frame</option>
            <option>Flap</option>
          </select>

          <input id="f-q" class="chip" placeholder="Buscar..." />

          <input id="f-min" type="number" min="50" max="150"
            value="${store.filters.min}" class="chip w-24" />

          <input id="f-max" type="number" min="50" max="150"
            value="${store.filters.max}" class="chip w-24" />

          <button id="f-apply" class="chip bg-primary text-white">Aplicar</button>

        </div>

      </div>

      <!-- GRID -->
      <div id="grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"></div>

    </section>
  `);

  const grid = document.getElementById('grid');
  const pageSize = 9;
  let page = 1;

  const draw = () => {
    const list = applyFilters(structuredClone(store.products));
    const slice = list.slice(0, page * pageSize);

    grid.innerHTML = slice.map(p => `
      <a href="#/producto/${p.slug}" class="block overflow-hidden hover:shadow-lg transition">
        <div class="aspect-4-3 overflow-hidden">
          <img class="w-full h-full object-cover" src="${p.fotos[0]}" alt="${p.nombre}">
        </div>
        <div class="catalog-product-info">
          <h3 class="font-serif text-lg">${p.nombre}</h3>
          <p>${p.precioDesde}€</p>
        </div>
      </a>
    `).join('');

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
  const p = store.products.find(x => x.slug === slug);

  if(!p){
    mount(`<section class="max-w-6xl mx-auto px-4 py-16"><p>No encontrado.</p></section>`);
    return;
  }

  const PLACEHOLDER = './assets/img/placeholder.svg';
  const principal = p.imagenPrincipal || (p.fotos?.[0]) || PLACEHOLDER;
  const accesorias = p.imagenesAccesorias?.length ? p.imagenesAccesorias : p.fotos?.slice(1) || [];
  const variantes = p.variantesColor || [];

  function parseBase(src){
    const m = src.match(/^(.*\/)?(.+)-([^-\/.]+)(\.[a-z0-9]+)$/i);
    if(!m) return null;
    return { dir: m[1] || '', base: m[2], ext: m[4] };
  }

  const parsed = parseBase(principal);
  const makeSrc = (color) => parsed ? `${parsed.dir}${parsed.base}-${color}${parsed.ext}` : principal;

  const videoHtml = p.video ? `
    <a class="block aspect-4-3"
       data-lg-size="1280-720"
       data-video='{"source":[{"src":"${p.video}","type":"video/mp4"}],"attributes":{"preload":"metadata","controls":true}}'
       href="${p.video}">
      <video class="w-full h-full object-cover" preload="metadata">
        <source src="${p.video}" type="video/mp4">
      </video>
    </a>` : '';

  mount(`
    <section class="max-w-6xl mx-auto px-4 pt-8 pb-16 grid md:grid-cols-2 gap-10">

      <!-- GALERÍA -->
      <div class="space-y-6">

        <div class="card-neo-soft p-2">
          <div id="gallery" class="rounded-xl overflow-hidden">
            <a id="main-link" href="${principal}" class="block aspect-4-3">
              <img id="main-img" src="${principal}" alt="${p.nombre}"
                class="w-full h-full object-cover">
            </a>
            ${videoHtml}
          </div>
          ${variantes.length ? `
            <div class="p-4 flex gap-2 flex-wrap" id="color-picker">
              ${variantes.map(c => `
                <a href="${makeSrc(c)}" class="chip color-btn">${c}</a>
              `).join('')}
            </div>
          ` : ''}
        </div>

        ${accesorias.length ? `
          <div class="card-neo-soft p-4">
            <h3 class="font-serif text-xl mb-3">Más imágenes</h3>
            <div id="acc-gallery" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
              ${accesorias.map((src,i)=>`
                <a href="${src}" class="block aspect-4-3 rounded-xl overflow-hidden">
                  <img src="${src}" alt="${p.nombre} ${i+2}" class="w-full h-full object-cover">
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>


      <!-- INFO DEL PRODUCTO -->
      <div class="space-y-6">

        <div class="card-neo-soft p-6 space-y-3">
          <h1 class="font-serif text-3xl">${p.nombre}</h1>
          <p class="text-lg"><span>Desde</span> <strong>€${p.precioDesde}</strong></p>
          <p><strong>Categoría:</strong> ${p.categoria}</p>

          <!--<div class="flex gap-2 flex-wrap">
            ${p.colores.map(c=>`<span class="chip">${c}</span>`).join('')}
          </div>-->

          <div class="flex gap-3 flex-wrap pt-3">
            <a href="${waLink(p.nombre)}" class="rounded-full bg-primary text-white px-4 py-2">
              WhatsApp
            </a>
            <sl-button variant="default" onclick="document.querySelector('#contact-sheet').show()">
              Enviar consulta
            </sl-button>
          </div>
        </div>

        <!--
        <div class="card-neo-soft p-6">
          <h3 class="font-serif text-xl mb-3">Relacionados</h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            ${store.products
              .filter(x=>x.categoria===p.categoria && x.id!==p.id)
              .slice(0,4)
              .map(card)
              .join('')}
          </div>
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

  const plugins = p.video ? [lgZoom, lgVideo] : [lgZoom];

  const g1 = document.getElementById('gallery');
  if (g1) lightGallery(g1, { plugins, speed: 300 });

  const g2 = document.getElementById('acc-gallery');
  if (g2) lightGallery(g2, { plugins: [lgZoom], speed: 300 });

  const $mainImg = document.getElementById('main-img');
  const $mainLink = document.getElementById('main-link');

  document.getElementById('color-picker')?.addEventListener('click', (e)=>{
    const a = e.target.closest('.color-btn');
    if(!a) return;
    e.preventDefault();
    const next = a.getAttribute('href');
    if ($mainImg) $mainImg.src = next;
    if ($mainLink) $mainLink.href = next;
  });

  const form = document.getElementById('contact-form');
  form?.addEventListener('submit', (e)=>{ e.preventDefault(); alert('Enviado (demo).'); });
}




export function renderAbout(){
  const CroAndtxetImg = store.heroImage;
  mount(`
    <section id="aboutMeSection" class="max-w-5xl mx-auto px-4 py-16 space-y-24">

    <!-- HERO ABOUT -->
    <header class="text-center space-y-4 card-neo-soft p-10">
      <h1 class="about-me-title font-serif text-4xl tracking-tight">Sobre Cro and Txet</h1>
      <p class="text-neutral-700 max-w-2xl mx-auto">
        Bolsos tejidos a mano, pintados con dedicación y creados uno a uno.  
        Cada pieza nace desde la calma, con materiales de calidad y un proceso que respira artesanía.
      </p>
    </header>


    <!-- BLOQUE PRINCIPAL: IMÁGENES + HISTORIA -->
    <div class="card-neo-soft p-10 grid lg:grid-cols-2 gap-12 items-start">

      <!-- IMÁGENES LATERALES -->
      <div class="space-y-6">
        <figure class="rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop"
            alt="Manos tejiendo a crochet"
            class="w-full h-full object-cover aspect-4-3"
            loading="lazy"
          />
        </figure>
      </div>

      <!-- HISTORIA PERSONAL -->
      <article class="space-y-6 text-center lg:text-left">
        <h2 class="font-serif text-3xl">Nuestra historia</h2>

        <p class="text-neutral-800 leading-relaxed">
          Cro and Txet nació durante un proceso de recuperación tras una lesión.  
          El reposo trajo calma, pero también la necesidad de crear. Así surgieron
          los primeros puntos de crochet, hechos sin prisa y con ilusión.
        </p>

        <p class="text-neutral-800 leading-relaxed">
          Aquellos primeros ensayos se transformaron en bolsos que combinan tejido  
          y pintura. Cada pieza se realiza a mano, bajo pedido, respetando el ritmo  
          de cada creación.
        </p>

        <p class="text-neutral-800 leading-relaxed">
          Hoy seguimos con la misma filosofía: convertir momentos de calma en piezas  
          con alma, hechas para acompañar a quien las lleva.
        </p>
      </article>

    </div>


    <!-- MATERIALES -->
    <section class="card-neo-soft p-10 space-y-4 text-center">
      <h2 class="font-serif text-3xl">Materiales seleccionados</h2>
      <p class="text-neutral-700 max-w-3xl mx-auto leading-relaxed">
        Utilizamos algodón de alta calidad, hilos resistentes y pinturas textiles duraderas.  
        Cada material se elige para asegurar suavidad, forma y color a lo largo del tiempo.
      </p>
      <p class="text-neutral-700 max-w-3xl mx-auto leading-relaxed">
        Las asas pueden personalizarse con cuero vegano, algodón trenzado o tiras especiales  
        según el estilo de cada diseño.
      </p>
    </section>


    <!-- PROCESO ARTESANAL -->
    <section class="grid md:grid-cols-3 gap-8">
      <div class="card-neo-soft p-8 text-center space-y-3">
        <h3 class="font-serif text-xl">1. Diseño</h3>
        <p class="text-neutral-700 text-sm leading-relaxed">
          Bocetos personalizados creados a partir de tus ideas, referencias o colores favoritos.
        </p>
      </div>

      <div class="card-neo-soft p-8 text-center space-y-3">
        <h3 class="font-serif text-xl">2. Tejido</h3>
        <p class="text-neutral-700 text-sm leading-relaxed">
          Cada bolsa se teje a mano con técnica de crochet uniforme y precisa.
        </p>
      </div>

      <div class="card-neo-soft p-8 text-center space-y-3">
        <h3 class="font-serif text-xl">3. Pintura</h3>
        <p class="text-neutral-700 text-sm leading-relaxed">
          Animales, detalles y motivos pintados a mano sobre el tejido.
        </p>
      </div>
    </section>


    <!-- FILOSOFÍA -->
    <section class="card-neo-soft p-10 space-y-4 text-center">
      <h2 class="font-serif text-3xl">Filosofía artesanal</h2>
      <p class="text-neutral-700 max-w-3xl mx-auto leading-relaxed">
        Creemos en un ritmo que respete cada proceso, lejos de la producción en masa.  
        Cada bolso es irrepetible: no existe otro igual.
      </p>
      <p class="text-neutral-700 max-w-3xl mx-auto leading-relaxed">
        Nuestro objetivo es crear piezas que duren, que emocionen y que cuenten una historia.
      </p>
    </section>


    <!-- VALORES -->
    <section class="grid md:grid-cols-3 gap-8">
      <div class="card-neo-soft p-6 text-center space-y-2">
        <h3 class="font-serif text-xl">Hecho a mano</h3>
        <p class="text-neutral-700 text-sm">Cada pieza se crea sin prisas.</p>
      </div>

      <div class="card-neo-soft p-6 text-center space-y-2">
        <h3 class="font-serif text-xl">Sostenible</h3>
        <p class="text-neutral-700 text-sm">Materiales responsables y duraderos.</p>
      </div>

      <div class="card-neo-soft p-6 text-center space-y-2">
        <h3 class="font-serif text-xl">Personalizado</h3>
        <p class="text-neutral-700 text-sm">Diseños únicos para cada persona.</p>
      </div>
    </section>


    <!-- ENCARGOS ESPECIALES -->
    <section class="card-neo-soft p-10 space-y-4 text-center">
      <h2 class="font-serif text-3xl">Encargos especiales</h2>
      <p class="text-neutral-700 max-w-3xl mx-auto leading-relaxed">
        Si tienes una idea concreta —como un dibujo personalizado, un bolso en honor  
        a tu mascota o un regalo especial— podemos crear un diseño exclusivo.
      </p>
      <p class="text-neutral-700 max-w-3xl mx-auto leading-relaxed">
        Escríbenos desde la sección de contacto y prepararemos un diseño a medida.
      </p>
    </section>

    <img class="cro-and-txet-img" src="${CroAndtxetImg}" alt="Cro and Txet hero">


  </section>

  `);
}



export function renderContact(){
    const CroAndtxetImg = store.heroImage;
  mount(`
    <section id="sectionContact" class="max-w-6xl mx-auto px-4 py-16 space-y-24">

    <!-- HERO CONTACTO -->
    <header class="text-center space-y-4">
      <h1 class="font-serif text-4xl tracking-tight">Contacto</h1>
      <p class="text-neutral-700 max-w-2xl mx-auto">
        Cuéntanos tu idea y crearemos un bolso único contigo.  
        Resolvemos dudas, personalizaciones o pedidos a medida.
      </p>
    </header>

    <!-- INFO: TIEMPOS / ENVÍOS / PACK -->
    <section class="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">

      <div class="card-neo-soft text-center p-6 space-y-2">
        <h2 class="font-serif text-2xl">Tiempos</h2>
        <p class="text-neutral-700 text-sm">
          Hecho a mano.  
          Entrega media: <strong>7–15 días</strong>.
        </p>
      </div>

      <div class="card-neo-soft text-center p-6 space-y-2">
        <h2 class="font-serif text-2xl">Envíos</h2>
        <p class="text-neutral-700 text-sm">
          Envíos a España 24–72h.  
          Devoluciones solo por defecto.
        </p>
      </div>

      <div class="card-neo-soft text-center p-6 space-y-2">
        <h2 class="font-serif text-2xl">Pack regalo</h2>
        <p class="text-neutral-700 text-sm">
          Envoltorio artesanal + nota personalizada.  
          sin coste.
        </p>
      </div>

    </section>


    <!-- BLOQUE PRINCIPAL -->
    <div class="grid md:grid-cols-2 gap-16 items-start">

      <!-- COLUMNA IZQUIERDA -->
      <div class="space-y-10 card-neo-soft">

        <!-- Atención -->
        <div class="p-6 space-y-2">
          <h3 class="font-serif text-xl">Atención personalizada</h3>
          <p class="text-neutral-700 text-sm">
            Te ayudamos a elegir colores, tamaños y detalles.  
            Diseñamos contigo paso a paso.
          </p>
        </div>

        <!-- Instagram -->
        <div class="p-6 space-y-3">
          <h2 class="font-serif text-2xl">Instagram</h2>
          <p class="text-neutral-700 text-sm">
            Mira encargos reales, colecciones limitadas y cómo cosemos cada pieza.
          </p>
          <a class="inline-block rounded-full bg-primary text-white px-6 py-2"
            href="https://instagram.com/cro_and_txet" target="_blank" rel="noopener">
            @cro_and_txet
          </a>
        </div>

        <!-- Imagen -->
        <figure class="rounded-2xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1530112307634-705b2c4ba9b5?q=80&w=1600&auto=format&fit=crop"
            alt="Taller Cro and Txet"
            class="w-full h-full object-cover aspect-4-3"
            loading="lazy"
          />
        </figure>

      </div>


      <!-- COLUMNA DERECHA – FORMULARIO -->
      <div class="space-y-8 card-neo-soft ">

        <div class="p-6 space-y-3">
          <h2 class="font-serif text-2xl">Encargos y mensajes directos</h2>
          <p class="text-neutral-700 text-sm">
            Escríbenos tu idea, tu diseño o cualquier personalización especial.
          </p>
        </div>

        <form class="p-6 space-y-4">
          <sl-input required placeholder="Nombre completo"></sl-input>
          <sl-input required type="email" placeholder="Email"></sl-input>

          <sl-select placeholder="Tipo de bolso">
            <sl-option>Clutch</sl-option>
            <sl-option>Barrel</sl-option>
            <sl-option>Frame</sl-option>
            <sl-option>Flap</sl-option>
            <sl-option>Mini Bag</sl-option>
            <sl-option>Edición especial</sl-option>
          </sl-select>

          <sl-select placeholder="Color principal">
            <sl-option>Beige</sl-option>
            <sl-option>Arena</sl-option>
            <sl-option>Negro carbón</sl-option>
            <sl-option>Marrón tierra</sl-option>
            <sl-option>Azul pastel</sl-option>
            <sl-option>Personalizado</sl-option>
          </sl-select>

          <sl-input placeholder="Dibujo o motivo (opcional)"></sl-input>
          <sl-textarea placeholder="Cuéntanos qué tipo de bolso quieres"></sl-textarea>

          <div class="flex flex-wrap gap-3 justify-start mt-3">
            <sl-button variant="black">Enviar</sl-button>

            <a id="wa-btn"
              class="inline-block rounded-full bg-black text-white px-5 py-2 hover:bg-green-600 transition-colors"
              href="#"
              target="_blank" rel="noopener">
              WhatsApp
            </a>
          </div>
        </form>

        <div class="p-6 space-y-2">
          <h3 class="font-serif text-xl">Horario</h3>
          <p class="text-sm text-neutral-700 leading-relaxed">
            Lunes a Viernes: 10:00 – 18:00  
            Sábados: 10:00 – 14:00  
            Domingos: Cerrado
          </p>
        </div>

      </div>

    </div>


    <!-- FAQ -->
    <section class="space-y-6 max-w-3xl mx-auto">
      <h2 class="font-serif text-2xl text-center">Preguntas frecuentes</h2>

      <details class="card-neo-soft p-4">
        <summary class="cursor-pointer font-medium">¿Bolso totalmente personalizado?</summary>
        <p class="mt-2 text-sm text-neutral-700">
          Sí. Colores, asas, medidas y dibujos a tu gusto.
        </p>
      </details>

      <details class="card-neo-soft p-4">
        <summary class="cursor-pointer font-medium">¿Puedo ver ejemplos?</summary>
        <p class="mt-2 text-sm text-neutral-700">
          En Instagram mostramos encargos reales. También por WhatsApp.
        </p>
      </details>

      <details class="card-neo-soft p-4">
        <summary class="cursor-pointer font-medium">Materiales usados</summary>
        <p class="mt-2 text-sm text-neutral-700">
          Algodón premium e hilos resistentes.
        </p>
      </details>

      <details class="card-neo-soft p-4">
        <summary class="cursor-pointer font-medium">¿Qué tamaño elegir?</summary>
        <p class="mt-2 text-sm text-neutral-700">
          Te ayudamos según lo que quieras llevar.
        </p>
      </details>
    </section>

    <img class="cro-and-txet-img" src="${CroAndtxetImg}" alt="Cro and Txet hero">

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

function card(p) {
  return `
  <a href="#/producto/${p.slug}" class="block card overflow-hidden hover:shadow-lg transition">
    <div class="aspect-4-3 overflow-hidden">
      <img class="w-full h-full object-cover"
           src="${p.fotos[0]}" alt="${p.nombre}"
           sizes="(min-width:1280px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 45vw, 90vw">
    </div>
    <div class="p-3">
      <div class="flex items-center justify-between">
        <h3 class="card-name font-semibold">${p.nombre}</h3>
        <p class="card-price text-sm">€${p.precioDesde}</p>
      </div>
      <!--
      <div class="mt-2 flex gap-2 flex-wrap">
        ${p.colores.slice(0,3).map(c=>`<span class="chip">${c}</span>`).join('')}
      </div>
      -->
    </div>
  </a>`;
}
function attachCardEvents(){ /* placeholder */ }
