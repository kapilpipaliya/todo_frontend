import {S} from './ws_events_dispatcher'
export enum ET { get = 1, subscribe, unsubscribe, insert, update, delete_ };
export enum E {
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

  global_color_list,
  global_color_mutate,

  global_role_list,
  global_role_mutate,

  global_permission_list,
  global_permission_mutate,

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

  account = 60,

  register_user,
  register_member,
  login,
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

  /*mutate_member_setting,
  save_work_package_setting,
  save_custom_fields,
  save_system_setting,
  save_email_setting,
  save_auth_setting,*/

  my = 140,
  schema_get,
  my_schema_mutate,
  fields_schema_mutate,
  form_schema_get,
  form_schema_mutate

}
export const form_schema_evt = (id) => [ET.get, E.form_schema_get, id ]
// generate event from schema:
export const schemaEvents = (schema: string) => {
  const h = E[`${schema}_list`]
  if(h){
    return [ E[`${schema}_list`], E[`${schema}_mutate`] ]
  } else if(schema == 'register'){
    return [null, E.register_user ]
  } else if(schema == 'login'){
    return [null, E.login ]
  } else if(schema == 'member_setting'){
    return [null, E.setting_mutate ]
  } else if(schema == 'work_package_setting'){
    return [null, E.setting_mutate ]
  } else if(schema == 'custom_fields'){
    return [null, E.setting_mutate ]
  } else if(schema == 'system_setting'){
    return [null, E.setting_mutate ]
  } else if(schema == 'email_setting'){
    return [null, E.setting_mutate ]
  } else if(schema == 'auth_setting'){
    return [null, E.setting_mutate ]
  }
}
