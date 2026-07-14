/**
 * input[type=number], если указан step типа 0.000000001,
 * то при изменении значения нативными кнопками поля, есть разное поведение:
 * 1. Если значение читаемое уже есть, то изменение корректное
 * 2. Если поле пустое, то выводит типа 1e-9
 * Вот этот хелпер чтобы корректно выводилось читаемое значение
 */
export function floatToString(
  value: string | number | null | undefined,
  digits = 9,
): string {
  if (value === undefined || value === null || value === '') {
    return ''
  }

  return parseFloat(value.toString()).toFixed(digits)
}
