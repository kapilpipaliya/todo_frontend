export enum event_type { get = 1, mutate, subscribe, unsubscribe };

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

  account = 40,

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
  subscribe_test,
  triggering_test,

  admin = 60,
  dashboard,

  organization_list,
  organization_mutate,

  project_list,
  project_mutate,

  group_list,
  group_mutate,

  role_list,
  role_mutate,

  org_group_list,
  org_group_mutate,

  org_role_list,
  org_role_mutate,

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

  my = 120,
  schema_get,
  my_schema_mutate,
  fields_schema_get,
  fields_schema_mutate,
  form_schema_get,
  form_schema_mutate,

  e_organization = 140,

  e_project = 160
}

class UniqueNumber {
  private id_ = 0
  get id(){
    return ++this.id_
  }
}

export const Unique = new UniqueNumber()

export const form_schema_evt = (id) => [event_type.get, events.my, events.form_schema_get, id ]
