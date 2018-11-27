export const HASH_LENGTH = 34;
export const ADDRESS_LENGTH = 23;
export const PRIVATE_KEY_LENGTH = 66;
export const MAX_COIN_SIZE = HASH_LENGTH + 2 + 8 + 6;

export const COIN_UNIT = 100000000;
export const CHEAP_UNIT_FEE = 100000;
// const CHEAP_UNIT_FEE = 110000
export const UNIT_FEE = 1000000;
export const KB = 1024;

export const PLACE_HOLDER = Buffer.from([255, 255, 255, 255]);

// http://dev.nuls.io/protocol/transaction.html#ID-%E5%AE%9A%E4%B9%89
export enum TransactionType {
  Reward = 1,     // consensus reward
  Transfer = 2,   // transfer transaction
  Aliased = 3,    // set alias
  Register = 4,   // register consensus node
  Deposit = 5,    // join consensus
  Withdraw = 6,   // cancel consensus
  YellowCard = 7, // yellow card
  RedCard = 8,    // red card
  Unregister = 9, // unregister consensus node
}

export enum TransactionStatus {
  UnspentFree = 0,
  UnspentLocked = 1,
  Unspent = 2,
  Spent = 3,
}
