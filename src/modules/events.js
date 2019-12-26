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
events['translation_event'] = ++e

e = 49
events['e_global'] = ++e
events['user_header'] = ++e
events['user_list'] = ++e
events['user_mutate'] = ++e

events['schema_header'] = ++e
events['schema_list'] = ++e
events['schema_mutate'] = ++e

events['translation_header'] = ++e
events['translation_list'] = ++e
events['translation_mutate'] = ++e

events['session_header'] = ++e
events['session_list'] = ++e
events['session_mutate'] = ++e

events['confirm_header'] = ++e
events['confirm_list'] = ++e
events['confirm_mutate'] = ++e


events['note_header'] = ++e
events['note_list'] = ++e
events['note_mutate'] = ++e

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
events['dashboard'] = ++e

events['organization_header'] = ++e
events['organization_list'] = ++e
events['organization_mutate'] = ++e

events['project_header'] = ++e
events['project_list'] = ++e
events['project_mutate'] = ++e



events['group_header'] = ++e
events['group_list'] = ++e
events['group_mutate'] = ++e

events['role_header'] = ++e
events['role_list'] = ++e
events['role_mutate'] = ++e

events['member_header'] = ++e
events['member_list'] = ++e
events['member_mutate'] = ++e

events['permission_header'] = ++e
events['permission_list'] = ++e
events['permission_mutate'] = ++e

events['color_header'] = ++e
events['color_list'] = ++e
events['color_mutate'] = ++e


events['type_header'] = ++e
events['type_list'] = ++e
events['type_mutate'] = ++e

events['priority_header'] = ++e
events['priority_list'] = ++e
events['priority_mutate'] = ++e


events['status_header'] = ++e
events['status_list'] = ++e
events['status_mutate'] = ++e

events['activity_header'] = ++e
events['activity_list'] = ++e
events['activity_mutate'] = ++e


events['doc_category_header'] = ++e
events['doc_category_list'] = ++e
events['doc_category_mutate'] = ++e

events['announcement_header'] = ++e
events['announcement_list'] = ++e
events['announcement_mutate'] = ++e

events['news_header'] = ++e
events['news_list'] = ++e
events['news_mutate'] = ++e

events['wiki_header'] = ++e
events['wiki_list'] = ++e
events['wiki_mutate'] = ++e

events['work_package_header'] = ++e
events['work_package_list'] = ++e
events['work_package_mutate'] = ++e

events['forum_header'] = ++e
events['forum_list'] = ++e
events['forum_mutate'] = ++e

events['post_header'] = ++e
events['post_list'] = ++e,
events['post_mutate'] = ++e

e = 299
events['my'] = ++e
events['schema_get'] = ++e
events['my_schema_mutate'] = ++e
events['fields_schema_get'] = ++e
events['fields_schema_mutate'] = ++e
events['form_schema_get'] = ++e
events['form_schema_mutate'] = ++e