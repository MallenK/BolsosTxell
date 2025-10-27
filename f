[35mdata/products.ca.json[m[36m:[m[32m7[m[36m:[m    "[1;31mfotos[m": ["https://images.unsplash.com/photo-1544551763-7ef4200b1c5b?q=80&w=1600&auto=format&fit=crop"]
[35mdata/products.ca.json[m[36m:[m[32m14[m[36m:[m    "[1;31mfotos[m": ["https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1600&auto=format&fit=crop"]
[35mdata/products.es.json[m[36m:[m[32m14[m[36m:[m    "[1;31mfotos[m": [
[35mdata/products.es.json[m[36m:[m[32m31[m[36m:[m    "[1;31mfotos[m": [
[35mdata/products.es.json[m[36m:[m[32m48[m[36m:[m    "[1;31mfotos[m": [
[35mdata/products.es.json[m[36m:[m[32m64[m[36m:[m    "[1;31mfotos[m": [
[35mdata/products.es.json[m[36m:[m[32m80[m[36m:[m    "[1;31mfotos[m": [
[35mdata/products.es.json[m[36m:[m[32m96[m[36m:[m    "[1;31mfotos[m": [
[35mdata/products.es.json[m[36m:[m[32m112[m[36m:[m    "[1;31mfotos[m": [
[35mdata/products.es.json[m[36m:[m[32m128[m[36m:[m    "[1;31mfotos[m": [
[35mjs/images.js[m[36m:[m[32m32[m[36m:[m * products: Array<{[1;31mfotos[m: string[]}>
[35mjs/images.js[m[36m:[m[32m36[m[36m:[m    if (!Array.isArray(p.[1;31mfotos[m)) { p.[1;31mfotos[m = [LOCAL_PLACEHOLDER]; continue; }
[35mjs/images.js[m[36m:[m[32m38[m[36m:[m    for (const original of p.[1;31mfotos[m){
[35mjs/images.js[m[36m:[m[32m43[m[36m:[m    p.[1;31mfotos[m = repaired;
[35mjs/ui.js[m[36m:[m[32m23[m[36m:[m    const img = p?.[1;31mfotos[m?.[0] || './assets/img/placeholder.svg';
[35mjs/ui.js[m[36m:[m[32m55[m[36m:[m  const heroImg = (store.products[0]?.[1;31mfotos[m?.[0]) || './assets/img/placeholder.svg';
[35mjs/ui.js[m[36m:[m[32m138[m[36m:[m                     src="${p.[1;31mfotos[m[0]}" alt="${p.nombre}"
[35mjs/ui.js[m[36m:[m[32m226[m[36m:[m      ${p.[1;31mfotos[m.map((src,i)=>`
[35mjs/ui.js[m[36m:[m[32m331[m[36m:[m           src="${p.[1;31mfotos[m[0]}" alt="${p.nombre}"
