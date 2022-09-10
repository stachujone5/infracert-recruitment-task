export const isApiError = <T>(error: unknown): error is T => {
  if (typeof error === 'object' && error) {
    return 'error' in error
  }
  return false
}
