# Deposit transaction

The deposit transaction or stake transaction is part of the NULS __proof of credit (POC)__ consensus and will allow us to lock an amount of NULS in the desired agent node, and to be rewarded for deposit our trust in that node. We can use the following methods to set it up:

- `".address(address: string)"` The _address_ of the account that will make the deposit
- `".agentHash(hash: string)"` The _hash_ of the agent node where the deposit will be effectuated
- `".deposit(amount: number)"` The amount of NULS (in NA's) that will be _deposited_ in the agent node (should be greater than 2k NULS)

```typescript
import { DepositTransaction, nulsToNa, TransactionReceipt, TransactionConfig, Utxo, UTXO } from 'nuls-js';

const stakerAddress: string = 'TTatokAfGRC6ACmqaoXqWniAEwqSvzrc';
const stakerPrivateKey: string = '040b12fa6405badc1328904f05ef45e89e0606cfe4f03cd5f97bf20a04611c74';
const agentHash: string = '0020e2f71ad2cef2187d9c044e82338173fb82299d00de6117bc85e07992594db863';

const transactionConfig: TransactionConfig = {
  api: {
    host: 'https://explorer.nuls.services'
  }
};

const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

const tx = DepositTransaction
  .fromUtxos(utxos)
  .config(transactionConfig)
  .address(stakerAddress)
  .agentHash(agentHash)
  .deposit(nulsToNa(2000))
  .sign(stakerPrivateKey);

console.log(tx.getType());
// 5

const txReceipt: TransactionReceipt = await tx.send();
```

::: tip
We dont need to set up a change address, it will be implicitly setted by calling the `.address()` method.
If you want to override it, just call then `.change()` method as usually.
:::

::: tip
The transaction hash of this transaction (`txReceipt.hash`) will be needed when we will 
want to withdraw/unstake our deposit from this agent node.
:::
