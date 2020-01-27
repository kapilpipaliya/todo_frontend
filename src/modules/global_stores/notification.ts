// use function directly on ws_dispatcher..
import { writable, S } from '../index'
import { event_type as et, events as e } from '../events'
//import { notifier } from '@beyonk/svelte-notifications'

export const notification = writable({})

S.bind$(e.notification_event, (d) => {
    //notifier.danger('hello', 7000) }
  }, 1)

