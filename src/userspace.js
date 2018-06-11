const MuPort = require('muport-core')
const bip39 = require('bip39')
const store = require('store')
const XMLHttpRequest = (typeof window !== 'undefined') ? window.XMLHttpRequest : require('xmlhttprequest').XMLHttpRequest

const CALEUCHE_URL = 'https://api.uport.space/caleuche/v1/event/'

class UserSpace {

  /**
   * Instantiates a user space
   *
   * @param     {Object}    [opts]                  optional parameters
   * @param     {Object}    opts.rpcProvider        an ethereum rpc provider
   * @param     {Object}    opts.user               an instance of a muport identity
   * @return    {UserSpace}                         self
   */
  constructor (muDID, opts = {}) {
    this.muDID = muDID
  }

  static async open (address) {
    console.log(address)
    let muDID
    let serializedMuDID = store.get('serializedMuDID_' + address)
    if (serializedMuDID) {
      muDID = new MuPort(serializedMuDID)
    } else {
      const entropy = (await authUser(address)).slice(2, 34)
      const mnemonic = bip39.entropyToMnemonic(entropy)
      const opts = {
        externalMgmtKey: address,
        mnemonic
      }
      muDID = await MuPort.newIdentity({name:"asdf"}, null, opts)
      store.set('serializedMuDID_' + address, muDID.serializeState())
    }
    console.log(muDID.getDid())
    return new UserSpace(muDID)
  }

  async getItems(opts = {}) {
    // opts.page
    // opts.numItems
    const authToken = await this.muDID.signJWT({ previous: null })
    console.log(authToken)
    //const ver = await this.muDID.verifyJWT(event_token)
    //console.log(ver)
    await request(CALEUCHE_URL, 'GET', authToken)
  }

  async addItem (item) {
    const encrypted = this.muDID.symEncrypt(JSON.stringify(item))
    console.log(encrypted)
    const event_token = await this.muDID.signJWT({
      previous: null,
      event: encrypted.ciphertext + '.' + encrypted.nonce
    })
    console.log(event_token)
    //const ver = await this.muDID.verifyJWT(event_token)
    //console.log(ver)
    //await request(CALEUCHE_URL, 'POST', {event_token: 'asdfasdf'})
    await request(CALEUCHE_URL, 'POST', {event_token})
    //await request(CALEUCHE_URL, 'GET', {event_token})
  }

  async removeItem (itemId) {
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
    console.log(url)
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.onreadystatechange = () => {
        console.log(request)
      if (request.readyState === 4 && request.timeout !== 1) {
        if (request.status !== 200) {
          //console.log(request)
          //reject(`[userspace] status ${request.status}: ${request.responseText}`)
        } else {
          //console.log(request)
          //try {
            //resolve(JSON.parse(request.responseText))
          //} catch (jsonError) {
            //reject(`[userspace] while parsing data: '${String(request.responseText)}', error: ${String(jsonError)}`)
          //}
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
