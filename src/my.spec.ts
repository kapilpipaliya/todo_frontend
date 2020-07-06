import { modifyRoutes } from './utils/process_routes';
import { ServerEventsDispatcher } from './ws_events_dispatcher';

const css = [
  [
    {
      activity: { subtitle: 'All The Activities', title: 'Activities' },
      announcement: { subtitle: 'Announcements', title: 'Announcements' },
      color: { subtitle: 'All The Colors', title: 'Colors' },
      confirm: { subtitle: 'All Remaining Confirmations of the members.', title: 'Confirm' },
      doc_category: { subtitle: 'Document Categories', title: 'Document Categories' },
      forum: { subtitle: 'All The Forum', title: 'Forum' },
      global_color: { subtitle: 'Global Colors.', title: 'Global Colors' },
      global_permission: { subtitle: 'All Global Permissions', title: 'Global Permissions' },
      global_role: { subtitle: 'All Global Roles', title: 'Global Roles' },
      group: { subtitle: 'All The Groups', title: 'Groups' },
      login: { subtitle: '', title: 'Login' },
      member: { subtitle: 'All Members', title: 'Members' },
      msg: { delete: 'Deleted Successfully', save: 'Saved Successfully' },
      news: { subtitle: 'All The Document Categories', title: 'Document Categories' },
      note: { subtitle: 'Note For Kapil', title: 'Note' },
      organization: { subtitle: 'All The Organizations', title: 'Organizations' },
      permission: { subtitle: 'All The Permissions', title: 'Permissions' },
      post: { subtitle: 'All The Post', title: 'Post' },
      priority: { subtitle: 'All The priorities', title: 'priorities' },
      project: { subtitle: 'All The Projects under a Organization', title: 'Projects' },
      register: { subtitle: '', title: 'Registraion' },
      role: { subtitle: 'All The Roles', title: 'Roles' },
      schema: {
        subtitle: 'Form, Fields, Columns and Other schemas(Routes, Top Menu, Side Menu, Migrations...)',
        title: 'Schema'
      },
      session: { subtitle: 'All The Sessions of logged in members', title: 'Sessions' },
      status: { subtitle: 'All The Status', title: 'Status' },
      translation: {
        subtitle:
          '::Mutation Action not implemented, currently storing in Schema Collection-> translation key. So Empty Collection::',
        title: 'Translation'
      },
      type: { subtitle: 'All The Types', title: 'Types' },
      user: { subtitle: 'All The Users of The system', title: 'Users' },
      wiki: { subtitle: 'All The Wiki', title: 'Wiki' },
      work_package: { subtitle: 'All The Work Packages', title: 'Work Packages' }
    }
  ]
];
describe('css', () => {
  // todo
});
describe('routes', () => {
  /*it('routes modification test', () => {
    let routes = [
      { component: 'Home', name: '/' },
      { component: 'Contact', name: 'contact' },
      { component: 'About', name: 'about' },
      { component: 'Page', layout: 'PublicLayout', name: 'page/:schema_key' },
      { component: 'Page', name: 'organizations', params: { schema_key: 'organization' } },
      { component: 'Page', name: 'projects', params: { schema_key: 'project' } },
      {
        component: 'Form',
        name: 'super_register',
        onlyIf: { guard: 'isNotLoggedIn', redirect: '/' },
        params: { b: ['signup2'], default_pattern: [[0, 'user']], key: null, schema_key: 'register', t: ['signup'] }
      },
      {
        component: 'Form',
        name: 'super_login',
        onlyIf: { guard: 'isNotLoggedIn', redirect: '/' },
        params: { default_pattern: [[0, 'user']], key: null, schema_key: 'login' }
      },
      { component: 'Logout', name: 'logout', onlyIf: { guard: 'isLoggedIn', redirect: '/' } },
      {
        component: 'Form',
        name: 'register/:user',
        onlyIf: { guard: 'isNotLoggedIn', redirect: '/' },
        params: { default_pattern: [[0, 'user']], key: null, schema_key: 'mregister' }
      },
      {
        component: 'Form',
        name: 'login/:user',
        onlyIf: { guard: 'isNotLoggedIn', redirect: '/' },
        params: { default_pattern: [[0, 'user']], key: null, schema_key: 'mlogin' }
      },
      {
        component: '',
        name: 'account',
        nestedRoutes: [
          { component: 'Confirm', name: 'confirm' },
          {
            component: 'Form',
            layout: 'AccountLayout',
            name: 'profile',
            onlyIf: { guard: 'isLoggedIn', redirect: '/' },
            params: { key: 'member_setting', schema_key: 'setting' }
          },
          {
            component: 'Form',
            layout: 'AccountLayout',
            name: 'settings',
            onlyIf: { guard: 'isLoggedIn', redirect: '/' },
            params: { key: 'member_setting', schema_key: 'setting' }
          },
          {
            component: 'Form',
            layout: 'AccountLayout',
            name: 'change_password',
            onlyIf: { guard: 'isLoggedIn', redirect: '/' },
            params: { key: 'member_setting', schema_key: 'setting' }
          },
          {
            component: 'Form',
            layout: 'AccountLayout',
            name: 'access_token',
            onlyIf: { guard: 'isLoggedIn', redirect: '/' },
            params: { key: 'member_setting', schema_key: 'setting' }
          },
          {
            component: 'Form',
            layout: 'AccountLayout',
            name: 'mail_notifications',
            onlyIf: { guard: 'isLoggedIn', redirect: '/' },
            params: { key: 'member_setting', schema_key: 'setting' }
          },
          {
            component: 'Form',
            layout: 'AccountLayout',
            name: 'avatar',
            onlyIf: { guard: 'isLoggedIn', redirect: '/' },
            params: { key: 'member_setting', schema_key: 'setting' }
          },
          {
            component: 'Form',
            layout: 'AccountLayout',
            name: 'delete_accountr',
            onlyIf: { guard: 'isLoggedIn', redirect: '/' },
            params: { key: 'member_setting', schema_key: 'setting' }
          }
        ]
      },
      { component: 'MyPage', name: 'my', nestedRoutes: [{ component: '', name: 'page' }] },
      {
        component: 'AdminLayout',
        name: 'admin',
        nestedRoutes: [
          { component: 'AdminIndex', name: 'index' },
          { component: 'Page', name: 'menu', params: { schema_key: 'menu' } },
          { component: 'Page', name: 'projects', params: { schema_key: 'project' } },
          { component: 'Page', name: 'groups', params: { schema_key: 'group' } },
          { component: 'Page', name: 'roles', params: { schema_key: 'role' } },
          { component: 'Page', name: 'members', params: { schema_key: 'member' } },
          { component: 'Form', name: 'members_settings', params: { key: 'member_setting', schema_key: 'setting' } },
          { component: 'Page', name: 'permissions', params: { schema_key: 'permission' } },
          { component: 'Page', name: 'avatars', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'work_package_settings', params: { key: null, schema_key: 'work_package_setting' } },
          { component: 'Page', name: 'custom_fields', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'custom_actions', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'attribute_help_texts', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'custom_fields', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'settings', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'oauth_applications', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'auth_settings', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'design', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'custom_styles', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'budgets', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'backlogs', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'info', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'webhooks', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'colors', params: { schema_key: 'color' } },
          { component: 'Page', name: 'types', params: { schema_key: 'type' } },
          { component: 'Page', name: 'priorities', params: { schema_key: 'priority' } },
          { component: 'Page', name: 'status', params: { schema_key: 'status' } },
          { component: 'Page', name: 'activities', params: { schema_key: 'activity' } },
          { component: 'Page', name: 'document_categories', params: { schema_key: 'doc_category' } },
          { component: 'Page', name: 'media', params: { schema_key: 'media' } },
          { component: 'Page', name: 'message', params: { schema_key: 'message' } },
          { component: 'Page', name: 'categories', params: { schema_key: 'category' } },
          { component: 'Page', name: 'announcements', params: { schema_key: 'announcement' } },
          { component: 'Page', name: 'news', params: { schema_key: 'news' } },
          { component: 'Page', name: 'wiki', params: { schema_key: 'wiki' } },
          { component: 'Page', name: 'work_packages', params: { schema_key: 'work_package' } },
          { component: 'Page', name: 'forum', params: { schema_key: 'forum' } },
          { component: 'Page', name: 'posts', params: { schema_key: 'post' } }
        ],
        onlyIf: { guard: 'userIsAdmin', redirect: 'account/login' }
      },
      {
        component: 'OrganizationLayout',
        name: 'organization/:org',
        nestedRoutes: [
          { component: 'OrganizationIndex', name: 'index' },
          { component: 'Page', name: 'orgs', params: { schema_key: 'organization' } },
          {
            component: 'Page',
            name: 'projects',
            params: { pass: [['contextKey', 'org_data', '_key', 'org']], schema_key: 'project' }
          },
          {
            component: 'Page',
            name: 'groups',
            params: { pass: [['contextKey', 'org_data', '_key', 'org']], schema_key: 'organization_group' }
          },
          {
            component: 'Page',
            name: 'roles',
            params: { pass: [['contextKey', 'org_data', '_key', 'org']], schema_key: 'organization_role' }
          },
          { component: 'Page', name: 'members', params: { schema_key: 'member' } },
          { component: 'Page', name: 'members_settings', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'permissions', params: { schema_key: 'permission' } },
          { component: 'Page', name: 'avatars', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'work_package_settings', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'custom_fields', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'custom_actions', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'attribute_help_texts', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'custom_fields', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'settings', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'oauth_applications', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'auth_settings', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'design', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'custom_styles', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'budgets', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'backlogs', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'info', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'webhooks', params: { fixme: true, schema_key: 'member' } },
          { component: 'Page', name: 'colors', params: { schema_key: 'color' } },
          { component: 'Page', name: 'types', params: { schema_key: 'type' } },
          { component: 'Page', name: 'priorities', params: { schema_key: 'priority' } },
          { component: 'Page', name: 'status', params: { schema_key: 'status' } },
          { component: 'Page', name: 'activities', params: { schema_key: 'activity' } },
          { component: 'Page', name: 'document_categories', params: { schema_key: 'doc_category' } },
          { component: 'Page', name: 'media', params: { schema_key: 'media' } },
          { component: 'Page', name: 'message', params: { schema_key: 'message' } },
          { component: 'Page', name: 'categories', params: { schema_key: 'category' } },
          { component: 'Page', name: 'announcements', params: { schema_key: 'announcement' } },
          { component: 'Page', name: 'news', params: { schema_key: 'news' } },
          { component: 'Page', name: 'wiki', params: { schema_key: 'wiki' } },
          { component: 'Page', name: 'work_packages', params: { schema_key: 'work_package' } },
          { component: 'Page', name: 'forum', params: { schema_key: 'forum' } },
          { component: 'Page', name: 'posts', params: { schema_key: 'post' } },
          {
            component: 'ProjectLayout',
            name: 'project/:project',
            nestedRoutes: [
              { component: 'ProjectIndex', name: 'index' },
              { component: 'Page', name: 'activities', params: { schema_key: 'activity' } },
              { component: 'Page', name: 'roadmap', params: { schema_key: 'activity' } },
              {
                component: 'Page',
                name: 'work_packages',
                params: { pass: [['contextKey', 'project_data', '_key', 'pro']], schema_key: 'work_package' }
              },
              { component: 'Page', name: 'boards', params: { schema_key: 'work_package' } },
              { component: 'Page', name: 'backlogs', params: { schema_key: 'work_package' } },
              { component: 'Page', name: 'calendar', params: { schema_key: 'work_package' } },
              { component: 'Page', name: 'news', params: { schema_key: 'news' } },
              { component: 'Page', name: 'forum', params: { schema_key: 'forum' } },
              { component: 'Page', name: 'wiki', params: { schema_key: 'wiki' } },
              { component: 'Page', name: 'cost_reports', params: { schema_key: 'work_package' } },
              { component: 'Page', name: 'members', params: { schema_key: 'work_package' } },
              { component: 'Page', name: 'cost_objects', params: { schema_key: 'work_package' } },
              { component: 'Page', name: 'meetings', params: { schema_key: 'work_package' } },
              { component: 'Page', name: 'settings', params: { schema_key: 'work_package' } },
              { component: 'Page', name: 'posts', params: { schema_key: 'post' } }
            ],
            onlyIf: { guard: 'userIsAdmin', redirect: 'account/login' }
          }
        ],
        onlyIf: { guard: 'userIsAdmin', redirect: 'account/login' }
      }
    ];
    const C = {
      PublicLayout: 1,
      Home: 2,
      Contact: 3,
      About: 4,
      Page: 5,
      Form: 6,
      Logout: 7,
      Confirm: 8,
      AdminLayout: 9,
      AdminIndex: 10,
      OrganizationLayout: 11,
      OrganizationIndex: 12,
      ProjectLayout: 13,
      ProjectIndex: 14,
      MyPage: 15,
      AccountLayout: 16
    };

    const Guards = {
      userIsAdmin: () => true,
      isNotLoggedIn: async () => true,
      isLoggedIn: async () => true
    };
    routes = modifyRoutes(routes, C, Guards);
    // assert
    expect(routes).toBeArray();
    expect(routes.length > 0).toBe(true);
  });*/

  it('ws test', () => {
    //const ws = new ServerEventsDispatcher("my",{},{})
    //expect("my").toBe(ws.path)
  });
});

describe('pass array is pass by reference', () => {
  function tempFn(arr: Array<number>){
    arr.push(3);
    return arr;
  }
  let arr = []
  expect(arr).toBe(tempFn(arr))
  expect(arr).toHaveLength(1)
});
describe('pass object is pass by reference', () => {
  function tempFn(arr: {}){
    arr['hi'] = 'hello';
    return arr;
  }
  let arr = {}
  expect(arr).toBe(tempFn(arr))
});
describe('pass number|string|boolean is pass by value', () => {
  function tempFn(arr: number|string){
    arr =10
    return arr;
  }
  let arr: number|string = 5
  expect(10).toBe(tempFn(arr))
});
describe('object dereferencing', () => {
  let a = {x: 10, y: 20}
  const {x, y} = a
  expect(10).toBe(x)
  expect(20).toBe(y)

  let b = [10, 20]
  const [x1, y1] = b
  expect(10).toBe(x1)
  expect(20).toBe(y1)

  let c = [a, b]
  const [x2, y2] = c
  a['z']=30
  b.push(30)
  expect(a).toBe(x2)
  expect(b).toBe(y2)
  expect(c[0]).toBe(x2)
  expect(c[1]).toBe(y2)
});
describe('object dereferencing', () => {
  const Url_ = () => ({ data: 1 })
  expect(Url_()).toEqual({data: 1})

});