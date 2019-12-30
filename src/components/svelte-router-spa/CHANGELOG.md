# Svelte Router changelog

## 5.1.1

- Fix an error when a route has a redirectTo that leads to a guarded route that also redirects.

```javascript
const adminRoutes = [
  {
    name: "/admin",
    layout: AdminLayout,
    nestedRoutes: [
      { name: "index", redirectTo: "admin/dashboard" },
      {
        name: "dashboard",
        component: DashboardIndex,
        onlyIf: {
          guard: isLoggedIn,
          redirect: "/login"
        }
      },
  }
}
```

## 5.1.0

- routeIsActive gets a second optional param to check if the path is included in the current active route.

## 5.0.0

- [Breaking change] Simplify configuration. SpaRouter and editing main.js no more needed. Add your routes directly to the Router component.

## 4.0.1

- Correct naming of redirect param used in guards.

## 4.0.0

- [Breaking change] SpaRouter params have changed. Please check the docs.

## 3.2.2

- Reorder SpaRouter object initial params

## 3.2.1

- Track pageviews in google analytics.

## 3.2.0

- Route guards

## 3.1.0

- Route redirection

## 3.0.0

- Improve handling of not found routes. No more custom not found logic use standard 404.html pages available in most of the hosting providers.

## 2.3.1

- Remove outdated config info.

## 2.3.0

- Add params to Route.

## 2.2.2

- Avoid full page reload when using a tags.

## 2.2.1

- Remove console log.

## 2.2.0

- Add named params to all child routes not just specific ones.

## 2.1.0

- Ensure nested routes with named params work.

## 2.0.15

- Remove ? when not needed.

## 2.0.14

- Get pathname and params from currentRoute

## 2.0.11

- Update onpopstate

## 2.0.10

- Do not remove query params from visible route.

## 2.0.9

- Add onpopstate handler.

## 2.0.8

- Fix docs to request a full url in pathName

## 2.0.7

- Eslint upgraded to version 6.

## 2.0.6

- Add Svelte as a peer dependency.

## 2.0.5

- Upgrade eslint and svelte

## 2.0.4

- Unlock Svelte

## 2.0.3

- Lock Svelte to 3.5.1

## 2.0.2

- Fix wrong result in routeIsActive

## 2.0.1

- Improve recognition of routes not nested.

## 2.0.0

- [Breaking Change] MainLayout has been renamed to Router. Please replace all references to MainLayout with Router.
- [Breaking Change] Replace nestedRoutes array in currentRoute with childRoute object.
- [Breaking Change] Renamed currentRoute method as routeIsActive.

- Refactor and cleanup code.

## 1.2.1

- Fix queryParams not generated in some type of routes.

## 1.2.0

- Improvements to nested routes and layouts

## 1.1.0

- New currentRoute method returns true/false if pathName is the active route.
- SpaRouter: If pathName is an empty string then navigate to home.

## 1.0.5

- Fix bug where external links where ignored.

## 1.0.4

- Update docs.

## 1.0.3

- Add Navigate component.

## 1.0.2

- Fix an error in navigateTo method.

## 1.0.1

- Docs updated.

## 1.0.0

- Initial version published.