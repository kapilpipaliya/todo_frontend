import { notification } from './store'

export function send(message: string, type = 'default', timeout: number) {
  notification.set({ type, message, timeout })
}

export function danger(msg: string, timeout: number) {
  send(msg, 'danger', timeout)
}

export function warning(msg: string, timeout: number) {
  send(msg, 'warning', timeout)
}

export function info(msg: string, timeout: number) {
  send(msg, 'info', timeout)
}

export function success(msg: string, timeout: number) {
  send(msg, 'success', timeout)
}
