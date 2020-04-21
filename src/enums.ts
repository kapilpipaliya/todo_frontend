declare const process;
/**
 * const variable
 * process.env.NODE_ENV is replaced
 *
 */
import { writable } from 'svelte/store';
export const IS_PRODUCTION =
  // @ts-ignore
  process.env.NODE_ENV == 'development' ? false : true;
export const is_production = writable(IS_PRODUCTION);

export enum SortDirection {
  None,
  Ascending,
  Descending
}

export enum ValueType {
  None, // not yet initialized
  Illegal, // illegal value
  Null, // JSON null
  Bool,
  Array,
  Object,
  Double,
  UTCDate,
  External,
  MinKey,
  MaxKey,
  Int,
  UInt,
  SmallInt,
  String,
  Binary,
  BCD,
  Custom,
  Tagged
}
// table:
export enum DisplayType {
  UNINITIALIZED,
  Checkbox = 1,
  Number,
  Text,
  Double,
  Date,
  DateTime,
  Url,
  Color
}
export enum FormType {
  button = 1,
  checkbox,
  checkboxes,
  color,
  date,
  datetime_local,
  email,
  file,
  hidden,
  image,
  month,
  number,
  password,
  radio,
  range,
  reset,
  search,
  submit,
  tel,
  text,
  time,
  url,
  week,
  textarea,
  select,
  jsoneditor,
  internal_true_edge,
  multi_select, // enum_string
  multi_select_hidden,
  text_array,
  multi_select_bool_properties,
  flatpicker,
  WYSIWYG,
  serial,
  codemirror,
  save_time,
  inserted,
  updated,
  dropzone,
  daterange,
  cleditor,
  emoji,
  mindmap,
  mapcountries
}

export enum ET {
  get = 1,
  subscribe,
  unsubscribe,
  insert,
  update,
  replace,
  delete_,
  changePosition
}
export enum E {
  // routes
    css_event = 1,
    notification_event,
    cookie_event,
    redirection_event,
    maintenance_event,
    translation_event,
    current_member_event,
    e_global = 20,
    countries,
    languages,
    timezones,
    user_list,
    user_mutate,
    schema_list,
    schema_mutate,
    translation_list,
    translation_mutate,
    session_list,
    session_mutate,
    confirm_list,
    confirm_mutate,
    note_list,
    note_mutate,
    super_color_list,
    super_color_mutate,
    super_role_list,
    super_role_mutate,
    super_permission_list,
    super_permission_mutate,
    super_menu_list,
    super_menu_mutate,
    support_list,
    support_mutate,
    template_list,
    template_mutate,
    css_list,
    css_mutate,
    recompile_frontend,
    recompile_css,
    restart_server,
    test_mail,
    read_log,
    super_pass_check,
    css_sync_files_to_db,
    subscribe_online_users,
    collections_size,
    urlshortener,
    account = 60,
    register_user,
    register_member,
    login,
    member_login,
    logout,
    confirm_email,
    confirm_email_status,
    save_user_settings,
    get_menu,
    update_password,
    update_member,
    modify_profile,
    is_logged_in,
    change_password,
    force_password_change,
    lost_password,
    admin = 80,
    dashboard,
    organization_list,
    organization_mutate,
    project_list,
    project_mutate,
    group_list,
    group_mutate,
    role_list,
    role_mutate,
    organization_group_list,
    organization_group_mutate,
    organization_role_list,
    organization_role_mutate,
    project_group_list,
    project_group_mutate,
    project_role_list,
    project_role_mutate,
    member_list,
    member_mutate,
    permission_list,
    permission_mutate,
    menu_list,
    menu_mutate,
    color_list,
    color_mutate,
    type_list,
    type_mutate,
    priority_list,
    priority_mutate,
    status_list,
    status_mutate,
    activity_list,
    activity_mutate,
    doc_category_list,
    doc_category_mutate,
    announcement_list,
    announcement_mutate,
    news_list,
    news_mutate,
    wiki_list,
    wiki_mutate,
    work_package_list,
    work_package_mutate,
    forum_list,
    forum_mutate,
    post_list,
    post_mutate,
    setting_list,
    setting_mutate,
    my = 140,
    schema_get,
    my_schema_mutate,
    fields_schema_mutate,
    form_schema_get,
    form_schema_mutate
  // routes
}
export const form_schema_evt = (id) => [ET.get, E.form_schema_get, id];
// generate event from schema:
export const schemaEvents = (schema: string) => {
  const h = E[`${schema}_list`];
  if (h) {
    return [E[`${schema}_list`], E[`${schema}_mutate`]];
  } else if (schema == 'register') {
    return [null, E.register_user];
  } else if (schema == 'mregister') {
    return [null, E.register_member];
  } else if (schema == 'login') {
    return [null, E.login];
  } else if (schema == 'mlogin') {
    return [null, E.member_login];
  } else if (schema == 'member_setting') {
    return [null, E.setting_mutate];
  } else if (schema == 'work_package_setting') {
    return [null, E.setting_mutate];
  } else if (schema == 'custom_fields') {
    return [null, E.setting_mutate];
  } else if (schema == 'system_setting') {
    return [null, E.setting_mutate];
  } else if (schema == 'email_setting') {
    return [null, E.setting_mutate];
  } else if (schema == 'auth_setting') {
    return [null, E.setting_mutate];
  } else {
    console.warn('cant generate events for schem key: ', schema);
  }
};
export enum NotificationType {
  default_,
  info,
  success,
  warning,
  danger
}
