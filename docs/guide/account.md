# Create/Import Account
The account class can handle the whole account generation, importing, decrypting and encrypting for you.
There are only two parameters which are accepted, `PASSWORD` and `PRIVATE_KEY` in their respective order.
If you do not provide a password the account created will not be encrypted.

#### Import NULS Package
```js
import nuls from 'nuls-js';
```
You can also import just the `Account` module by itself
```js
import { Account } from 'nuls-js';
```

#### Quick Introduction
```js
const account = new nuls.Account(PASSWORD); // Creates an account
const fooAccount = account.getAccount(); // Gets the account created
```

```js
const account = new nuls.Account(PASSWORD, ENCRYPTED_PRIVATE_KEY); // Imports an account
const fooAccount = account.getAccount(); // Gets the account imported
```

Which is the same as
```js
const account = new nuls.Account(); // Store the account class
const fooAccount = account.create(); // Creates an account
const barAccount = account.create(PASSWORD); // Creates an account with a password
const bazAccount = account.import(null, PLAIN_TEXT_PRIVATE_KEY); // Imports a plain text private key
const quzAccount = account.import(PASSWORD, PLAIN_TEXT_PRIVATE_KEY); // Imports a plain text private key and encrypts it
const flobAccount = account.import(PASSWORD, ENCRYPTED_PRIVATE_KEY); // Imports an encrypted private key
```

## Create a New Account
Accounts can be easily be created on the frontend without calling any server. It should be
done by the user only without interacting with any server for best security measures.

```js
const account = new nuls.Account(); // Store the account class
const fooAccount = account.create(); // Creates an account
const barAccount = account.create(PASSWORD); // Creates an account with a password
```

#### Without a Password
To generate a new account you can call the `Account` class.
```js
const account = new nuls.Account();
const fooAccount = account.getAccount();
```
OR
```js
const account = new nuls.Account();
const fooAccount = account.create();
```

###### Full Example
```js
const account = new nuls.Account();

console.log(account.create());
// {
//     address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
//     privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
//     publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
// }
```

#### With a Password
To encrypt your generated account with a password you can provide a plain text password as
the first `param` and you will be provided both the plain text and encrypted private keys.
```js
const account = new nuls.Account(PASSWORD);
const fooAccount = account.getAccount();
```
OR
```js
const account = new nuls.Account();
const fooAccount = account.create(PASSWORD);
```

###### Full Example
```js
const account = new nuls.Account('Password1!');

console.log(account.create());
// {
//     address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
//     privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
//     privateKeyEncrypted: 'b39747ac8e9aa114f6a173d29f57d70082de584704b399b6de0a51804f45f9b24eca1a53ed8b64e9c73b8297b8cc3faf',
//     publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
// }
```

## Import an Account
You can import an existing account by using the private key. The private key can be encrypted or decrypted,
if you provide just the private key it must be decrypted, if you provide an encrypted private key and a password
it will decrypt the private key, if you provide a password and a decrypted private key it will import it and
encrypt the private key.

```js
const account = new nuls.Account(); // Store the account class
const bazAccount = account.import(null, PLAIN_TEXT_PRIVATE_KEY); // Imports a plain text private key
const quzAccount = account.import(PASSWORD, PLAIN_TEXT_PRIVATE_KEY); // Imports a plain text private key and encrypts it
const flobAccount = account.import(PASSWORD, ENCRYPTED_PRIVATE_KEY); // Imports an encrypted private key
```

#### Unencrypted (plain text) Private Key
You can provide the unencrypted plain text private key as the second `param` in the `Account` class.
```js
const account = new nuls.Account(null, PLAIN_TEXT_PRIVATE_KEY);
const fooAccount = account.getAccount();
```
OR
```js
const account = new nuls.Account();
const fooAccount = account.import(null, PLAIN_TEXT_PRIVATE_KEY);
```

###### Full example
```js
const account = new nuls.Account();

console.log(account.import(null, '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b'));
// {
//     address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
//     privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
//     publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
// }
```

#### Encrypted Private Key
If the private key you're providing is encrypted with a password, you can provide the
password in the first `param` in plain text and the encrypted private key as the second as before.
```js
const account = new nuls.Account(PASSWORD, ENCRYPTED_PRIVATE_KEY);
const fooAccount = account.getAccount();
```
OR
```js
const account = new nuls.Account();
const fooAccount = account.import(PASSWORD, ENCRYPTED_PRIVATE_KEY);
```

###### Full example
```js
const account = new nuls.Account('Password1!', '6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01');

console.log(account.import());
// {
//     address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
//     privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
//     privateKeyEncrypted: '6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01',
//     publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
// }
```

#### Encrypting an Unencrypted (plain text) Private Key
If you want to encrypt the plain text private key you can provide the password and plain text private key,
the account will be imported and encrypted.
```js
const account = new nuls.Account(PASSWORD, PLAIN_TEXT_PRIVATE_KEY);
const fooAccount = account.getAccount();
```
OR
```js
const account = new nuls.Account();
const fooAccount = account.import(PASSWORD, PLAIN_TEXT_PRIVATE_KEY);
```

###### Full example
```js
const account = new nuls.Account('Password1!', '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b');

console.log(account.import());
// {
//     address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
//     privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
//     privateKeyEncrypted: '6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01',
//     publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
// }
```
