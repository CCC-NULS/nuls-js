# QR Code
We use the [QRCode](https://www.npmjs.com/package/qrcode) npm package to handle creating the QR code for us, more
specifically we use the [nodejs](https://www.npmjs.com/package/qrcode#nodejs) implementation.

#### Create a QR Code URL
`ADDRESS` can be either an address or a private key. Developers who read the QRCode should be able to read the QR code
and if it's an `address` they can provide options for adding the contact or send funds, if it's a private key then the
can transfer the funds, save or open the account.

`OPTIONS` is any extra URL parameters added onto the address URL QR code. For example `{ amount: 1 }` can be added so
the reader is told the amount of NULS to send in the transaction. [Read more](https://alephnuls.github.io/nuls-js/typedoc/interfaces/iqroptions.html) options on the documentation. 

`QRCODE_PACKAGE_OPTIONS` provide any additional QRCode package options.

```js
import { QRCode } from 'nuls-js';

QRCode.create(ADDRESS, OPTIONS, QRCODE_PACKAGE_OPTIONS).then((url) =>
{
    console.log(url);
})
.catch((err) =>
{
    console.error(err);
});
```
