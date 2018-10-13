# NULS-JS
Isomorphic JavaScript SDK for NULS blockchain.

# Install
`npm install nuls-js --save`

# Usage
```js
import NULS from 'nuls-js';

const account = new NULS.account(); // Initiate a new account

console.log(account.address); // Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6
```

# Features
- Create a new account
- Import an existing account

# TODO
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
