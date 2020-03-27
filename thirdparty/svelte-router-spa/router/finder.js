import { UrlParser } from 'url-params-parser'

import { RouterRedirect } from './redirect'
import { RouterRoute } from './route'
import { RouterPath } from './path'
import { anyEmptyNestedRoutes, pathWithoutQueryParams } from '../lib/utils'

const NotFoundPage = '/404.html'

export function RouterFinder(routes, currentUrl, language, convert) {
  let redirectTo = ''
  let routeNamedParams = {}
  const urlParser = UrlParser(currentUrl)

  async function findActiveRoute() {
    let searchActiveRoute = await searchActiveRoutes(routes, '', urlParser.pathNames, language, convert)

    if (!searchActiveRoute || !Object.keys(searchActiveRoute).length || anyEmptyNestedRoutes(searchActiveRoute)) {
      if (typeof window !== 'undefined') {
        searchActiveRoute = { name: '404', component: '', path: '404', redirectTo: NotFoundPage }
      }
    } else {
      searchActiveRoute.path = pathWithoutQueryParams(searchActiveRoute)
    }

    return searchActiveRoute
  }

  /**
   * Gets an array of routes and the browser pathname and return the active route
   * @param routes
   * @param basePath
   * @param pathNames
   **/
  async function searchActiveRoutes(routes, basePath, pathNames, currentLanguage, convert) {
    let currentRoute = {}
    let basePathName = pathNames.shift().toLowerCase()
    const routerPath = RouterPath({ basePath, basePathName, pathNames, convert, currentLanguage })

    async function processRoute(route) {
      routerPath.updatedPath(route)
      if (routerPath.basePathSameAsLocalised()) {
        let routePath = routerPath.routePath()

        redirectTo = await RouterRedirect(route, redirectTo).path()

        if (currentRoute.name !== routePath) {
          currentRoute = setCurrentRoute({
            route,
            routePath,
            routeLanguage: routerPath.routeLanguage(),
            urlParser,
            namedPath: routerPath.namedPath()
          })
        }

        if (route.nestedRoutes && route.nestedRoutes.length > 0 && routerPath.pathNames.length > 0) {
          currentRoute.childRoute = await searchActiveRoutes(
            route.nestedRoutes,
            routePath,
            routerPath.pathNames,
            routerPath.routeLanguage(),
            convert
          )
          currentRoute.path = currentRoute.childRoute.path
          currentRoute.language = currentRoute.childRoute.language
        } else if (nestedRoutesAndNoPath(route, routerPath.pathNames)) {
          const indexRoute = await searchActiveRoutes(
            route.nestedRoutes,
            routePath,
            ['index'],
            routerPath.routeLanguage(),
            convert
          )
          if (indexRoute && Object.keys(indexRoute).length > 0) {
            currentRoute.childRoute = indexRoute
            currentRoute.language = currentRoute.childRoute.language
          }
        }
      }
    }
    for (const route of routes) {
      await processRoute(route);
    }

    if (redirectTo) {
      currentRoute.redirectTo = redirectTo
    }

    return currentRoute
  }

  function nestedRoutesAndNoPath(route, pathNames) {
    return route.nestedRoutes && route.nestedRoutes.length > 0 && pathNames.length === 0
  }

  function setCurrentRoute({ route, routePath, routeLanguage, urlParser, namedPath }) {
    const routerRoute = RouterRoute({
      routeInfo: route,
      urlParser,
      path: routePath,
      routeNamedParams,
      namedPath,
      language: routeLanguage
    })
    routeNamedParams = routerRoute.namedParams()

    return routerRoute.get()
  }

  return Object.freeze({ findActiveRoute })
}

