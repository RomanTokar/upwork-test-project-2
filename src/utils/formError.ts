export function formError(error: string, fieldName: string, index: number) {
  return `${error} in '${fieldName}' field in row with ${index} index`;
}
