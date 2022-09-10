export const getStorage = <T>(key: string): T | null => {
  const value = localStorage.getItem(key)

  return value ? JSON.parse(value) : null
}

