import { writable } from '../../../svelte/src/runtime/store/index'; 
export const project_id = writable([] as string[])
export const project_data = writable([] as Array<{}>)