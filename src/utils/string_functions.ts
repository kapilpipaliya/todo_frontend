import { type } from 'rambdax';

// [1, ' - ',2], [...]
export function stringifyRawPattern(pattern: Array<number | string>, row: []) {
    let str = '';
    pattern.forEach(x => {
        if (type(x) == 'Number') {
        str += row[x as number];
        } else {
        str += x;
        }
    });
    return str;
}