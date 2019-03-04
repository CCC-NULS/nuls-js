# Alias transaction

The alias transaction allow us to give an alias to our accounts, we have to pay a __fixed fee of 1 NULS__ for doing this operation (apart from the 
common transaction size fee). The only thing needed to be configured is:

- `".alias(address: string, alias: string)"` The _address_ of the account to be aliased and the _alias_ itself as plain text

```typescript
import { AliasTransaction, TransactionReceipt, TransactionConfig, Utxo, UTXO } from 'nuls-js';

const fromAddress: string = 'TTatokAfGRC6ACmqaoXqWniAEwqSvzrc';
const privateKey: string = '040b12fa6405badc1328904f05ef45e89e0606cfe4f03cd5f97bf20a04611c74';

const transactionConfig: TransactionConfig = {
  api: {
    host: 'https://explorer.nuls.services'
  }
};

const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

const tx = AliasTransaction
  .fromUtxos(utxos)
  .config(transactionConfig)
  .alias(fromAddress, 'My nuls account')
  .sign(privateKey);

console.log(tx.getType());
// 3

const txReceipt: TransactionReceipt = await tx.send();
```

::: tip
We dont need to set up a change address, it will be implicitly setted by calling the `.alias()` method.
If you want to override it, just call then `.change()` method as usually.
:::