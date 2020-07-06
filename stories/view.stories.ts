import { action } from '@storybook/addon-actions';

import { showDebug } from '../src/components/UI/debug';
showDebug.set(true)

import About from '../src/views/about.svelte'
import AccountLayout from '../src/views/account_layout.svelte'
import AdminIndex from '../src/views/admin_index.svelte'
import AdminLayout from '../src/views/admin_layout.svelte'
import Confirm from '../src/views/confirm.svelte'
import Contact from '../src/views/contact.svelte'
import GlobalSetting from '../src/views/globalsetting.svelte'
import Home from '../src/views/home.svelte'
import Logout from '../src/views/logout.svelte'
import MyPage from '../src/views/my_page.svelte'
import OrgIndex from '../src/views/org_index.svelte'
import OrgLayout from '../src/views/org_layout.svelte'
import ProjectIndex from '../src/views/project_index.svelte'
import ProjectLayout from '../src/views/project_layout.svelte'
import PublicLayout from '../src/views/public_layout.svelte'

export default { title: 'View' };

export const About_ = () => ({ Component: About, props: {er: "ERROR"} })
export const AdminIndex_ = () => ({ Component: AdminIndex, props: {er: "ERROR"} })
export const Contact_ = () => ({ Component: Contact, props: {er: "ERROR"} })
export const GlobalSetting_ = () => ({ Component: GlobalSetting, props: {er: "ERROR"} })
export const Home_ = () => ({ Component: Home, props: {er: "ERROR"} })
export const MyPage_ = () => ({ Component: MyPage, props: {er: "ERROR"} })
export const OrgIndex_ = () => ({ Component: OrgIndex, props: {er: "ERROR"} })
export const OrgLayout_ = () => ({ Component: OrgLayout, props: {er: "ERROR"} })
export const ProjectIndex_ = () => ({ Component: ProjectIndex, props: {er: "ERROR"} })
export const ProjectLayout_ = () => ({ Component: ProjectLayout, props: {er: "ERROR"} })
export const PublicLayout_ = () => ({ Component: PublicLayout, props: {er: "ERROR"} })

export const AccountLayout_ = () => ({ Component: AccountLayout, props: {er: "ERROR"} })
export const AdminLayout_ = () => ({ Component: AdminLayout, props: {er: "ERROR"} })
export const Confirm_ = () => ({ Component: Confirm, props: {er: "ERROR"} })
export const Logout_ = () => ({ Component: Logout, props: {er: "ERROR"} })

