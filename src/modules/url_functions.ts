
export function urlPath() {
  return window.location.pathname
}
export function parentPath() {
  const path = window.location.pathname
  // https://stackoverflow.com/questions/10886727/remove-last-element-from-url
  return path.slice(0, path.lastIndexOf('/'))
}
