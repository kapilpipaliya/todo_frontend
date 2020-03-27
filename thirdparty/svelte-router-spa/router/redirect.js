import { RouterGuard } from './guard'

export function RouterRedirect(route, currentPath) {
  const guard = RouterGuard(route.onlyIf)

  async function path() {
    let redirectTo = currentPath
    if (route.redirectTo && route.redirectTo.length > 0) {
      redirectTo = route.redirectTo
    }

    if (guard.valid() && (await guard.redirect())) {
      redirectTo = guard.redirectPath()
    }

    return redirectTo
  }

  return Object.freeze({ path })
}

