// use function directly on ws_dispatcher..
import { writable } from 'svelte/store';
import { ET, E } from './enums';
import { Ws } from './ws_events_dispatcher';
/**
 * store used to save basic info of logged in memeber.
 *
 */
export const current_member = writable({});
Ws.bind$(
  [ET.get, E.current_member_event, 0],
  function (data: [[]]) {
    current_member.set(data);
  },
  1
);

/**
 * Member Settings:
 * Store to save various ui preferences for logged in member
 * \todo implement this
 */
export const member_settings = writable({});

/* todo: when logout every pages should be redirect to login page. */
