declare const process
const backend_conf = {
  http_proto: location.protocol,
  domain: window.location.hostname,
  port:
    location.protocol == 'http:'
      ? process.env.NODE_ENV == 'development'
        ? ':8500'
        : ''
      : process.env.NODE_ENV == 'development'
      ? ':8504'
      : '',
  ws_proto: location.protocol == 'http:' ? 'ws' : 'wss'
}
//export const product_img_url = `${backend_conf.http_proto}://${backend_conf.domain}:${backend_conf.port}/http/v1/user/download_id`
//export const thumb_url = `${backend_conf.http_proto}://${backend_conf.domain}:${backend_conf.port}/http/v1/user/thumb_id`
export const WS_PATH = `${backend_conf.ws_proto}://${backend_conf.domain}${backend_conf.port}/todo`
