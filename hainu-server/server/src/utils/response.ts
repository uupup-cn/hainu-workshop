export function success(data: any = null, message: string = 'success') {
  return { code: 0, message, data };
}
export function error(code: number, message: string) {
  return { code, message, data: null };
}
