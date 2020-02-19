import * as RX from 'rambdax'
// Array Functions:----------------------
export function merge(array1: [], array2: []){
  for(let i=0; i < array2.length; i++){
    if(array1[i] && !array2[i]) {
      array2[i] = array1[i]
    }
  }
  return array2
}
// const a = ['1', '2']
// const b = ['1', '3']
// console.log(merge(a, b)) // ['1', '3']

// [1, ' - ',2], [...]
export function stringifyRawPattern(pattern: Array<number | string>, row: []){
let str = ''
  pattern.forEach(x => {
    if(RX.type(x) ==  'Number') {
      str += row[x as number]
    } else {
      str += x
    }
  })  
  return str
}