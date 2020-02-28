export enum event_type { get = 1, subscribe, unsubscribe, insert, update, delete_ };

export enum events {
  css_event = 1,
  notification_event,
  cookie_event,
  redirection_event,
  maintenance_event,
  translation_event,
  current_member_event,

  e_global = 20,

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

  my = 140,
  schema_get,
  my_schema_mutate,
  fields_schema_get,
  fields_schema_mutate,
  form_schema_get,
  form_schema_mutate
}

class UniqueNumber {
  private id_ = 0
  get id(){
    return ++this.id_
  }
}

export const Unique = new UniqueNumber()

export const form_schema_evt = (id) => [event_type.get, events.my, events.form_schema_get, id ]

// generate event from schema:
export const schemaEvents = (id: number | string = 0, schema: string) => {
  const h = events[`${schema}_list`]
  let e0 = 0
  if(h > 20 && h < 60){
    e0 = events.e_global
  } else if (h > 60 && h < 80) {
    e0 = events.account
  } else if (h > 80 && h < 140) {
    e0 = events.admin
  } else if (h > 140 && h < 160) {
    e0 = events.my
  }
  if(h){
    return [
        [event_type.subscribe, e0, events[`${schema}_list`], id],
        [event_type.insert, e0, events[`${schema}_mutate`], id],
      ]
  } else if(schema == 'register'){
    return [
        null,
        [event_type.insert, events.account, events.register_user, Unique.id],
      ]
  } else if(schema == 'login'){
    return [
      null,
      [event_type.insert, events.account, events.login, Unique.id],
    ]
  }
}
export const g = (e1,e2) => [event_type.get, e1, e2, Unique.id]
export const s = (e1,e2) => [event_type.subscribe, e1, e2, Unique.id]
export const i = (e1,e2) => [event_type.insert, e1, e2, Unique.id]
export const u = (e1,e2) => [event_type.update, e1, e2, Unique.id]
export const d = (e1,e2) => [event_type.delete_, e1, e2, Unique.id]