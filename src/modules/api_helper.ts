import {product_img_url} from './const_strings'
import {event_type as et, events as e, Unique} from './events'
export const productImageBase = async (S, id, version = 0) => {
  if (false) {
    const url = await new Promise((resolve, reject) => {
      S.bind_(
        ['product', 'attachment_data', 0],
        data => {
          if (data instanceof Blob) {
            const url = URL.createObjectURL(data)
            resolve(url)
          } else {
            resolve('')
          }
          // const reader = new FileReader();
          // reader.onload = function(e) {
          // 	const url = e.target.result
          // 	resolve(url)
          // };
          // reader.readAsDataURL(data);
        },
        id
      )
    })
    return url
  } else {
    return `${product_img_url}/${id}/${version}`
  }
}



export const isLoggedIn = async S => {
  const auth = await new Promise((resolve, reject) => {
    S.bind_(
      [et.get, e.account, e.is_logged_in, Unique.id],
      ([d]: [[]]) => {
        resolve(d)
      },
      [[]]
    )
  })
  return auth
}