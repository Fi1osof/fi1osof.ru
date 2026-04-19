export type InferArgs<T> = {
  [K in keyof T]?: T[K] extends { $inferInput: infer U } ? U | null : never
}
