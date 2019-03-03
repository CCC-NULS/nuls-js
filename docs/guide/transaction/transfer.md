# Transfer transaction

The transfer transaction is the most basic transaction that we can make in the NULS blockchain. It is used to 
transfer nuls from one account to other accounts. We can use the following methods to configure it:

- `".to(address: string, amount: number)"` Send _amount_ NULS to the account identified by _address_.
- `".remark(remark: string)"` Add a _remark_ in plain text to the transaction.

```typescript
import { TransferTransaction, nulsToNa, TransactionReceipt, TransactionConfig, Utxo, UTXO } from 'nuls-js';

const fromAddress: string = 'TTatokAfGRC6ACmqaoXqWniAEwqSvzrc';
const privateKey: string = '040b12fa6405badc1328904f05ef45e89e0606cfe4f03cd5f97bf20a04611c74';
const toAddress: string = 'TTaisi5BDnwooxFZg5D8vLktSuSrHtpS';
const anotherAddress: string = 'TTattJmAz28RNH95VsRqnGNRhvKAV5Fj';

const transactionConfig: TransactionConfig = {
  api: {
    host: 'https://explorer.nuls.services'
  }
};

const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

const tx = TransferTransaction
  .fromUtxos(utxos)
  .config(transactionConfig)
  .change(fromAddress)
  .to(toAddress, nulsToNa(1.7))
  .to(anotherAddress, nulsToNa(7))
  .remark('test transfer :)')
  .sign(privateKey);

console.log(tx.type());
// 2

const txReceipt: TransactionReceipt = await tx.send();
```