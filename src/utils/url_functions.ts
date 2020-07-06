
export function isSubDomain() {
  return window.location.hostname.split('.').length > 2;
}
export let guest_menu = [
  {
    name: 'Register',
    path: '/super_register'
  },
  {
    name: 'Login',
    path: '/super_login'
  }
];
export let subdomain_guest_menu = [
  {
    name: 'Register',
    path: '/register'
  },
  {
    name: 'Login',
    path: '/login'
  }
];
export let public_menu = [
  // fixed menu
  {
    name: 'Contact',
    path: '/contact'
  },
  {
    name: 'About',
    path: '/about'
  }
];
