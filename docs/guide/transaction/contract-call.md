# Contract Call Transaction

In NULS like in other blockchains platforms, if we need to call an smart contract method that implies some __gas__ expense, we need to do it by broadcasting an special transaction. This transaction will be stored with all the related information in some block like any other kind of transactions. You can read more about the concepts of __gas price__ and __gas__ in the [smart contracts](../smart-contract/#gas-price-and-gas-limit) section of this guide.

To make the call we need to use the `ContractCallTransaction` class, and set up the transaction using the following instance methods:

- `".sender(address: string)"` The _address_ of the account calling the contract, the spent gas will be inputed to this account
- `".contractAddress(address: string)"` The _address_ of the contract instance which we are calling
- `".gasPrice(gasPrice: number)"` The price of gas in NA's, by default _25 NA_. Check the [smart contracts](../smart-contract/#gas-price-and-gas-limit) section for more info
- `".gasLimit(gasLimit: number)"` The limit of gas that we are willing to pay, by default 10000000 NA's ~ 1 NULS. Check the [smart contracts](../smart-contract/#gas-price-and-gas-limit) section for more info
- `".gas(gasLimit: number, gasPrice: number)"` We set up both, gas price and gas limit at once, by calling this method
- `".call(methodName: string, methodDesc: string, ...args: string[])"` The name, description and arguments of the contract method to call

```typescript
import { ContractCallTransaction, nulsToNa, TransactionReceipt, TransactionConfig, Utxo, UTXO } from 'nuls-js';

const contractAddress = 'TTb3ASyCBbJ6KL1PUS4gh9jWjNi3RvTK';
const fromAddress: string = 'TTatokAfGRC6ACmqaoXqWniAEwqSvzrc';
const privateKey: string = '040b12fa6405badc1328904f05ef45e89e0606cfe4f03cd5f97bf20a04611c74';

const transactionConfig: TransactionConfig = {
  api: {
    host: 'https://explorer.nuls.services'
  }
};

const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

const tx = ContractCallTransaction
  .fromUtxos(utxos)
  .config(transactionConfig)
  .contractAddress(contractAddress)
  .sender(fromAddress)
  .call('buyTickets', '', '1')        // Calling method .buyTickets('1') (passing '1' as first argument)
  .value(nulsToNa(1))                 // Sends 1 NULS to the contract
  .change(fromAddress)
  .sign(privateKey);

console.log(tx.getType());
// 101

const txReceipt: TransactionReceipt = await tx.send();
```
