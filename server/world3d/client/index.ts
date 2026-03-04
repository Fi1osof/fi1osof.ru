const WORLD3D_API_URL = process.env.WORLD3D_API_URL || 'http://world3d:4100'

export interface World3dClientOptions {
  baseUrl?: string
}

export class World3dClient {
  private readonly baseUrl: string

  constructor(options?: World3dClientOptions) {
    this.baseUrl = options?.baseUrl || WORLD3D_API_URL
  }

  private async fetch<T = unknown>(
    path: string,
    options: RequestInit,
  ): Promise<{ data: T | null; status: number; ok: boolean }> {
    const url = `${this.baseUrl}${path}`
    const method = options.method ?? 'GET'

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(
        `[world3dClient] ${method} ${url} failed with status ${response.status}`,
      )
    }

    const data = (await response.json()) as T

    return { data, status: response.status, ok: true }
  }

  async get<T = unknown>(
    path: string,
  ): Promise<{ data: T | null; status: number; ok: boolean }> {
    return this.fetch<T>(path, { method: 'GET' })
  }

  async post<T = unknown>(
    path: string,
    body: unknown,
  ): Promise<{ data: T | null; status: number; ok: boolean }> {
    return this.fetch<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  async put<T = unknown>(
    path: string,
    body: unknown,
  ): Promise<{ data: T | null; status: number; ok: boolean }> {
    return this.fetch<T>(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  async delete<T = unknown>(
    path: string,
  ): Promise<{ data: T | null; status: number; ok: boolean }> {
    return this.fetch<T>(path, { method: 'DELETE' })
  }
}

export const world3dClient = new World3dClient()
