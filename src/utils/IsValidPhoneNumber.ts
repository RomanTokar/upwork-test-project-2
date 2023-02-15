export function isValidPhoneNumber(str: string) {
  return /^\d+$/.test(str);
}
