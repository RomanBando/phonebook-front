export default function getFilter(style, amount) {
  if (style === 'blur') {
    return `${style}(${amount}px)`;
  } 

  if (['grayscale', 'saturate'].includes(style)) {
    return `${style}(${amount}%)`;
  }
}