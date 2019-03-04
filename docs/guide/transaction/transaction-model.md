# Transaction model

Every transaction class implements the `BaseTransaction` abstract class which shares some mehtods to parse and serialize the transaction data easily.

Transaction data can be obtained from the __NULS node__ as `base64` encoded bytes. We could then read this data and build our own transaction instance from it. But if the information of the transaction is serialized, and its content vary depending on the type, how do we know which transaction class should we use from our catalog of classes to parse the transaction properly?

To make it easy, __NULS JS__ provides an special class that can be used to parse a serialized transaction and return an specific transaction instance depending on the readed content. Here is an example of how to do this:

## Parse from bytes

```typescript
import { Transaction, BaseTransaction, RewardTransaction } from 'nuls-js';

const transactionBytes: Buffer = Buffer.from('AQAwFOnsZgEA/////wACFwUBAcwF/3oBFSS7Fl6ApWAIlmAgdHYoOMk6AAAAAACMCgEAAAAXBQEBylR/9QDCZ0wxtYW5PVlDE4lKjcuAwRgAAAAAAIwKAQAAAAA=', 'base64');
const tx: BaseTransaction = Transaction.fromBytes(transactionBytes);
...
```

## Serialize to bytes

```typescript
...
const transactionBytes: Buffer = tx.toBytes();
console.log(transactionBytes.toString('base64'));
// AQAwFOnsZgEA/////wACFwUBAcwF/3oBFSS7Fl6ApWAIlmAgdHYoOMk6AAAAAACMCgEAAAAXBQEBylR/9QDCZ0wxtYW5PVlDE4lKjcuAwRgAAAAAAIwKAQAAAAA=
...
```

## Cast to object

```typescript
...
console.log(tx instanceof RewardTransaction);
// true

console.log(tx.toObject());
```
```json
{
  "hash": "0020f558cc32e2480aea8d9995f8df7cfb191a222d71fe1abf8197ec54381a518fbc",
  "type": 1,
  "blockHeight": -1,
  "time": 1541572990000,
  "remark": "",
  "txData": null,
  "inputs": [],
  "outputs": [
    {
      "address": "TTavq5rDMcnU4FRRRBJdPFMXfYfuNULS",
      "na": 3852600,
      "lockTime": 68236
    },
    {
      "address": "TTavj3ZpEy3x1Nd8dx1Gf7qLwApCQpVN",
      "na": 1622400,
      "lockTime": 68236
    }
  ],
  "signature": ""
}
```