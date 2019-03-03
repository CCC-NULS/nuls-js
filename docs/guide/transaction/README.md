---
title: Transaction basic concepts
---

# Transaction basic concepts

__NULS JS__ provides a very simple API for creating transactions. We expect this API to be accessible for developers without knowing the working internals of nuls in deep detail. What follows is a small introduction to transactions with some basic knowledge required to use this API.

A Transaction contains a set of inputs and a set of outputs. Each input contains a reference to another transaction's output. Note also that an output can be used only once. That's why there's a concept of ["change address"](./#change-address) in the NULS ecosystem: if an output of 10 NULS is available for me to spend, but I only need to transmit 1 NULS, I'll create a transaction with two outputs, one with 1 NULS that I want to spend, and the other with 9 NULS to a change address, so I will be able to spend this 9 NULS in the future, using it as an input of my next transaction.

So, in order to transmit a valid transaction, you must know what other transactions on the network store outputs that have not been spent and that are available for you to spend (meaning that you have the set of keys that can validate you own those funds). The unspent outputs are usually referred to as "utxo"s.

Unlike other blockchain platforms, NULS has been designed to support different kinds of transactions, that we will cover along this guide.
Let's take a look at the simplier transaction we can make.

## Transaction example

We are going to send `1 NULS` from the `fromAddress` account to the `toAddress` account, to achieve this we need to provide a list of unspent outputs (`utxos`) and the `privateKey` of the same account that owns that outputs.

```typescript
import { TransferTransaction, nulsToNa } from 'nuls-js';

const fromAddress: string = 'TTatokAfGRC6ACmqaoXqWniAEwqSvzrc';
const privateKey: string = '040b12fa6405badc1328904f05ef45e89e0606cfe4f03cd5f97bf20a04611c74';
const toAddress: string = 'TTaisi5BDnwooxFZg5D8vLktSuSrHtpS';

TransferTransaction
  .fromUtxos(utxos)             // The transaction will be composed with a list of inputs computed from the utxos list
  .change(fromAddress)          // This is the address where the remain of the input will be sent
  .to(toAddress, nulsToNa(1))   // This will send 1 NULS to the account identified by it public address "toAddress"
  .sign(privateKey)             // We have to provide the private key of the account that owns the inputs 
  .send();                      // The transaction will be sent to the NULS network and added to the pending transaction pool
```

## Obtaining the utxos

The provided `utxos` should be an array of items that fits the UTXO interface:

```typescript
interface UTXO {
  fromHash: string;
  fromIndex: number;
  value: number;
  lockTime: number;
}

const utxos: UTXO[] = [...];
```

The utxos of an account can be obtained by different ways:

- Importing your account in your own __NULS Node__ and retrieving them by console command:
```bash
nuls>>> import <privatekey>
nuls>>> getaccounts 0 1
nuls>>> getutxoaccount <address>
```
- Fetching the utxos from your NULS Desktop Wallet (by local API)
```bash
> curl http://localhost:8001/api/utxo/limit/<address>/999999
> { 
    "success": true,
    "data": {
      "utxoDtoList": [
        { 
          "txHash": "0020533b13816f7dde3c52d4b7201191c1e4e645e7ea6aa4af53ab22a1907fb14ff0", 
          "txIndex": 1, 
          "value": 100000000, 
          "lockTime": 0
        }, {
          "txHash": "002071d04680bd42c9b7fba69f6284391cceb0fff22af22f4c1e5cb8b05156106b73", 
          "txIndex": 1, 
          "value": 760624462466, 
          "lockTime": 0
        }
      ]
    }
  }
```
- Fetching the utxos from some of the NULS explorers
```bash
# light-explorer
> curl https://explorer.nuls.services/utxos/<address>
> [
    {
      "fromHash": "0020beba7e649a7f0467a66389a560f40c188fd0a61c52e61bec32bc3bf8b5c4b626",
      "fromIndex": 1,
      "value": 989999999500000,
      "lockTime": 0
    }, {
      "fromHash":  "00207b015b4fa53661055f2bd49148338da315f40e5c79f2c1ade1f8e7fcc0f0154a",
      "fromIndex": 1,
      "value": 171995740066851,
      "lockTime": 0
    }
  ]

# nuls.world
> curl https://testnet.nuls.world/addresses/outputs/<address>.json
> {
    "outputs": [
      {
        "hash": "0020beba7e649a7f0467a66389a560f40c188fd0a61c52e61bec32bc3bf8b5c4b626",
        "idx": 1,
        "value": 989999999500000,
        "lockTime": 0
      }, {
        "hash": "00207b015b4fa53661055f2bd49148338da315f40e5c79f2c1ade1f8e7fcc0f0154a",
        "idx": 1,
        "value": 171995740066851,
        "lockTime": 0
      }
    ]
  }
```

__NULS JS__ provides a helper class to get the utxos of an account easily, this class relies on some NULS blockchain explorer api that we have seen before:

```typescript
import { Utxo, UTXO } from 'nuls-js';

const fromAddress: string = 'TTaoMpuLtP4NmiVZWAQpngopcvoDNULS';
const utxos: UTXO[] = await Utxo.getUtxos(fromAddress);

console.log(utxos);
```

```json
[
  {
    "fromHash": "0020beba7e649a7f0467a66389a560f40c188fd0a61c52e61bec32bc3bf8b5c4b626",
    "fromIndex": 1,
    "value": 989999999500000,
    "lockTime": 0
  },
  {
    "fromHash": "00207b015b4fa53661055f2bd49148338da315f40e5c79f2c1ade1f8e7fcc0f0154a",
    "fromIndex": 1,
    "value": 171995740066851,
    "lockTime": 0
  }
]
```

## Destination address

To specify the accounts which will receive the transfered amount we have to use the method `.to(address: string, amount: number)`. This is translated internally as a transaction output. We also can transfer NULS to different accounts at once, to achieve that we can add as much outputs as we need:

```typescript
import { TransferTransaction, nulsToNa } from 'nuls-js';

TransferTransaction
  .fromUtxos(utxos)
  .to(address, nulsToNa(100))         // Send 100 NULS to "address" account
  .to(otherAddress, nulsToNa(0.005))  // Send 0.005 NULS to "otherAddress" account
  .to(anotherOne, 100000000)          // Send 1 NULS to "anotherOne" account
  ...
```

## NULS and NA's

As we have seen previously we are using the method `.to(address: string, amount: number)` of the `TransferTransaction` class to specify de destination address that will receive the transfer, and the amount of nuls transfered. 

Homologously to other blockchains platforms which has fungible tokens like __Bitcoin (satoshis)__ or __Ethereum (weis)__, we need to specify the amount of tokens to be sent as __"NA" (NULS amount)__ beign:
- 1 NA = 1/10^8 NULS
- 1 NULS = 10^8 NA 

As we are used to work with __NULS__ and fractions of it instead of __NA__, to ease this swapping __NULS JS__ provides some helper functions to do the conversion of the amount to the corresponding precission.

```typescript
import { nulsToNa, naToNuls } from 'nuls-js';

nulsToNa(0.5);        // 0.5 NULS -> 50000000 NA
nulsToNa(0.00000001); // 0.00000001 NULS -> 1 NA

naToNuls(70000000);   // 70000000 NA -> 70 NULS
naToNuls(1);          // 1 NA -> 0.00000001 NULS
```

## Change address

As we have seen before, when we use an input in our transaction with an amount greater than the desired amount to transfer, we need to specify an output with the account address where the remaining amount will be transfered. The change address will usually be the same address that the account doing the transaction (the utxos owner account address).

To set up the change address we are using the method `.change(address: string)` of the `TransferTransaction` class.

```typescript
import { TransferTransaction, nulsToNa } from 'nuls-js';

TransferTransaction
  .fromUtxos([{
    fromHash: "...",
    fromIndex: 0,
    value: 1000000000,
    lockTime: 0
  }])
  .to(toAddress, nulsToNa(8))  // "toAddress" will receive 8 NULS
  .change(changeAddress)       // "changeAddress" will receive 2 NULS
  ...
```

::: tip
It is not necesary to set up a change address in all kind of transactions. Check the API Reference of each transaction kind to get more details.
:::

## Sign a transaction

Once we have our transaction configured, we need to sign it before sending it to the network. To make this we need to provide the private key of the account that owns the utxos used in the transaction.

To sign the transaction we need to call the method `.sign(privateKey: string)` of the `TransferTransaction` class.

```typescript
import { TransferTransaction } from 'nuls-js';

TransferTransaction
  .fromUtxos(utxos)
  ...
  .sign(privateKey)
  ...
```

::: warning
Once we have signed the transaction, we can not modify it. If we try to modify it by adding one more output for example, the signature will be cleared and we will need to call the `sign` method again.
:::

## Broadcast a transaction

We can broadcast a transaction to the NULS network using the method `.send(config?: TransactionConfig)` of the `TransferTransaction` class. This will send our locally signed transaction to one of the NULS nodes using an explorer api previously configured.

We can set up our favorite explorer api host that will handle the transaction by using either, the `.config()` method of the `TransferTransaction` class, or passing it as the first argument of the `.send()` method. Here is an example doing this:

```typescript
import { TransferTransaction } from 'nuls-js';

// Setting it up by passing the config as argument of .send() method
TransferTransaction
  .fromUtxos(utxos)
  ...
  .sign(privateKey)
  .send({
    api: { host: 'https://explorer.nuls.services' }
  });

// Setting it up by calling .config() method
TransferTransaction
  .fromUtxos(utxos)
  .config({
    api: { host: 'https://explorer.nuls.services' }
  })
  ...
  .sign(privateKey)
  .send();
```

::: warning
The transaction should have been signed before broadcasting it, if not an exception will be thrown
:::

The send method returns an especial object of type `PromiEvent`, which is half `EventEmitter`, and half `Promise`. This will be resolved when the transaction receipt will be available. Additionally the following events are emitted:

- `"txHash"` Once the transaction has been sent and it is in the pending transaction pool of the network waiting to be mined. An string is emitted along with the event, containing the transaction hash that identifies this transaction in the network.
- `"txReceipt"` Once the transaction has be mined in some block. A mined transaction object is emitted along with the event.
- `"error"` If there was some error broadcasting the transaction.

```typescript
import { TransferTransaction, PromiEvent, TransactionHash, TransactionReceipt } from 'nuls-js';

const tx: PromiEvent<TransactionReceipt> = TransferTransaction
  .fromUtxos(utxos)
  ...
  .send();

tx.on('error', (error: Error) => {

  console.error(error);
  // Error: There was an error sending the transaction to the network

});

tx.on('txHash', (hash: TransactionHash) => {

  console.log(hash);
  // 0020ec3215758304ca3f055a99517236fc996dabdf02fb806e4dfb76539ee43c0752

});

tx.on('txReceipt', (receipt: TransactionReceipt) => {

  console.log(receipt.hash);
  // 0020ec3215758304ca3f055a99517236fc996dabdf02fb806e4dfb76539ee43c0752

  console.log(receipt.blockHeight);
  // 663692

});

// Using it as a promise
tx.then((receipt: TransactionReceipt) => {

  console.log(receipt.type);
  // 2

}).catch((error: Error) => {

  console.error(error);
  // Error: There was an error sending the transaction to the network

});

```

::: tip
By default there are some validations that are done before sending the transaction. You can skip this validations forcing it to be sent by overriding the default configuration with:

```typescript
TransferTransaction
  .fromUtxos(utxos)
  .config({
    safeCheck: false,
  })
  ...
```
:::

## Serialize a transaction

The `.send()` method of the `TransferTransaction` class already does an implicit serialization before sending the transaction, but in some cases maybe we will want to get the serialized transaction to send it directly through our local node. The Transaction api provides a method to get the serialized transaction. We just need to call it:

```typescript
import { TransferTransaction, TransactionHex } from 'nuls-js';

const txHex: TransactionHex = TransferTransaction
  .fromUtxos(utxos)
  ...
  .serialize();

console.log(txHex);
// f14e2c72549d1ccb34527491559e0ab33dc98395980f2a7db335ff90f10b9cee28001c94ca4215c8501b41cae5e0be7e...
```

::: tip
All the validations are already executed when serializing a transaction
:::
