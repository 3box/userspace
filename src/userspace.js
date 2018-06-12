const MuPort = require('muport-core')
const bip39 = require('bip39')
const store = require('store')
const XMLHttpRequest = (typeof window !== 'undefined') ? window.XMLHttpRequest : require('xmlhttprequest').XMLHttpRequest

const CALEUCHE_URL = 'https://api.uport.space/caleuche/v1/event/'

class UserSpace {

  /**
   * Instantiates a user space
   *
   * @param     {MuPort}    muDID                   A MuPort DID instance
   * @return    {UserSpace}                         self
   */
  constructor (muDID, opts = {}) {
    this.muDID = muDID
    this.previous = null
    if (store.get(this.muDID.getDid())) {
      this.items = JSON.parse(store.get(this.muDID.getDid()))
    } else {
      this.items = {}
    }
  }

  /**
   * Opens the user space associated with the given address
   *
   * @param     {String}    address                 an ethereum address
   * @return    {UserSpace}                         the userspace instance for the given address
   */
  static async open (address) {
    console.log('user', address)
    let muDID
    let serializedMuDID = store.get('serializedMuDID_' + address)
    if (serializedMuDID) {
      muDID = new MuPort(serializedMuDID)
    } else {
      const entropy = (await authUser(address)).slice(2, 34)
      const mnemonic = bip39.entropyToMnemonic(entropy)
      muDID = await MuPort.newIdentity(null, null, {
        externalMgmtKey: address,
        mnemonic
      })
      store.set('serializedMuDID_' + address, muDID.serializeState())
    }
    console.log('userspace opened with', muDID.getDid())
    let userspace = new UserSpace(muDID)
    await userspace.sync()
    return userspace
  }

  /**
   * Get the value of the given key
   *
   * @param     {String}    key                     the key
   * @return    {String}                            the value associated with the key
   */
  async get (key) {
    await this.sync()
    return this.items[key]
  }

  /**
   * Get all of the items in the userspace
   *
   * @return    {Object}                            an object containing all items
   */
  async getAll () {
    await this.sync()
    return this.items
  }

  /**
   * Set a value for the given key
   *
   * @param     {String}    key                     the key
   * @param     {String}    value                   the value
   * @return    {Boolean}                           true if successful
   */
  async set (key, value) {
    await this.postEvent({ key, value })
    return true
  }

  /**
   * Remove the value for the given key
   *
   * @param     {String}    key                     the key
   * @return    {Boolean}                           true if successful
   */
  async remove (key) {
    await this.postEvent({ key, deleted: true })
    return true
  }

  async sync () {
    const authToken = await this.muDID.signJWT({ previous: null })
    const events = (await request(CALEUCHE_URL, 'GET', authToken)).data.events

    if (events.length > 0) {
      this.previous = events[events.length - 1].hash
      const items = events.map(event => {
        const [ciphertext, nonce] = event.event.split('.')
        const item = JSON.parse(this.muDID.symDecrypt(ciphertext, nonce))
        if (item.key && item.value) {
          this.items[item.key] = item.value
        } else if (item.deleted && item.key) {
          delete this.items[item.key]
        }
      })
    }
  }

  clearCache () {
    store.remove('serializedMuDID_' + this.muDID.getDidDocument().managementKey)
  }

  async postEvent (payload) {
    const encrypted = this.muDID.symEncrypt(JSON.stringify(payload))
    const event_token = await this.muDID.signJWT({
      previous: this.previous,
      event: encrypted.ciphertext + '.' + encrypted.nonce
    })
    this.previous = (await request(CALEUCHE_URL, 'POST', {event_token})).data.id
    console.log('added event with id', this.previous)
  }
}
module.exports = UserSpace

function authUser (from) {
  var text = 'Open UserSpace'
  var msg = '0x' + Buffer.from(text, 'utf8').toString('hex')
  var params = [msg, from]
  var method = 'personal_sign'
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      method,
      params,
      from,
    }, function (err, result) {
      if (err) reject(err)
      if (result.error) reject(result.error)
      resolve(result.result)
    })
  })
}

function request (url, method, payload) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.timeout !== 1) {
        if (request.status !== 200) {
          console.log(request)
          reject(request.responseText)
        } else {
          try {
            resolve(JSON.parse(request.response))
          } catch (jsonError) {
            reject(`[userspace] while parsing data: '${String(request.responseText)}', error: ${String(jsonError)}`)
          }
        }
      }
    }
    request.open(method, url)
    //request.setRequestHeader('accept', 'application/json')
    request.setRequestHeader('accept', '*/*')
    if (method === 'POST') {
      request.setRequestHeader('Content-Type', `application/json`)
      request.send(JSON.stringify(payload))
      //request.send(payload)
    } else {
      request.setRequestHeader('Authorization', `Bearer ${payload}`)
      request.send()
    }
  })
}
