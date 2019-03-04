# Block model

Block data can be obtained from the __NULS node__ as `base64` encoded bytes. We could then read this data and build our own block instance from it.

To make it easy, __NULS JS__ provides an special class that can be used to parse a serialized block and return a block instance. Here is an example of how to do this:

## Parse from bytes

```typescript
import { Block } from 'nuls-js';

const blockBytes: Buffer = Buffer.from('ACCVtyL5tbIBJD3KMaeULlBELo8aDMVl5cbLS8GdLE8o8wAgt6RxSEcTPDL/sV446QytAOaylxD3H5ATbtlQuJoZaGAg7ejsZgGjBgEAAQAAAD07SgwADQDwd+jsZgEDAAIAAAACAAAAWgAQJwAAIDl5nQU1bDlC800WeMS8DgSiAUJs3d40nQQZy3NDuS4gIQOmzfqeD9WVAn7XY36qrisuFlnoJ6DSFwzTZaC72EQXhQBHMEUCIQCzvG+8FeeOkObK8e0BFDaI0qrs6BD12bM5GjyEkDvM/QIgY/ZNu7WdU7KuNrpydwgOK+4JDiaV0FaEUHZsS66q7csBACDt6OxmAQD/////AAMXBQEBj+RFsJovbn13e4BIjrTTJQRV5e6/JEAFAAAAAIsKAQAAABcFAQH0qS/uv9Nvposd4xqeix6piJ1WR9iU7QUAAAAAiwoBAAAAFwUBAfjtsLAUdIoaiDClVbJSvcM40xLkrBC+BAAAAACLCgEAAAAA', 'base64');
const block: Block = Block.fromBytes(blockBytes);
...
```

## Serialize to bytes

```typescript
...
const blockBytes: Buffer = block.toBytes();
console.log(blockBytes.toString('base64'));
// AQAwFOnsZgEA/////wACFwUBAcwF/3oBFSS7Fl6ApWAIlmAgdHYoOMk6AAAAAACMCgEAAAAXBQEBylR/9QDCZ0wxtYW5PVlDE4lKjcuAwRgAAAAAAIwKAQAAAAA=
...
```

## Cast to object

```typescript
...
console.log(block.toObject());
```
```json
{
  "hash": "0020f2ffb161b6a62d9fc4b3010d1376a7b454c4f193dacfb543c10c2c0b33f144d6",
  "preHash": "002095b722f9b5b201243dca31a7942e50442e8f1a0cc565e5c6cb4bc19d2c4f28f3",
  "merkleHash": "0020b7a4714847133c32ffb15e38e90cad00e6b29710f71f90136ed950b89a196860",
  "time": 1541572980000,
  "height": 67235,
  "txCount": 1,
  "consensusMemberCount": 13,
  "currentVersion": 2,
  "delay": 10000,
  "mainVersion": 2,
  "packingIndexOfRound": 3,
  "percent": 90,
  "roundIndex": 805435,
  "roundStartTime": 1541572950000,
  "stateRoot": "39799d05356c3942f34d1678c4bc0e04a201426cddde349d0419cb7343b92e20",
  "extend": "3b4a0c000d00f077e8ec6601030002000000020000005a00102700002039799d05356c3942f34d1678c4bc0e04a201426cddde349d0419cb7343b92e20",
  "signature": "2103a6cdfa9e0fd595027ed7637eaaae2b2e1659e827a0d2170cd365a0bbd844178500473045022100b3bc6fbc15e78e90e6caf1ed01143688d2aaece810f5d9b3391a3c84903bccfd022063f64dbbb59d53b2ae36ba7277080e2bee090e2695d0568450766c4baeaaedcb",
  "transactions": [
    {
      "hash": "0020b7a4714847133c32ffb15e38e90cad00e6b29710f71f90136ed950b89a196860",
      "type": 1,
      "blockHeight": 67235,
      "time": 1541572980000,
      "remark": "",
      "txData": null,
      "inputs": [],
      "outputs": [
        {
          "address": "TTas8d9BabAZmL4bNqZn3Ns9piBGgkFp",
          "na": 88089791,
          "lockTime": 68235
        },
        {
          "address": "TTayL21tpZt5GwtWamsyUN2hP8kwjAEp",
          "na": 99456216,
          "lockTime": 68235
        },
        {
          "address": "TTaybEoKxrV1SWEwKYDwTENHNH4qTest",
          "na": 79564972,
          "lockTime": 68235
        }
      ],
      "signature": ""
    }
  ]
}
```