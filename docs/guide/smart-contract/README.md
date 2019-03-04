# Introduction

__NULS JS__ provides a simple api with all the necesary to interact with an smart contract deployed on the NULS network.

## Create an instance

In order to use this api, the first thing we need to do is to create an instance of the contract. This can be done calling the static method `.at(address: string)` of the `Contract` class, and providing the public address of the smart contract deployed in the network. 

We are going to use as an example the lottery contract deployed in the testnet whose address is `TTb3ASyCBbJ6KL1PUS4gh9jWjNi3RvTK`. We can take a look at the source code in [this link](https://github.com/amalcaraz/nuls-lottery-smartcontract/blob/master/src/com/gmail/amalcaraz89/lottery/LotteryContract.java#L19).

```typescript
import { Contract, ContractConfig } from 'nuls-js';

const contractAddress = 'TTb3ASyCBbJ6KL1PUS4gh9jWjNi3RvTK';

const contractConfig: ContractConfig = {
  api: {
    host: 'https://explorer.nuls.services'
  }
};

const contract = await Contract.at(contractAddress, contractConfig);
```

## The "info" method

Every instance of the `Contract` class has an `.info()` method that give us information about the contract public interface: All the method availables, the arguments that every method accept, the type returned by the method, the kind of the method: `payable` or `view`, and the events.

```ts
console.log(contract.info());

{
  name: 'Smart Lottery v1.0.0',
  methods: {
    createLottery: {
      name: 'createLottery',
      desc: '(String title, String desc, double ticketPrice, long startTime, long endTime, int minParticipants, boolean secondPrizes) return Lcom/gmail/amalcaraz89/lottery/model/Lottery;',
      args: [Array],
      returnArg: 'Lcom/gmail/amalcaraz89/lottery/model/Lottery;',
      view: false,
      event: false,
      payable: true
    },
    buyTickets: {
      name: 'buyTickets',
      desc: '(long lotteryId) return BigInteger',
      args: [Array],
      returnArg: 'BigInteger',
      view: false,
      event: false,
      payable: true
    },
    viewLotteryList: { 
      name: 'viewLotteryList',
      desc: '() return Ljava/util/List;',
      args: [],
      returnArg: 'Ljava/util/List;',
      view: true,
      event: false,
      payable: false
    },
    ...
  }
}
```

The contract instance that we have created, have all this methods availables to be called. We can see some examples in the next chapters of this guide.

## Gas Price and Gas Limit

With the inclusion of smart contracts in the NULS ecosystem there are two new concepts that we have to take into account when we use this api: __gas price__, and __gas limit__.

Like in a car engine, the __gas__ is the resource that we need to consume if we want to start moving. The NULS virtual machine is an engine that runs the smart contract code for us, so we need to fill it's deposit with the needed amount of gas to run the code.

The __gas price__ is just the price that we are willing to pay for each unit of gas that the transaction will consume doing the call. The default __gas price__ is __25 NA's__ _(0.00000025 NULS)_.

::: tip
Every line of code will consume some gas that will be deducted form the total gas sent in the method invocation ([more info here](http://dev.nuls.io/smartContract/smartContractFee.html)).
:::

So the total fee will be the summation of the __common transaction size fee__ + (__gas price__ * __gas consumed__ calling the method), the difference between the sent __gas limit__ and the __gas consumed__ will be refunded to the sender account after validating the transaction. But what happens when there is a bug in the contract method, or some malicious code? The execution could fall into an infinite loop and waste all the funds from our account as __gas__ fee...

To protect us from this undesired situations we can set up a __gas limit__ in each transaction, so that way we can know in advance the maximum amount of NULS that will be spent if something goes wrong. The default __gas limit__ in each transaction is __10000000 NA's__ _(0.1 NULS)_.

We only pay gas by calling __payable__ smart contract methods, that are the ones that make a change of the smart contract state. In the other hand, __view__ methods are totally free of fee.
