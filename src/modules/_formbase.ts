import { writable, get } from 'svelte/store'

import { notifier } from '../routes/components/svelte-notifications/src/index.js'
import { goto } from '@sapper/app'
import { getCookieValue } from './functions.ts'
//fix when i press two times submit main table not show data
//on Edit page if error happens its not displayed.
//extra : when delete button should be disables
// ask : when base class has bind a method:`this.fetch = this.fetch.bind(this);` does derived class automatically bind this method too?
// svelte-js forms : validateOnChange='{true}' is default but its not working.
// on table if i use index +each('displayData as row (row.getUid())') table not update when fetch new data.
/*
when derive do:
on Constructor
1.define this.schema = yup schema
2.implement toInitialValues(m) => object
3.implement onFetch()
4.implement onSubmit(values)
5.implement onDelete(m)
 */
export class CRUDBase {
  constructor() {
    this.data = writable({}) // now support multiple datas.
    this.er = writable('')
    this.initialValues = writable({})
    this.pageSize = writable(10)
    this.totalPages = writable(1)
    this.currentPage = writable(1)
    this.count = writable(0)

    this.title_name = 'User'

    this.fetch = this.fetch.bind(this)
    this.onFetch = this.onFetch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.onNewClick = this.onNewClick.bind(this)
    this.toInitialValues = this.toInitialValues.bind(this)
    this.setInitialValues = this.setInitialValues.bind(this)
    this.onEditClick = this.onEditClick.bind(this)
    this.deleteClick = this.deleteClick.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.showRpcError = this.showRpcError.bind(this)
    this.handleError = this.handleError.bind(this)
    this.getMeta = this.getMeta.bind(this)
    this.mutateSuccess = this.mutateSuccess.bind(this)
    this.deleteSuccess = this.deleteSuccess.bind(this)
    this.muCallback = this.muCallback.bind(this)
    this.muCallbackInform = this.muCallbackInform.bind(this)
    this.delCallback = this.delCallback.bind(this)
    this.setData = this.setData.bind(this)
    this.getCallback = this.getCallback.bind(this)
    this.getReq = this.getReq.bind(this)
    this.setPaginate = this.setPaginate.bind(this)
    this.refetch = this.refetch.bind(this)
  }

  handleReset() {
    console.log('form has been reset')
  }

  onNewClick() {
    this.initialValues.set({})
  }

  onEditClick(m) {
    return () => {
      this.setInitialValues(m)
    }
  }

  // static function
  setUidArray(req, uids) {
    if (uids) {
    }
  }

  showRpcError(error) {
    if (error) {
      this.er.set(JSON.stringify(error))
      return true
    } else {
      return false
    }
  }

  handleError(response, message, notify = 0) {}

  //static function
  isOk(response) {}

  deleteClick(m) {
    return () => {
      this.onDelete(m)
    }
  }

  s() {
    //return A.yup.string();
  }

  setInitialValues(m) {
    this.initialValues.set(this.toInitialValues(m))
  }

  getMeta() {
    return { bearer: getCookieValue('time') }
  }

  //static function
  goBack() {
    window.history.back()
  }

  //static function
  goBackOrNavigate(path) {
    if (window.history.length === 1) {
      goto('/admin/users')
    } else {
      this.goBack()
    }
  }

  mutateSuccess(uid, msg, path, name = 'index') {
    {
      const value = get(this.data)
      value[name] = []
      this.data.set(value)
    }
    if (!uid) {
      msg = 'New ' + msg + ' Created'
    } else {
      msg = msg + ' Updated'
    }
    notifier.success(msg)
    this.goBackOrNavigate(path)
  }

  deleteSuccess(msg, name = 'index') {
    {
      const value = get(this.data)
      value[name] = []
      this.data.set(value)
    }
    this.onFetch(...this.arguments)
    notifier.success(msg)
  }

  muCallback(uid, msg, path, setSubmitting) {
    return (err, res) => {
      setSubmitting(false)
      if (this.showRpcError(err)) {
      } else if (this.isOk(res)) {
        this.mutateSuccess(uid, msg, path)
      } else this.handleError(res, '', 0)
    }
  }
  // only inform to the user
  muCallbackInform(msg, setSubmitting) {
    return (err, res) => {
      setSubmitting(false)
      if (this.showRpcError(err)) {
      } else if (this.isOk(res)) {
        notifier.success(msg)
      } else this.handleError(res, '', 0)
    }
  }

  delCallback(msg, path) {
    return (err, res) => {
      if (this.showRpcError(err)) {
      } else if (this.isOk(res)) {
        this.deleteSuccess(msg)
      } else this.handleError(res, '', 4)
    }
  }

  setData(uids, list, res, name = 'index') {
    {
      const value = get(this.data)
      value[name] = list
      this.data.set(value)
    }
    if (uids) {
      this.setInitialValues(list[0])
      return
    }
    //const res = new A.messages.ColorRes();
    const p = res.getPaginate()
    this.count.set(p.getCount())
    const total_pages = Math.ceil(p.getCount() / p.getFirst())
    if (get(this.pageSize) != p.getFirst()) {
      this.pageSize.set(p.getFirst())
    }
    if (get(this.totalPages) != total_pages) {
      this.totalPages.set(total_pages)
    }

    let currentPage
    // currentPage will not be greater than total_page, but server will take care of it.
    if (p.getOffset() == 0) {
      currentPage = 1
    } else {
      currentPage = Math.ceil(p.getOffset() / p.getFirst()) + 1
    }
    if (get(this.currentPage) != currentPage) {
      this.currentPage.set(currentPage)
    }
  }

  getCallback(runFunction) {
    return (err, res) => {
      if (this.showRpcError(err)) {
      } else if (this.isOk(res)) {
        runFunction(res)
      } else this.handleError(res, '', 0)
    }
  }

  getReq(Class, uids, p) {
    if (uids && !Array.isArray(uids)) {
      throw 'uids must be array'
    }
    // also check that each uid start with 0x
    const req = new Class()
    this.setUidArray(req, uids)
    req.setPaginate(p)
    return req
  }

  handleSubmit({ detail: { values, setSubmitting, resetForm } }) {
    this.er.set('')
    setSubmitting(true)
    return this.onSubmit(...arguments)
  }

  fetch() {
    //saveForLater(arguments)
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
    this.arguments = arguments
    this.onFetch(...arguments)
  }

  setPaginate(history) {
    const params = new URLSearchParams(history.location.search.slice(1))
    //console.log(Object.fromEntries(params.entries()))
    this.pageSize.set(Number(params.get('size')) || 25)
    this.totalPages.set(Number(params.get('totalPages')) || 1)
    this.currentPage.set(Number(params.get('currentPage')) || 1)
  }

  refetch(history) {
    return (s, cp) => {
      //p.setFirst(s);
      //p.setOffset(s * ((cp - 1)));
      this.fetch(p)
      history.replace(`?size=${s}&currentPage=${cp}`, {})
    }
  }
}
