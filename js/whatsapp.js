export function waLink(productName = '', color = '') {
  const num = '34600000000'; // tu número internacional sin +
  const txt = encodeURIComponent(`Hola, quiero info de ${productName}${color ? ' color ' + color : ''}`);
  return `https://wa.me/${num}?text=${txt}`;
}
