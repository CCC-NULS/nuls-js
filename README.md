# [NULS-JS](https://alephnuls.github.io/nuls-js/) [![Build Status](https://api.travis-ci.org/AlephNuls/nuls-js.svg?branch=master)](https://travis-ci.org/AlephNuls/nuls-js) [![npm version](https://badge.fury.io/js/nuls-js.svg)](https://www.npmjs.com/package/nuls-js) [![Coverage Status](https://coveralls.io/repos/github/AlephNuls/nuls-js/badge.svg?branch=master)](https://coveralls.io/github/AlephNuls/nuls-js?branch=master) 
Isomorphic JavaScript SDK for NULS blockchain.

# Warning
This project is still in early development stages. It is strongly not recommended to use this in a production environment.

# Install
```bash
$ npm i nuls-js
```

# Usage
```js
import NULS from 'nuls-js';

const account = NULS.account.create(); // Initiate a new account

console.log(account.address); // Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6
```

# Guide
https://alephnuls.github.io/nuls-js/

# Documentation
https://alephnuls.github.io/nuls-js/typedoc/index.html

# Features
##### Account Management
 - [Create an Account](https://alephnuls.github.io/nuls-js/guide/account.html#create-a-new-account)
 - [Import an Account](https://alephnuls.github.io/nuls-js/guide/account.html#import-an-account)
 - [QRCode](https://alephnuls.github.io/nuls-js/guide/QRCode.html)

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