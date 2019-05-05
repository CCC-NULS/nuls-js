# Create/Import Account
The account class can handle the complete account generation, importing, decrypting and encrypting for you.
There are only two parameters which are accepted, `PASSWORD` and `PRIVATE_KEY` in their respective order.
If you do not provide a password the account created will not be encrypted.

The default `addressType` is `1` and `chainId` is `8964`. You can change these yourself by providing them
as parameters, read [Address Type and ChainId](#address-type-and-chainid).

#### Quick Start
```ts
import { Account } from 'nuls-js';

Account.create(); // Creates an account
Account.create(PASSWORD); // Creates an account with a password
Account.import(PLAIN_TEXT_PRIVATE_KEY); // Imports a plain text private key
Account.import(PLAIN_TEXT_PRIVATE_KEY, PASSWORD); // Imports a plain text private key and encrypts it
Account.import(ENCRYPTED_PRIVATE_KEY, PASSWORD); // Imports an encrypted private key
```

## Create a New Account
Accounts can be created easily on the frontend without calling any server. It should only be
done by the user without interacting with any server to get the best security measures.

```ts
import { Account } from 'nuls-js';

Account.create(); // Creates an account
Account.create(PASSWORD); // Creates an account with a password
```

#### Without a Password
To generate a new account you can call the `Account` class.

```ts
import { Account } from 'nuls-js';

const account = Account.create();
console.log(account.toObject());
// {
//     address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
//     privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
//     publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
// }
```

#### With a Password
To generated a new account encrypted with a password you can provide a plain text password as
the first `param` whereafter you will receive a private key both in plain text and encrypted.
```ts
import { Account } from 'nuls-js';

const account = Account.create('Password1!');
console.log(account.toObject());
// {
//     address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
//     privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
//     privateKeyEncrypted: 'b39747ac8e9aa114f6a173d29f57d70082de584704b399b6de0a51804f45f9b24eca1a53ed8b64e9c73b8297b8cc3faf',
//     publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
// }
```

## Import an Account
You can import an existing account by using the private key. The private key can be encrypted or decrypted,
if you provide just the private key it must be encrypted, if you provide an encrypted private key together with its password
it will decrypt the private key, if you provide a password and a decrypted private key it will import it and
encrypt the private key.

```ts
import { Account } from 'nuls-js';

Account.import(PLAIN_TEXT_PRIVATE_KEY); // Imports a plain text private key
Account.import(PLAIN_TEXT_PRIVATE_KEY, PASSWORD); // Imports a plain text private key and encrypts it
Account.import(ENCRYPTED_PRIVATE_KEY, PASSWORD); // Imports an encrypted private key
```

#### Unencrypted (plain text) Private Key
You can provide the unencrypted private key in plain text as the first `param` in the `Account` class.

```ts
import { Account } from 'nuls-js';

const account = Account.import('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b');
console.log(account.toObject());
// {
//     address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
//     privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
//     publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
// }
```

#### Encrypted Private Key
If the private key you're providing is encrypted with a password, you can provide the
password as second `param` in plain text and the encrypted private key as the first `param`.

```ts
import { Account } from 'nuls-js';

const account = Account.import('6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01', 'Password1!');
console.log(account.toObject());
// {
//     address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
//     privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
//     privateKeyEncrypted: '6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01',
//     publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
// }
```

#### Encrypting an Unencrypted (plain text) Private Key
If you want to encrypt a private key you can provide the password and unecrypted private key,
the account will then be imported and encrypted.

```ts
import { Account } from 'nuls-js';

const account = Account.import('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b', 'Password1!');
console.log(account.toObject());
// {
//     address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
//     privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
//     privateKeyEncrypted: '6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01',
//     publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
// }
```

## Address Type and ChainId
You can create or import accounts under different address types or chainIds by providing them as parameters
into the `create` or `import` functions as such:

```ts
import { Account } from 'nuls-js';

Account.create(PASSWORD, ADDRESS_TYPE, CHAIN_ID);
Account.import(PRIVATE_KEY, PASSWORD, ADDRESS_TYPE, CHAIN_ID);
```

You can use the util enums `AddressType` and `ChainIdType` to provide this information as latest arguments.

```ts
import { Account, AddressType, ChainIdType } from 'nuls-js';

Account.import('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b', null, AddressType.Default, ChainIdType.Testnet);
Account.create(null, AddressType.Default, ChainIdType.Mainnet);
```

## Create a Custom Address
Address strings are randomly generated, but we can loop until we find an address that matches our requirements. Check
out the [documentation for the method](https://CCC-NULS.github.io/nuls-js/typedoc/classes/accountclass.html) to discover
what parameters are available for the method. Below is an example for finding addresses which end with the string
`josh` where case sensitive is not an issue. This will return the first address found, but be aware the longer the
string then the harder it is to find, as well as making it case sensitive and setting the position to `start`.

```ts
import { Account } from 'nuls-js';

Account.createCustomAddress(MATCH_STRING, PASSWORD, CASE_SENSITIVE, MATCH_POSITION);
const fooAccount = Account.createCustomAddress('josh', 'Password1!');
```

###### Find all `josh` addresses until the script is killed
```ts
import { Account } from 'nuls-js';

while (true) {
	const account = Account.createCustomAddress('josh', 'Password1!');
	console.log(account);
}
```
