# View methods

As we have seen previously, the __view__ methods are free to call. Once we have created an instance of the smart contract we can just call that kind of methods like if they were part of the `javascript` class methods.

::: tip
The argument should be all of type `string`, a proper type casting and validation will be done before calling the method.
:::

```typescript
import { Contract } from 'nuls-js';

const contractAddress = 'TTazCA6Azw13FxGeseUPuv1hiuyovKYD';
const contract = await Contract.at(contractAddress);

const result: any = await contract.viewLotteryList();

console.log(result);
// [{
//     id: 1,
//     title: 'asdasd ',
//     desc: 'asd \n22222\n\r "lottery" . àsdasd`11111` \'YES\' \n... tab \t tab\n33333 \\n j \n hh \\\n OO',
//     status: 1,
//     minParticipants: 5,
//     startTime: 1551135600000,
//     endTime: 1551308400000,
//     initialPot: 0,
//     currentPot: 11000000000,
//     totalPot: 11000000000,
//     ticketPrice: 10000000,
//     secondPrizes: false,
//     creatorAddress: 'TTattJmAz28RNH95VsRqnGNRhvKAV5Fj',
//     supportAddress: '',
//     supportPercentage: 0,
//     ticketsCount: 1100
//   }
// ]
```

All __view__ methods are async, so they will return a promise that will be resolved with the value returned by the contract method. The contract class will try to cast the returned value to the best mached type, as a last resort, if the returned value can not be casted to one of the primitives types, a JSON parse will be tried, and as fallback an string will be returned to let the user handle the output by himself.

::: tip
If anything fails the promise will be rejected with a descriptive error
```typescript
try {
  const result: any = await contract.viewLotteryList('no arguments expected!');
} catch (e) {
  console.error(e);
  // Error: Wrong number of arguments calling "viewLotteryList", 1 passed, 0 expected
}
```
:::