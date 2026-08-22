export function validateUserPasswordByAdminRule(value: string): boolean {
  return String(value || '').trim().length >= 6
}
