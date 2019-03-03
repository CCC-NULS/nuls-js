# QR Code
We use the [QRCode](https://www.npmjs.com/package/qrcode) npm package to handle creating the QR code for us, more
specifically we use the [nodejs](https://www.npmjs.com/package/qrcode#nodejs) implementation.

## Create a QR Code URL
`ADDRESS` can be either an address or a private key. Developers who read the QRCode should be able to read the QR code
and if it's an `address` they can provide options for adding the contact or send funds, if it's a private key then the
can transfer the funds, save or open the account.

`ADDRESSPARAMS` is any extra URL parameters added onto the address URL QR code. For example `{ amount: 1 }` can be added so
the reader is told the amount of NULS to send in the transaction. [Read more](https://CCC-NULS.github.io/nuls-js/typedoc/interfaces/iaddressparams.html) address params on the documentation. 

`OPTIONS` are options to configure the QR code to our preference. [Read more](https://CCC-NULS.github.io/nuls-js/typedoc/interfaces/iqroptions.html) options on the documentation. 

`QRCODE_PACKAGE_OPTIONS` provide any additional QRCode package options.

```js
import { QRCode } from 'nuls-js';

QRCode.create(ADDRESS, ADDRESSPARAMS, OPTIONS, QRCODE_PACKAGE_OPTIONS).then((url) =>
{
    console.log(url);
})
.catch((err) =>
{
    console.error(err);
});
```

##### With ES6
```js
const imageUri = await QRCode.create(ADDRESS, ADDRESSPARAMS, OPTIONS, QRCODE_PACKAGE_OPTIONS); 
```

## Examples
### Requesting Funds
![alt text](/nuls-js/QRCodes/getAmount.png "nuls:Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6?amount=10")
```js
const imageUri = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', { amount: 10 }); 
```

### Black Logo
![alt text](/nuls-js/QRCodes/black.png "nuls:Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6")
```js
const imageUri = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: 'black' }); 
```

### No Logo
![alt text](/nuls-js/QRCodes/blank.png "nuls:Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6")
```js
const imageUri = await QRCode.create('Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6', undefined, { logo: false }); 
```

### Encrypted Private Key
![alt text](/nuls-js/QRCodes/privateKey.png "nuls:5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e")
```js
const imageUri = await QRCode.create('5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e'); 
```
