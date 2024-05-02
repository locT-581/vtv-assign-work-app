export default function getContrastColor(hexColor: string) {
  const r = parseInt(hexColor.substring(1, 2), 16);
  const g = parseInt(hexColor.substring(3, 2), 16);
  const b = parseInt(hexColor.substring(5, 2), 16);

  const contrastR = (255 - r).toString(16).padStart(2, '0');
  const contrastG = (255 - g).toString(16).padStart(2, '0');
  const contrastB = (255 - b).toString(16).padStart(2, '0');

  return contrastR + contrastG + contrastB;
}
