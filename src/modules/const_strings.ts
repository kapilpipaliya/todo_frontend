const dev_conf = {
  http_proto: 'http',
  domain: 'localhost',
  port: 8500,
  ws_proto: 'ws',
}
const prod_conf = {
  http_proto: 'https',
  domain: 'scesoftwares.com',
  port: 8501,
  ws_proto: 'wss',
}
export const server = dev_conf

export const product_img_url = `${server.http_proto}://${server.domain}:${server.port}/http/v1/user/download_id`
export const thumb_url = `${server.http_proto}://${server.domain}:${server.port}/http/v1/user/thumb_id`
export const ws_todo = `${server.ws_proto}://${server.domain}:${server.port}/todo`



