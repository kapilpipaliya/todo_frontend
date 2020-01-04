export enum event_type { get = 1, mutate, subscribe, unsubscribe };

export enum events {
  css_event = 1,
  notification_event,
  cookie_event,
  redirection_event,
  translation_event,
  current_member,

  e_global = 50,
  user_header,
  user_list,
  user_mutate,

  schema_header,
  schema_list,
  schema_mutate,

  translation_header,
  translation_list,
  translation_mutate,

  session_header,
  session_list,
  session_mutate,

  confirm_header,
  confirm_list,
  confirm_mutate,

  note_header,
  note_list,
  note_mutate,

  global_color_header,
  global_color_list,
  global_color_mutate,

  global_permission_header,
  global_permission_list,
  global_permission_mutate,

  account = 100,

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

  admin = 200,
  dashboard,

  organization_header,
  organization_list,
  organization_mutate,

  project_header,
  project_list,
  project_mutate,

  group_header,
  group_list,
  group_mutate,

  role_header,
  role_list,
  role_mutate,

  member_header,
  member_list,
  member_mutate,

  permission_header,
  permission_list,
  permission_mutate,

  color_header,
  color_list,
  color_mutate,

  type_header,
  type_list,
  type_mutate,

  priority_header,
  priority_list,
  priority_mutate,

  status_header,
  status_list,
  status_mutate,

  activity_header,
  activity_list,
  activity_mutate,

  doc_category_header,
  doc_category_list,
  doc_category_mutate,

  announcement_header,
  announcement_list,
  announcement_mutate,

  news_header,
  news_list,
  news_mutate,

  wiki_header,
  wiki_list,
  wiki_mutate,

  work_package_header,
  work_package_list,
  work_package_mutate,

  forum_header,
  forum_list,
  forum_mutate,

  post_header,
  post_list,
  post_mutate,

  my = 300,
  schema_get,
  my_schema_mutate,
  fields_schema_get,
  fields_schema_mutate,
  form_schema_get,
  form_schema_mutate,

  e_organization = 400,

  e_project = 500
}