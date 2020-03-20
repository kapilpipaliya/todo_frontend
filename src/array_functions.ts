import { type } from 'rambdax'
// Array Functions:----------------------
export function merge(array1: [], array2: []) {
  for (let i = 0; i < array2.length; i++) {
    if (array1[i] && !array2[i]) {
      array2[i] = array1[i]
    }
  }
  return array2
}
// [1, ' - ',2], [...]
export function stringifyRawPattern(pattern: Array<number | string>, row: []) {
  let str = ''
  pattern.forEach(x => {
    if (type(x) == 'Number') {
      str += row[x as number]
    } else {
      str += x
    }
  })
  return str
}
