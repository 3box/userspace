# UserSpace

**Warning:** This project is under active development, APIs are subject to change.

This is a library which allows you to set, get, and remove data associated with an ethereum account. It can be used to store identity data, user settings, etc. by dapps that use a web3 enabled browser. The data will be retrievable as long as the user has access to the private key for the used ethereum account. Data is backed up using an [identity hub](https://github.com/decentralized-identity/hubs/blob/master/explainer.md).

Take a look at the [demo](https://developer.uport.me/userspace/example/) to get a feeling of how it works!

## Usage
Simply install using npm
```
$ npm install userspace
```
and then import into your project
```js
const UserSpace = require('userspace')

UserSpace.open(web3.eth.accounts[0]).then(userspace => {
  // Code goes here...
})
```

