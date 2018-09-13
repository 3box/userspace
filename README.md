
# We've Moved to 3Box DB!
---
---
---


#### ⚠️ This project has moved to a new home. Visit us at [3Box DB](https://www.github.com/uport-project/3box).


---
---
---

# UserSpace ![](./userspace.png)

**Warning:** This project has been deprecated. Follow along at https://www.github.com/uport-project/3box for the active project.

*This is a library which allows you to set, get, and remove private data associated with an ethereum account. It can be used to store identity data, user settings, etc. by dapps that use a web3 enabled browser. The data will be retrievable as long as the user has access to the private key for the used ethereum account. Data is backed up using an [identity hub](https://github.com/decentralized-identity/hubs/blob/master/explainer.md). Currently data is stored on the uPort caleuche hub service, but the plan is to enable users to choose which hub to use. The data is encrypted and can not be read by any third party that the user hasn't authorized. Currently it supports one shared space which all dapps can access. In the future there will be support for more granular access control using namespaces.*

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

<a name="UserSpace"></a>

## UserSpace
**Kind**: global class  

* [UserSpace](#UserSpace)
    * [new UserSpace(muDID)](#new_UserSpace_new)
    * _instance_
        * [.get(key)](#UserSpace+get) ⇒ <code>String</code>
        * [.getAll()](#UserSpace+getAll) ⇒ <code>Object</code>
        * [.set(key, value)](#UserSpace+set) ⇒ <code>Boolean</code>
        * [.remove(key)](#UserSpace+remove) ⇒ <code>Boolean</code>
    * _static_
        * [.open(address)](#UserSpace.open) ⇒ [<code>UserSpace</code>](#UserSpace)

<a name="new_UserSpace_new"></a>

### new UserSpace(muDID)
Instantiates a user space

**Returns**: [<code>UserSpace</code>](#UserSpace) - self  

| Param | Type | Description |
| --- | --- | --- |
| muDID | <code>MuPort</code> | A MuPort DID instance |

<a name="UserSpace+get"></a>

### userSpace.get(key) ⇒ <code>String</code>
Get the value of the given key

**Kind**: instance method of [<code>UserSpace</code>](#UserSpace)  
**Returns**: <code>String</code> - the value associated with the key  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | the key |

<a name="UserSpace+getAll"></a>

### userSpace.getAll() ⇒ <code>Object</code>
Get all of the items in the userspace

**Kind**: instance method of [<code>UserSpace</code>](#UserSpace)  
**Returns**: <code>Object</code> - an object containing all items  
<a name="UserSpace+set"></a>

### userSpace.set(key, value) ⇒ <code>Boolean</code>
Set a value for the given key

**Kind**: instance method of [<code>UserSpace</code>](#UserSpace)  
**Returns**: <code>Boolean</code> - true if successful  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | the key |
| value | <code>String</code> | the value |

<a name="UserSpace+remove"></a>

### userSpace.remove(key) ⇒ <code>Boolean</code>
Remove the value for the given key

**Kind**: instance method of [<code>UserSpace</code>](#UserSpace)  
**Returns**: <code>Boolean</code> - true if successful  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | the key |

<a name="UserSpace.open"></a>

### UserSpace.open(address) ⇒ [<code>UserSpace</code>](#UserSpace)
Opens the user space associated with the given address

**Kind**: static method of [<code>UserSpace</code>](#UserSpace)  
**Returns**: [<code>UserSpace</code>](#UserSpace) - the userspace instance for the given address  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>String</code> | an ethereum address |

