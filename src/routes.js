import Login from './account/login.svelte'
import PublicIndex from './views/public/index.svelte'
import PublicLayout from './views/public/layout.svelte'
import AdminLayout from './views/admin/layout.svelte'
import AdminIndex from './views/admin/index.svelte'
import EmployeesIndex from './views/admin/employees/index.svelte'
  import Page from './Page.svelte'
function userIsAdmin() {
  return true
  //check if user is admin and returns true or false
}

const routes = [
  {
    name: '/',
    component: PublicLayout
  },
  { name: 'login', component: Login, layout: PublicLayout },
  {
    name: 'admin',
    component: AdminLayout,
    onlyIf: { guard: userIsAdmin, redirect: '/login' },
    nestedRoutes: [
      { name: 'index', component: AdminIndex },
      {
        name: 'employees',
        component: '',
        nestedRoutes: [
          { name: 'index', component: EmployeesIndex }
        ]
      },
      {name: '/design', component: Login},

    ]
  },
  {name: 'account/login', component: Login},
  {name: 'account/register', component: Login},
  {name: 'account/logout', component: Login},

  {name: 'page/:table', component: Page},
]

export { routes }