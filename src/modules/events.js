export const event_type = {}
event_type[(event_type['get'] = 1)] = 'get'
event_type[(event_type['mutate'] = 2)] = 'mutate'
event_type[(event_type['subscribe'] = 3)] = 'subscribe'
event_type[(event_type['unsubscribe'] = 4)] = 'unsubscribe'

export const events = {}
let e = 0
events['css_event'] = ++e
events['notification_event'] = ++e
events['cookie_event'] = ++e
events['redirection_event'] = ++e

e = 49
events['e_global'] = ++e
events['global_user_header'] = ++e
events['global_user_list'] = ++e
events['global_user_mutate'] = ++e

events['global_schema_header'] = ++e
events['global_schema_list'] = ++e
events['global_schema_mutate'] = ++e

events['global_translation_header'] = ++e
events['global_translation_list'] = ++e
events['global_translation_mutate'] = ++e

events['global_session_header'] = ++e
events['global_session_list'] = ++e
events['global_session_mutate'] = ++e

events['global_confirm_header'] = ++e
events['global_confirm_list'] = ++e
events['global_confirm_mutate'] = ++e


events['global_note_header'] = ++e
events['global_note_list'] = ++e
events['global_note_mutate'] = ++e

e = 99
events[(events['account'] = ++e)] = 'account'
events[(events['register_user'] = ++e)] = 'register_user'
events[(events['register_member'] = ++e)] = 'register_member'
events[(events['login'] = ++e)] = 'login'
events[(events['logout'] = ++e)] = 'logout'
events[(events['confirm_email'] = ++e)] = 'confirm_email'
events[(events['confirm_email_status'] = ++e)] = 'confirm_email_status'
events[(events['save_user_settings'] = ++e)] = 'save_user_settings'
events[(events['get_menu'] = ++e)] = 'get_menu'
events[(events['update_password'] = ++e)] = 'update_password'
events[(events['update_member'] = ++e)] = 'update_member'
events[(events['modify_profile'] = ++e)] = 'modify_profile'
events[(events['is_logged_in'] = ++e)] = 'is_logged_in'
events[(events['subscribe_test'] = ++e)] = 'subscribe_test'
events[(events['trigger_test'] = ++e)] = 'trigger_test'


e = 199
events['admin'] = ++e
events['admin_dashboard'] = ++e

events['admin_org_header'] = ++e
events['admin_org_list'] = ++e
events['admin_org_mutate'] = ++e

events['admin_member_header'] = ++e
events['admin_member_list'] = ++e
events['admin_member_mutate'] = ++e

events['admin_group_header'] = ++e
events['admin_group_list'] = ++e
events['admin_group_mutate'] = ++e

events['admin_role_header'] = ++e
events['admin_role_list'] = ++e
events['admin_role_mutate'] = ++e

events['admin_permission_header'] = ++e
events['admin_permission_list'] = ++e
events['admin_permission_mutate'] = ++e

events['admin_type_header'] = ++e
events['admin_type_list'] = ++e
events['admin_type_mutate'] = ++e

events['admin_status_header'] = ++e
events['admin_status_list'] = ++e
events['admin_status_mutate'] = ++e

events['admin_activity_header'] = ++e
events['admin_activity_list'] = ++e
events['admin_activity_mutate'] = ++e

events['admin_priority_header'] = ++e
events['admin_priority_list'] = ++e
events['admin_priority_mutate'] = ++e

events['admin_doc_category_header'] = ++e
events['admin_doc_category_list'] = ++e
events['admin_doc_category_mutate'] = ++e

events['admin_announcement_header'] = ++e
events['admin_announcement_list'] = ++e
events['admin_announcement_mutate'] = ++e

events['admin_color_header'] = ++e
events['admin_color_list'] = ++e
events['admin_color_mutate'] = ++e

e = 299
events['my'] = ++e
events['my_schema_get'] = ++e
events['my_schema_mutate'] = ++e
events['my_fields_schema_get'] = ++e
events['my_fields_schema_mutate'] = ++e
events['my_form_schema_get'] = ++e
events['my_form_schema_mutate'] = ++e