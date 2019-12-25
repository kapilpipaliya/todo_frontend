// use function directly on ws_dispatcher..
import { writable } from 'svelte/store'
import { S } from '../functions.js'
import {event_type as et, events as e } from '../events.js'
import { navigateTo } from 'svelte-router-spa'

// when logout every pages should be redirect to login page.
export const navigation = new writable()


S.bind$( [et.get, e.account, e.redirection_event, 0],
	function(data) {
	  //goto(data[0])
	  navigateTo(data[0][0])
	},
	1
)
