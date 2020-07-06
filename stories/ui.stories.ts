import { action } from '@storybook/addon-actions';

import { showDebug } from '../src/components/UI/debug';
showDebug.set(true)

import Error from '../src/components/UI/Error.svelte'
import Html from '../src/components/UI/Html.svelte'
// https://jdenticon.com/js-get-started/typescript.html
// import JDentiIcon from '../src/components/UI/Jdenticon.svelte' // Cannot find module '../transformers/0'
// https://github.com/takoyaro/svavatar
// import {Svavatar} from 'svavatar' // Error: Can't resolve 'svavatar'
import LoadAwesome from '../src/components/UI/LoadAwesome.svelte'
import Model from '../src/components/UI/Model.svelte'
import NightMode from '../src/components/UI/NightMode.svelte'
import RecentNotification from '../src/components/UI/RecentNotification.svelte'
import ScrollTop from '../src/components/UI/ScrollTop.svelte'
import Skeleton from '../src/components/UI/Skeleton.svelte'
import SortableList from '../src/components/UI/SortableList.svelte'
import Time from '../src/components/UI/Time.svelte'
import Tippy from '../src/components/UI/Tippy.svelte'
import Title from '../src/components/UI/Title.svelte'
import TopLevelComps from '../src/components/UI/TopLevelComps.svelte'
import TreeSidebar from '../src/components/UI/TreeSidebar.svelte'
import Table from '../src/components/UI/Table.svelte'

export default { title: 'UI' };

export const Error_ = () => ({ Component: Error, props: {er: "ERROR"} })
export const Html_ = () => ({ Component: Html, props: {html: ["signup"]} })
//export const JDentiIcon_ = () => ({ Component: JDentiIcon, props: {html: ["signup"]} })
//export const Svavatar_ = () => { const props = { type: "human", mood: "happy", seed: "tako", };  return { Component: Svavatar, props }}
export const LoadAwesome_ = () => ({ Component: LoadAwesome, props: {} })
export const Model_ = () => ({ Component: Model, props: {} })
export const NightMode_ = () => ({ Component: NightMode, props: {} })
export const RecentNotification_ = () => ({ Component: RecentNotification, props: {} })
export const ScrollTop_ = () => ({ Component: ScrollTop, props: {} })
export const Skeleton_ = () => ({ Component: Skeleton, props: {} })
export const SortableList_ = () => {
    const props = {
    }
    return { Component: SortableList, props, on: {click: action('clicked')}, }}
export const Time_ = () => ({ Component: Time, props: {} })
export const Tippy_ = () => ({ Component: Tippy, props: {} })
export const Title_ = () => ({ Component: Title, props: { currentRoute: { params: {  schema_key: 'note'     }       }    } })
export const TopLevelComps_ = () => ({ Component: TopLevelComps, props: { currentRoute: { params: {  schema_key: 'note'     }       }    } })
export const TreeSidebar_ = () => {
    const menu = [
            {
              "icon": "mif-meter",
              "name": "Overview",
              "path": "/organization/:org"
            },
            {
              "icon": "mif-info",
              "name": "Projects",
              "path": "/organization/:org/projects"
            },
            {
              "children": [
                {
                  "name": "Settings",
                  "path": "/organization/:org/members_settings"
                },
                {
                  "name": "Members",
                  "path": "/organization/:org/members"
                },
                {
                  "name": "Groups",
                  "path": "/organization/:org/groups"
                },
                {
                  "name": "Roles",
                  "path": "/organization/:org/roles"
                },
                {
                  "name": "Permissions",
                  "path": "/organization/:org/permissions"
                },
                {
                  "name": "Avatars",
                  "path": "/organization/:org/avatars"
                }
              ],
              "icon": "mif-meter",
              "name": "Members & Permissions",
              "path": "/organization/:org/members"
            },
            {
              "children": [
                {
                  "name": "Settings",
                  "path": "/organization/:org/work_package_settings"
                },
                {
                  "name": "Types",
                  "path": "/organization/:org/types"
                },
                {
                  "name": "Status",
                  "path": "/organization/:org/status"
                },
                {
                  "name": "Workflow",
                  "path": "/organization/:org/custom_fields"
                }
              ],
              "icon": "mif-assignment",
              "name": "Work packages",
              "path": "/organization/:org/work_package_settings"
            },
            {
              "name": "Custom actions",
              "path": "/organization/:org/custom_actions"
            },
            {
              "name": "Attribute Help Text",
              "path": "/organization/:org/attribute_help_texts"
            },
            {
              "icon": "mif-battery-empty",
              "name": "Custom fields",
              "path": "/organization/:org/custom_fields"
            },
            {
              "icon": "mif-hammer",
              "name": "System settings",
              "path": "/organization/:org/settings"
            },
            {
              "icon": "mif-pencil",
              "name": "Design",
              "path": "/organization/:org/design"
            },
            {
              "icon": "icon5 icon-custom-fields",
              "name": "Overview",
              "path": "/organization/:org/custom_styles"
            },
            {
              "icon": "mif-pencil",
              "name": "Colors",
              "path": "/organization/:org/colors"
            },
            {
              "icon": "mif-balance-scale",
              "name": "Budgets",
              "path": "/organization/:org/budgets"
            },
            {
              "icon": "mif-backlog",
              "name": "Backlogs",
              "path": "/organization/:org/backlogs"
            },
            {
              "icon": "mif-info",
              "name": "Activities",
              "path": "/organization/:org/activities"
            },
            {
              "icon": "mif-info",
              "name": "Document Categories",
              "path": "/organization/:org/document_categories"
            },
            {
              "icon": "mif-info",
              "name": "Wiki",
              "path": "/organization/:org/wiki"
            },
            {
              "icon": "mif-info",
              "name": "Forum",
              "path": "/organization/:org/forum"
            },
            {
              "icon": "mif-info",
              "name": "Post",
              "path": "/organization/:org/posts"
            }
          ]
    return { Component: TreeSidebar, props:{ menu }, on: {click: action('clicked')}, }}
export const MenuTable_ = () => {
    const props = {
        modelcomponent: false,
        quickcomponent: false,
        schema_key: "super_menu",
        pass: [],
        query: { },
        requiredFilter: [],
        fetchConfig: {type: 4},
        syncQueryParams: true,
        refresh: ()=>0,
        isdraggable: false,
        border: true,
        resize: true,
        depth: 0
    }
    return { Component: Table, props }}