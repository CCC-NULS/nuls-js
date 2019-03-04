# Register transaction

The register transaction is part of the NULS __proof of credit (POC)__ consensus and will allow us register a new agent node. We can use the following methods to set it up:

- `".agentAddress(address: string)"` The _address_ of the agent node account, we will need to have access to this account when we decide to unregister the agent 
- `".rewardAddress(address: string)"` The _address_ of the reward account where the rewards of mined block will be sent (if not specified, this will be the same than _agentAddress_)
- `".packingAddress(address: string)"` The _address_ of the packing account (this should be different than _agentAddress_)
- `".commission(commission: number)"` The percentage of commission that the agent node will take from stakers (should be between [10, 100])
- `".deposit(deposit: number)"` The amount of NULS needed to be _deposited_ to register the agent node (should be equal or greater than 20k NULS)

```typescript
import { RegisterTransaction, nulsToNa, TransactionReceipt, TransactionConfig, Utxo, UTXO } from 'nuls-js';

const agentAddress: string = 'TTauR9mch7zkdybYBV44fzBnWuXvhGHy';
const rewardAddress: string = 'TTaj7AS6N1b7Eg4h1QP4gNUDVYMNkiqu';
const packingAddress: string = 'TTapLEYvTYhAPZY7Kn3B7VDFZf1JBzWe';

const transactionConfig: TransactionConfig = {
  api: {
    host: 'https://explorer.nuls.services'
  }
};

const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

const tx = RegisterTransaction
  .fromUtxos(utxos)
  .config(transactionConfig)
  .agentAddress(agentAddress)
  .rewardAddress(rewardAddress)
  .packingAddress(packingAddress)
  .commission(10)
  .deposit(nulsToNa(20000))
  .sign(privateKey);

console.log(tx.getType());
// 4

const txReceipt: TransactionReceipt = await tx.send();
```

::: tip
We dont need to set up a change address, it will be implicitly setted by calling the `.agentAddress()` method.
If you want to override it, just call then `.change()` method as usually.
:::