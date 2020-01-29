// https://github.com/weyos/storage-db
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API#See_also
// https://github.com/mdn/indexeddb-examples

const openDB = Symbol('openDB')
const db = Symbol('db')
const putData = Symbol('putData')
const getData = Symbol('getData')
const removeData = Symbol('removeData')
const removeDB = Symbol('removeDB')

/**
 * @param {dbName} string database name
 * @param {version} number database version number
 * @description Initialize indexDB
 */
export default class Storage {
  public dbName: string
  public storeName: string
  public dbVersion: number
  constructor(dbName:string, dbVersion:number) {
    this.dbName = dbName
    this.storeName = dbName
    this.dbVersion = dbVersion
    this[db] = null
  }
  // Open or create a database
  [openDB]() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)
      request.onerror = err => {
        reject(err)
      }
      request.onsuccess = () => {
        this[db] = request.result
        resolve(this[db])
      }
      request.onupgradeneeded = event => {
        this[db] = event.target["result"]
        if (!this[db].objectStoreNames.contains(this.storeName)) {
          const newStore = this[db].createObjectStore(this.storeName, {
            keyPath: 'id',
          })
          newStore.transaction.oncomplete = () => {
            resolve(this[db])
          }
          newStore.transaction.onerror = err => {
            reject(err)
          }
        } else {
          resolve(this[db])
        }
      }
    })
  }
  // new and update
  [putData](key:string, value) {
    return new Promise((resolve, reject) => {
      const store = this[db]
        .transaction([this.storeName], 'readwrite')
        .objectStore(this.storeName)
      const request = store.put({
        id: key,
        value,
      })
      request.onsuccess = () => {
        resolve(this[db])
      }
      request.onerror = err => {
        reject(err)
      }
    })
  }

  // retrieve data
  [getData](key:string) {
    return new Promise((resolve, reject) => {
      const store = this[db]
        .transaction([this.storeName])
        .objectStore(this.storeName)
      const request = store.get(key)
      request.onsuccess = e => {
        resolve(e.target.result)
      }
      request.onerror = err => {
        reject(err)
      }
    })
  }
  // delete data
  [removeData](key:string) {
    const store = this[db]
      .transaction([this.storeName], 'readwrite')
      .objectStore(this.storeName)
    const request = store.delete(key)
    request.onsuccess = e => {
      /// resolve(this[db])  //// must fix this
    }
    request.onerror = err => {
      /// reject(err) /// must fix this
    }
  }
  // delete the database
  [removeDB](dbName:string) {
    indexedDB.deleteDatabase(dbName)
  }
  /**
   * @param {key} string
   * @param {value} any
   * @description insert data
   */
  async setItem(key:string, value) {
    if (!this[db]) {
      this[db] = await this[openDB]()
    }
    await this[putData](key, value)
    return this[db]
  }
  /**
   * @param {key} string
   * @description Get data
   */
  async getItem(key:string) {
    if (!this[db]) {
      this[db] = await this[openDB]()
    }
    const data = await this[getData](key)
    return data
  }
  /**
   * @param {key} string
   * @description delete data
   */
  async removeItem(key:string) {
    if (!this[db]) {
      this[db] = await this[openDB]()
    }
    await this[removeData](key)
  }
  /**
   * @param {dbName} string
   * @description delete database
   */
  removeDB(dbName:string) {
    this[removeDB](dbName)
  }

  // process cursor
  async processCursor(func) {
    if (!this[db]) {
      this[db] = await this[openDB]()
    }
    const store = this[db]
      .transaction([this.storeName], 'readwrite')
      .objectStore(this.storeName)
    store.openCursor().onsuccess = function(event) {
      var cursor = event.target.result
      func(cursor)
    }
  }
}
