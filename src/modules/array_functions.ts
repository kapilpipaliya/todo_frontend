import * as RX from 'rambdax'
// Array Functions:----------------------
export const first = a => (a[0] && a[0][0]) ?? 0

const getIndexValue = (arr, idx, pos) => {
  return idx > -1 && arr[idx] ? arr[idx][pos] : ''
}
export function merge(array1, array2){
  for(let i=0; i < array2.length; i++){
    if(array1[i]) {
      array2[i] = array1[i]
    }
  }
  return array2
}
// [1, ' - ',2], [...]
export function stringifyRawPattern(pattern: Array<number | string>, row: []){
let str = ''
  pattern.forEach(x => {
    if(RX.type(x) ==  'Number') {
      str += row[x]
    } else {
      str += x
    }
  })  
  return str
}