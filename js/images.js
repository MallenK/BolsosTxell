const FALLBACKS = [
  // Picsum endpoints muy estables
  'https://picsum.photos/id/1069/1600/1200',
  'https://picsum.photos/id/1011/1600/1200',
  'https://picsum.photos/id/1005/1600/1200'
];
const LOCAL_PLACEHOLDER = './assets/img/placeholder.svg';

function checkImage(url, timeout = 7000){
  return new Promise(resolve => {
    const img = new Image();
    let done = false;
    const timer = setTimeout(()=>{ if(!done){ done = true; resolve(false);} }, timeout);
    img.onload = ()=>{ if(!done){ done = true; clearTimeout(timer); resolve(true);} };
    img.onerror = ()=>{ if(!done){ done = true; clearTimeout(timer); resolve(false);} };
    img.src = url;
  });
}

export async function firstWorking(srcCandidates){
  for (const url of srcCandidates){
    if (await checkImage(url)) return url;
  }
  // último recurso local
  return LOCAL_PLACEHOLDER;
}

/**
 * Recorre productos y valida cada foto. Sustituye in-place por la primera válida.
 * products: Array<{fotos: string[]}>
 */
export async function sanitizeProductImages(products){
  for (const p of products){
    if (!Array.isArray(p.fotos)) { p.fotos = [LOCAL_PLACEHOLDER]; continue; }
    const repaired = [];
    for (const original of p.fotos){
      const candidates = [original, ...FALLBACKS, LOCAL_PLACEHOLDER];
      const ok = await firstWorking(candidates);
      repaired.push(ok);
    }
    p.fotos = repaired;
  }
  return products;
}
