export default function formatDate(time: number) {
  const date = new Date(time);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
