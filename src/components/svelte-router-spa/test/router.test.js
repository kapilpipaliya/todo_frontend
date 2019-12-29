const expect = require('chai').expect
const SpaRouter = require('../src/router').SpaRouter
const navigateTo = require('../src/router').navigateTo
const routeIsActive = require('../src/router').routeIsActive

let testRouter = null
let pathName = 'http://web.app/'
let routes = []

function thisIsFalse() {
  return false
}

function thisIsTrue() {
  return true
}

describe('Router', function() {
  describe('When route does not exist', function() {
    beforeEach(function() {
      testRouter = SpaRouter([], pathName)
    })

    it('should set the component', function() {
      expect(testRouter.activeRoute.component).to.equal('')
    })

    it('should set the route name to 404', function() {
      expect(testRouter.activeRoute.name).to.equal('404')
    })

    it('should set the route path to 404', function() {
      expect(testRouter.activeRoute.path).to.equal('404')
    })
  })

  describe('When route does not exist and there is a pathname', function() {
    beforeEach(function() {
      testRouter = SpaRouter(routes, 'http://web.app/this/route/does/not/exist')
    })

    it('should set thecomponent', function() {
      expect(testRouter.activeRoute.component).to.equal('')
    })

    it('should set the route name to 404', function() {
      expect(testRouter.activeRoute.name).to.equal('404')
    })

    it('should set the route path to 404', function() {
      expect(testRouter.activeRoute.path).to.equal('404')
    })
  })

  describe('When there are valid routes no nesting', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicLayout',
          nestedRoutes: [{ name: 'index', component: 'PublicIndex' }, { name: 'about-us', component: 'AboutUs' }]
        },

        { name: 'login', component: 'Login' },
        { name: 'project/:name', component: 'ProjectList' }
      ]
    })

    describe('When root path', function() {
      beforeEach(function() {
        pathName = 'http://web.app/'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path to root path', function() {
        expect(testRouter.activeRoute.path).to.equal('/')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('PublicLayout')
      })

      it('should set path to root path', function() {
        expect(testRouter.activeRoute.path).to.equal('/')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('PublicIndex')
      })
    })

    describe('When path is first level', function() {
      beforeEach(function() {
        pathName = 'https://fake.web/login'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path to root path', function() {
        expect(testRouter.activeRoute.path).to.equal('/login')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('Login')
      })
    })
  })

  describe('Query params', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicIndex'
        },
        { name: 'login', component: 'Login' },
        { name: 'project/:title', component: 'ProjectList' },
        {
          name: '/about-us',
          component: 'AboutUsLayout',
          nestedRoutes: [{ name: 'index', component: 'AboutUsPage' }]
        }
      ]
    })

    describe('Query params to index route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/login?q=sangria'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should update queryParams', function() {
        expect(testRouter.activeRoute.queryParams.q).to.equal('sangria')
      })
    })

    describe('Query params to one level route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/login?climate=change&sea-level=rising'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should update queryParams', function() {
        expect(testRouter.activeRoute.queryParams.climate).to.equal('change')
      })

      it('should update queryParams', function() {
        expect(testRouter.activeRoute.queryParams['sea-level']).to.equal('rising')
      })
    })
  })

  describe('Query params to named routes', function() {
    beforeEach(function() {
      pathName = 'http://web.app/project/save_earth?climate=change&sea-level=rising'
      testRouter = SpaRouter(routes, pathName)
    })

    it('should update queryParams', function() {
      expect(testRouter.activeRoute.namedParams.title).to.equal('save_earth')
    })

    it('should update queryParams', function() {
      expect(testRouter.activeRoute.queryParams.climate).to.equal('change')
    })

    it('should update queryParams', function() {
      expect(testRouter.activeRoute.queryParams['sea-level']).to.equal('rising')
    })
  })

  describe('When there are valid routes no nesting with named params', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicIndex'
        },
        { name: 'login', component: 'Login' },
        { name: 'project/:name', component: 'ProjectList' },
        {
          name: '/about-us',
          component: 'AboutUsLayout',
          nestedRoutes: [{ name: 'index', component: 'AboutUsPage' }]
        }
      ]
    })

    describe('When path is first level', function() {
      beforeEach(function() {
        pathName = 'http://web.app/project/easy-routing'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path to root path', function() {
        expect(testRouter.activeRoute.path).to.equal('/project/easy-routing')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('ProjectList')
      })

      it('should set named params', function() {
        expect(testRouter.activeRoute.namedParams.name).to.equal('easy-routing')
      })
    })

    describe('When top level layout with index', function() {
      beforeEach(function() {
        pathName = 'http://web.app/about-us'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path to root path', function() {
        expect(testRouter.activeRoute.path).to.equal('/about-us')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AboutUsLayout')
      })

      it('should set named params', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('AboutUsPage')
      })
    })

    describe('When top level layout with index', function() {
      beforeEach(function() {
        pathName = 'http://web.app/about-us/'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path to root path', function() {
        expect(testRouter.activeRoute.path).to.equal('/about-us')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AboutUsLayout')
      })

      it('should set named params', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('AboutUsPage')
      })
    })

    describe('When top level layout with index and wrong address', function() {
      beforeEach(function() {
        pathName = 'http://web.app/about-us/pepe'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set the route name to 404', function() {
        expect(testRouter.activeRoute.name).to.equal('404')
      })

      it('should set the route path to 404', function() {
        expect(testRouter.activeRoute.path).to.equal('404')
      })
    })
  })

  describe('When there are valid routes no nesting with more than one named params', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicIndex'
        },
        { name: 'login', component: 'Login' },
        { name: 'project/:name/:date', component: 'ProjectList' }
      ]
    })

    describe('When path is first level', function() {
      beforeEach(function() {
        pathName = 'http://web.app/project/easy-routing/2019-03-26'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path to root path', function() {
        expect(testRouter.activeRoute.path).to.equal('/project/easy-routing/2019-03-26')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('ProjectList')
      })

      it('should set named params', function() {
        expect(testRouter.activeRoute.namedParams.name).to.equal('easy-routing')
      })

      it('should set named params', function() {
        expect(testRouter.activeRoute.namedParams.date).to.equal('2019-03-26')
      })
    })
  })

  describe('When there are namespaced routes', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicLayout',
          nestedRoutes: [{ name: 'index', component: 'PublicIndex' }, { name: 'about-us', component: 'AboutUs' }]
        },

        { name: 'login', component: 'Login' },
        {
          name: 'admin',
          component: 'AdminLayout',
          nestedRoutes: [
            { name: 'index', component: 'AdminIndex' },
            {
              name: 'employees',
              nestedRoutes: [
                { name: 'index', component: 'EmployeesIndex' },
                {
                  name: 'show/:id/:full-name',
                  component: 'ShowEmployee'
                }
              ]
            }
          ]
        }
      ]
    })
    describe('When path is nested with named params', function() {
      let showEmployeeRoute
      let activeRoute
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees/show/12/Danny-filth'
        testRouter = SpaRouter(routes, pathName)
        activeRoute = testRouter.activeRoute
        const employeeRoute = activeRoute.childRoute
        showEmployeeRoute = employeeRoute.childRoute
      })

      it('should set path to root path', function() {
        expect(activeRoute.path).to.equal('/admin/employees/show/12/Danny-filth')
      })

      it('should set component name', function() {
        expect(showEmployeeRoute.component).to.equal('ShowEmployee')
      })

      it('should set named params', function() {
        expect(showEmployeeRoute.namedParams.id).to.equal('12')
      })

      it('should set named params', function() {
        expect(showEmployeeRoute.namedParams['full-name']).to.equal('Danny-filth')
      })
    })
  })

  describe('When there are nested routes with index page', function() {
    beforeEach(function() {
      routes = [
        {
          name: 'admin',
          component: 'AdminLayout',
          nestedRoutes: [
            { name: 'index', component: 'DashboardIndex' },
            {
              name: 'employees',
              component: 'EmployeeLayout',
              nestedRoutes: [
                { name: 'index', component: 'EmployeesIndex' },
                { name: 'show/:id', component: 'EmployeesShow' }
              ]
            }
          ]
        }
      ]
    })

    describe('Employee index route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path to root path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees')
      })

      it('should set root component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminLayout')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('EmployeeLayout')
      })

      it('should set nested index component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.component).to.equal('EmployeesIndex')
      })
    })
  })

  describe('When there are nested routes', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicLayout',
          nestedRoutes: [{ name: 'index', component: 'PublicIndex' }, { name: 'about-us', component: 'AboutUs' }]
        },

        { name: 'login', component: 'Login' },
        {
          name: 'admin',
          component: 'AdminLayout',
          nestedRoutes: [
            { name: 'index', component: 'AdminIndex' },
            {
              name: 'employees',
              nestedRoutes: [
                { name: 'index', component: 'EmployeesIndex' },
                {
                  name: 'show/:id/:full-name',
                  component: 'ShowEmployee'
                }
              ]
            }
          ]
        }
      ]
    })

    describe('Admin route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path to root path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminLayout')
      })
    })

    describe('Employees route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminLayout')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.childRoute).to.be
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.component).to.equal('EmployeesIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.be.undefined
      })
    })

    describe('Employee show route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees/show'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees/show')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminLayout')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.be.undefined
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.component).to.equal('ShowEmployee')
      })
    })
  })

  describe('When there are nested routes with named params', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicIndex'
        },
        { name: 'login', component: 'Login' },
        { name: 'signup', component: 'SignUp' },
        {
          name: 'admin',
          component: 'AdminIndex',
          nestedRoutes: [
            {
              name: 'employees',
              component: 'EmployeesIndex',
              nestedRoutes: [
                {
                  name: 'show/:id',
                  component: 'ShowEmployee'
                }
              ]
            }
          ]
        }
      ]
    })

    describe('Employee show route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees/show'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees/show')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('EmployeesIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.component).to.equal('ShowEmployee')
      })
    })
  })

  describe('When there are nested routes with named params in the middle of the route', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicIndex'
        },
        { name: 'login', component: 'Login' },
        { name: 'signup', component: 'SignUp' },
        {
          name: 'admin',
          component: 'AdminIndex',
          nestedRoutes: [
            {
              name: 'employees',
              component: 'EmployeesIndex',
              nestedRoutes: [
                {
                  name: 'show/:id',
                  component: 'ShowEmployeeLayout',
                  nestedRoutes: [
                    {
                      name: 'index',
                      component: 'ShowEmployee'
                    },
                    {
                      name: 'calendar/:month',
                      component: 'CalendarEmployee'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    })

    describe('Employee show route with named param', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees/show/123'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees/show/123')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('EmployeesIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.component).to.equal('ShowEmployeeLayout')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.childRoute.component).to.equal('ShowEmployee')
      })
    })

    describe('Employee show route with named param and extra route info', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees/show/123/calendar'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees/show/123/calendar')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('EmployeesIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.component).to.equal('ShowEmployeeLayout')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.childRoute.component).to.equal('CalendarEmployee')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.childRoute.namedParams).to.include({ id: '123' })
      })
    })

    describe('Employee show route with named param and extra route info', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees/show/123/calendar/july'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees/show/123/calendar/july')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.childRoute.component).to.equal('CalendarEmployee')
      })

      it('should set first nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.childRoute.namedParams).to.include({ id: '123' })
      })

      it('should set second nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.childRoute.namedParams).to.include({ month: 'july' })
      })
    })

    describe('Employee show route with named param', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees/show'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees/show')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('EmployeesIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.component).to.equal('ShowEmployeeLayout')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.childRoute.childRoute.component).to.equal('ShowEmployee')
      })
    })
  })

  describe('When there are nested routes with no layout', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicIndex'
        },
        { name: 'login', component: 'Login' },
        { name: 'signup', component: 'SignUp' },
        {
          name: 'admin',
          component: 'AdminIndex',
          nestedRoutes: [
            {
              name: 'employees',
              component: 'EmployeesIndex'
            },
            {
              name: 'employees/show/:id',
              component: 'ShowEmployee'
            },
            {
              name: 'teams',
              component: 'TeamsIndex'
            },
            {
              name: 'teams/active',
              component: 'ActiveTeams'
            },
            {
              name: 'teams/show/:name',
              component: 'ShowTeams'
            }
          ]
        }
      ]
    })

    describe('Employee index route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('EmployeesIndex')
      })
    })

    describe('Employee show route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees/show'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/employees/show')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('ShowEmployee')
      })
    })

    describe('Teams index route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/teams'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/teams')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('TeamsIndex')
      })
    })

    describe('Teams active', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/teams/active'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/teams/active')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('ActiveTeams')
      })
    })

    describe('Teams show', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/teams/show/leader-team'
        testRouter = SpaRouter(routes, pathName)
      })

      it('should set path', function() {
        expect(testRouter.activeRoute.path).to.equal('/admin/teams/show/leader-team')
      })

      it('should set component name', function() {
        expect(testRouter.activeRoute.component).to.equal('AdminIndex')
      })

      it('should set nested component name', function() {
        expect(testRouter.activeRoute.childRoute.component).to.equal('ShowTeams')
      })

      it('should set the named param', function() {
        expect(testRouter.activeRoute.childRoute.namedParams.name).to.equal('leader-team')
      })
    })
  })
})

describe('navigateTo', function() {
  beforeEach(function() {
    pathName = 'https://fake.com/'
    SpaRouter([{ name: '/', component: 'MainPage' }], pathName).activeRoute
  })

  describe('when route is valid', function() {
    it('should set the active route to selected route', function() {
      expect(navigateTo('/')).to.include({ name: '/', component: 'MainPage', path: '/' })
    })
  })

  describe('when route is not valid', function() {
    it('should set the active route to 404', function() {
      expect(navigateTo('/invalid')).to.include({ name: '404', component: '', path: '404' })
    })
  })
})

describe('routeIsActive', function() {
  beforeEach(function() {
    routes = [
      { name: '/', component: 'MainPage' },
      {
        name: 'current',
        component: 'Current',
        nestedRoutes: [
          {
            name: 'active/:id',
            component: 'Active',
            nestedRoutes: [{ name: 'route', component: 'Route' }]
          }
        ]
      }
    ]
    pathName = 'http://web.app/current/active?test=true&routing=awesome'
  })

  describe('a standard route not active', function() {
    beforeEach(function() {
      SpaRouter(routes, pathName).activeRoute
    })

    it('should return false', function() {
      expect(routeIsActive('/current')).to.be.false
    })
  })

  describe('a route with a named param', function() {
    beforeEach(function() {
      SpaRouter(routes, pathName).activeRoute
    })

    it('should return true', function() {
      expect(routeIsActive('/current/active')).to.be.true
    })
  })

  describe('a route with a named param and a value', function() {
    beforeEach(function() {
      SpaRouter(routes, pathName).activeRoute
    })

    it('should return false', function() {
      expect(routeIsActive('/current/active/333')).to.be.false
    })
  })

  describe('a route with named params', function() {
    beforeEach(function() {
      pathName = 'http://web.app/current/active/4343/route/?test=true&routing=awesome'
      SpaRouter(routes, pathName).activeRoute
    })

    it('should return true', function() {
      expect(routeIsActive('/current/active/4343/route/')).to.be.true
    })
  })

  describe('a route with search queries', function() {
    beforeEach(function() {
      pathName = 'http://web.app/current/active/4343/route/?test=true&routing=awesome'
      SpaRouter(routes, pathName).activeRoute
    })

    it('should return true', function() {
      expect(routeIsActive('/current/active/4343/route/?test=true&routing=awesome')).to.be.true
    })
  })

  describe('a non active route', function() {
    beforeEach(function() {
      SpaRouter(routes, pathName).activeRoute
    })

    it('should return false', function() {
      expect(routeIsActive('/other/not/active')).to.be.false
    })
  })

  describe('Routes in same level', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/',
          component: 'PublicIndex'
        },
        { name: 'login', component: 'Login' },
        { name: 'signup', component: 'SignUp' },
        {
          name: 'admin',
          component: 'AdminIndex',
          nestedRoutes: [
            {
              name: 'employees',
              component: 'EmployeesIndex'
            },
            {
              name: 'employees/show/:id',
              component: 'ShowEmployee'
            },
            {
              name: 'teams',
              component: 'TeamsIndex'
            },
            {
              name: 'teams/active',
              component: 'ActiveTeams'
            },
            {
              name: 'teams/show/:name',
              component: 'ShowTeams'
            }
          ]
        }
      ]
    })

    describe('a standard route', function() {
      beforeEach(function() {
        pathName = 'http://web.app/login'
        SpaRouter(routes, pathName).activeRoute
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('/login')).to.be.true
      })

      it('should return false if not matches active route', function() {
        expect(routeIsActive('/wrong')).to.be.false
      })
    })

    describe('a standard route not active', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/employees'
        SpaRouter(routes, pathName).activeRoute
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('/admin/employees')).to.be.true
      })

      it('should return false if not matches active route', function() {
        expect(routeIsActive('/admin/projects')).to.be.false
      })
    })

    describe('a standard route not active', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/teams/active'
        SpaRouter(routes, pathName).activeRoute
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('/admin/teams/active')).to.be.true
      })

      it('should return false if not matches active route', function() {
        expect(routeIsActive('/admin/teams/projects')).to.be.false
      })
    })

    describe('a standard route not active', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/teams/show/accountants'
        SpaRouter(routes, pathName).activeRoute
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('/admin/teams/show/accountants')).to.be.true
      })

      it('should return false if not matches active route', function() {
        expect(routeIsActive('/admin/teams/wrong/accountants')).to.be.false
      })
    })

    describe('a standard route not active', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/teams/show/accountants'
        SpaRouter(routes, pathName).activeRoute
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('admin/teams/show/accountants')).to.be.true
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('admin/teams/show/accountants/')).to.be.true
      })

      it('should return false if not matches active route', function() {
        expect(routeIsActive('/admin/teams/show/accountants/')).to.be.true
      })
    })

    describe('with include active', function() {
      beforeEach(function() {
        pathName = 'http://web.app/admin/teams/show/accountants'
        SpaRouter(routes, pathName).activeRoute
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('/admin', true)).to.be.true
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('admin', true)).to.be.true
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('/teams', true)).to.be.true
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('teams', true)).to.be.true
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('/teams/show', true)).to.be.true
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('teams/show', true)).to.be.true
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('/show/accountants', true)).to.be.true
      })

      it('should return true if matches active route', function() {
        expect(routeIsActive('show/accountants', true)).to.be.true
      })
    })
  })
})

describe('onlyIf', function() {
  describe('when guard is true', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/admin',
          component: 'AdminLayout',
          nestedRoutes: [
            { name: 'index', component: 'AdminIndex' },
            { name: 'private', component: 'PrivateComponent' }
          ],
          onlyIf: { guard: thisIsTrue, redirect: '/login' }
        },

        { name: 'login', component: 'Login' }
      ]

      pathName = 'http://web.app/admin'
      SpaRouter(routes, pathName)
    })

    it('should render admin', function() {
      expect(routeIsActive('/admin')).to.be.true
    })
  })

  describe('when guard is false', function() {
    beforeEach(function() {
      routes = [
        {
          name: '/admin',
          component: 'AdminLayout',
          nestedRoutes: [
            { name: 'index', component: 'AdminIndex' },
            { name: 'private', component: 'PrivateComponent' }
          ],
          onlyIf: { guard: thisIsFalse, redirect: '/login' }
        },

        { name: 'login', component: 'Login' }
      ]

      pathName = 'http://web.app/admin'
      SpaRouter(routes, pathName)
    })

    it('should render login', function() {
      expect(routeIsActive('/login')).to.be.false
    })
  })
})
