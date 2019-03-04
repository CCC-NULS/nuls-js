# Payable methods

The contract __payable__ methods are those which has an inputed cost in __gas__ concept. Once we have created an instance of the smart contract we can just call that kind of methods like if they were part of the `javascript` class instance methods.

This methods are a high level abstraction interface to help the developer to interact with smart contracts. Every time we call this methods, a [ContractCallTransaction](../transaction/contract-call/) is generated and broadcasted to the NULS network under the hood.

As we need to spend some of our balance calling this method, it is necessary to provide some extra information to perform the __signature__ and configure the __gas price__ and __gas limit__. 

The last argument passed to this kind of methods is an object to configure the call properly. We can use all the options from this two interfaces to achieve this.

```typescript
export interface ContractConfig {
  api?: IAPIConfig;
  sender?: string;
  privateKey?: string;
};

export interface ContractMethodCallConfig {
  sender?: Address;
  value?: number;
  gasPrice?: number;
  gasLimit?: number;
  remark?: string;
  listener?: PromiEvent<any>;
};
```

As you can see, we can configure not only the gas, but the amount of NULS sent to the contract (__value__ property), the __api__ where we will send the call, and even to add a __remark__ to the resulting transaction. We will talk about the `listener` param later.

```typescript
import { Contract, PromiEvent, nulsToNa, TransactionReceipt } from 'nuls-js';

const senderAddress: string = 'TTatokAfGRC6ACmqaoXqWniAEwqSvzrc';
const senderPrivateKey: string = '040b12fa6405badc1328904f05ef45e89e0606cfe4f03cd5f97bf20a04611c74';
const contractAddress = 'TTazCA6Azw13FxGeseUPuv1hiuyovKYD';

const contract = await Contract.at(contractAddress);

const tx: PromiEvent<TransactionReceipt> = contract.buyTickets('1', {
  sender: senderAddress,
  privateKey: senderPrivateKey,
  value: nulsToNa(1)
});

tx.then((txReceipt: TransactionReceipt) => {
  console.log(`Transaction ${txReceipt.hash} successfully mined`);
}).catch((e: Error) => {
  console.error(`Transaction error: ${e}`);
});
```

If we are going to call the contract multiple times, we can set up the __sender__ and __private key__ in the __contract global config__.

```typescript
...

const contract = await Contract.at(contractAddress, {
  sender: senderAddress,
  privateKey: senderPrivateKey
});

const tx1Receipt: TransactionReceipt = await contract.buyTickets('1', { value: nulsToNa(1) });
const tx2Receipt: TransactionReceipt = await contract.buyTickets('2', { value: nulsToNa(10) });
const tx3Receipt: TransactionReceipt = await contract.buyTickets('3', { value: nulsToNa(0.77) });

...
```

All __payable__ methods are async and returns an special type called "PromiEvent", you can read more about how to handle this type of response in the [basic concepts of transactions](../transaction/#transaction-sent-returned-type) section of this guide.

The principal benefist of using the `Contract` class to call contract __payable__ methods instead of doing a [ContractCallTransaction](../transaction/contract-call/) are two:

- Method call validation
- Automatic gas estimation
- Automatic utxos calculation

## Method call validation

Before broadcasting the transaction, a validation of all the arguments types and a simulation of the call is performed in a __NULS node__ and the result of it is sent back to __NULS JS__. This way we can verify if everything has gone fine and predict the result of sending the transaction to the network before having sent it and without having wasted a single __NULS__ from our account.

An exception will be thrown if something goes wrong in the next scenarios:

- If some of the argument type does not match with the expected ones
- If the necessary gas to call the method is greater than the specified gas limit
- If there are some error evaluating a `require(boolean expression, String errorMessage)` or `revert(String errorMessage)` method in the internal business logic of the smart contract, the custom error message will be included in the error thrown by __NULS JS__

## Automatic gas estimation

If we don't specify any __gas limit__ in the last argument config when calling the method, __NULS JS__ will perfom an automatic gas estimation and will set up it as __gas limit__ for us. This way the amount of NULS spent to call the method will be more accurated and a later refund will not be necessary.

## Automatic utxos calculation

The [utxos](../transaction/#obtaining-the-utxos) of the __sender__ account will be auto calculated before sending the transaction. So we dont have to worry about get thems and compose the transaction from thems.