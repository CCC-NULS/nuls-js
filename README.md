# [NULS-JS](https://alephnuls.github.io/nuls-js/) ![Build Status](https://api.travis-ci.org/AlephNuls/nuls-js.svg?branch=master)
Isomorphic JavaScript SDK for NULS blockchain.

https://alephnuls.github.io/nuls-js/

# Install
`npm install nuls-js --save`

# Usage
```js
import NULS from 'nuls-js';

const account = new NULS.account(); // Initiate a new account

console.log(account.getAccount().address); // Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6
```

## Features
##### Account Management
 - [Create an Account](https://alephnuls.github.io/nuls-js/guide/newAccount.html#create-a-new-account)
 - [Import an Account](https://alephnuls.github.io/nuls-js/guide/newAccount.html#import-an-account)

## TODO
- Read an address balance
- Read node details
- Read address transactions
  - Token transactions
  - Node joining/leaving
  - Node reward output/input
  - Red/yellow card transactions
- Send a transaction
- Find all consensus nodes
- Find all nodes
- Find richList/mostActive addresses
- Recent transactions

# License
See the [LICENSE](./LICENSE) file for details.
