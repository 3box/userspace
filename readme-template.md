# UserSpace ![](./userspace.png)

**Warning:** This project is under active development, APIs are subject to change.

This is a library which allows you to set, get, and remove private data associated with an ethereum account. It can be used to store identity data, user settings, etc. by dapps that use a web3 enabled browser. The data will be retrievable as long as the user has access to the private key for the used ethereum account. Data is backed up using an [identity hub](https://github.com/decentralized-identity/hubs/blob/master/explainer.md). Currently data is stored on the uPort caleuche hub service, but the plan is to enable users to choose which hub to use. The data is encrypted and can not be read by any third party that the user hasn't authorized. Currently it supports one shared space which all dapps can access. In the future there will be support for more granular access control using namespaces.

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

