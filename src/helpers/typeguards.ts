export const isApiError = (error: unknown): error is { readonly error: string } => {
  if (typeof error === 'object' && error) {
    return 'error' in error
  }
  return false
}
