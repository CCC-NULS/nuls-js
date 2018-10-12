const nuls = require('./../dist/nuls-js.cjs.js');

const account = new nuls.core.account.NewAccount();

console.log(account.getAccount());
