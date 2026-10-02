export const statisticsQuery = `mutation LogStats($data: Json!) {
  logStats(data: $data) { id }
}`

export function createVisitorId() {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}

export function storedId(storage: Storage, key: string) {
  const existing = storage.getItem(key)
  if (existing) {
    return existing
  }
  const id = createVisitorId()
  storage.setItem(key, id)
  return id
}
