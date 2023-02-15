export function isValidEmail(str: string) {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(str);
}
