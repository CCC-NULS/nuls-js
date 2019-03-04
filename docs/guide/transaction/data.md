# Data transaction

This kind of transaction allow us to store some custom business data in the __NULS blockchain__, it is preferable to use other mechanisms to achieve this, like storing the heavy data in [IPFS](https://ipfs.io/), and just use `DataTransaction` to store the IPFS hashes that link's us to the content. To use this kind of transaction we need to use the following methods to set it up:

- `".data(data: JSON | Array | string | Buffer)"` The data to be saved in the blockchain. It can be a valid javascript `JSON` object, an `Array`, an hexadecimal `string` or a `Buffer` of bytes

```typescript
import { DataTransaction, TransactionReceipt, TransactionConfig, Utxo, UTXO } from 'nuls-js';

const address: string = 'TTatokAfGRC6ACmqaoXqWniAEwqSvzrc';
const privateKey: string = '040b12fa6405badc1328904f05ef45e89e0606cfe4f03cd5f97bf20a04611c74';

const transactionConfig: TransactionConfig = {
  api: {
    host: 'https://explorer.nuls.services'
  }
};

const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

const tx = DataTransaction
  .fromUtxos(utxos)
  .config(transactionConfig)
  .change(address)
  .data({ 
    id: 0, 
    type: 'my-business-data', 
    content: 'NULS rocks! I can store whatever I need :D'
  })
  .sign(privateKey);

console.log(tx.getType());
// 10

const txReceipt: TransactionReceipt = await tx.send();
```
