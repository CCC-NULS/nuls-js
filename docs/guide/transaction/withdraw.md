# Withdraw transaction

The withdraw transaction or unstake transaction is part of the NULS __proof of credit (POC)__ consensus and will allow us to unlock an amount of NULS previously deposited from some agent node. We can use the following methods to set it up:

- `".address(address: string)"` The _address_ of the account that will receive the the deposit back. (It can be different than the address that did the deposit)
- `".depositHash(hash: string)"` The _hash_ of the transaction where the deposit was effectuated
- `".deposit(amount: number)"` The amount of NULS (in NA's) that was _deposited_ in the agent node. (Must be exactly the same amount that was deposited)

```typescript
import { WithdrawTransaction, nulsToNa, TransactionReceipt, TransactionConfig, Utxo, UTXO } from 'nuls-js';

const stakerPrivateKey: string = '040b12fa6405badc1328904f05ef45e89e0606cfe4f03cd5f97bf20a04611c74';
const depositHash: string = '002036fdad7ac344e74a6f7c0fd65de4e99b8e52dbdefe7cf7bf92c803c4b347a6ec';
const newAccount: string = 'TTaisi5BDnwooxFZg5D8vLktSuSrHtpS';


const transactionConfig: TransactionConfig = {
  api: {
    host: 'https://explorer.nuls.services'
  }
};

const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

const tx = WithdrawTransaction
  .fromUtxos(utxos)
  .config(transactionConfig)
  .address(newAccount)
  .depositHash(depositHash)
  .deposit(nulsToNa(2000))
  .sign(stakerPrivateKey);

console.log(tx.getType());
// 6

const txReceipt: TransactionReceipt = await tx.send();
```

::: warning
The transaction must be signed by the account that did the deposit. In other words, we have to provide the __private key__ of the account
that did the deposit and exactly the same __amount__ that was deposited, but we can set up a different __address__ that will receive the funds back.
:::
