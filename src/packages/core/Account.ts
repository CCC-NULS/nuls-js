import * as bs58 from 'bs58';
import { randomBytes } from 'crypto';
import * as cryptoJS from 'crypto-js';
// import RIPEMD160 from 'ripemd160'; // Works for Jest
// import * as RIPEMD160 from 'ripemd160'; // Works for WallabyJS // Recommended for Typescript
import * as secp256k1 from 'secp256k1';
import * as shajs from 'sha.js';

const RIPEMD160 = require('ripemd160'); // Holy shit balls Jest and WallayJS is finally happy!

interface IGetAccount
{
	address: string;
	encryptedPrivateKey?: string;
	prikey: string;
	pubKey: string;
}

enum CustomAddressPosition {
	end = 'end',
	start = 'start',
	anywhere = 'anywhere'
}

class AccountClass
{
	// private _debug: boolean = false;
	// private startTime: number;

	/** ChainId */
	public chainId: number;
	/** Address type */
	public addressType: number;

	/** Private key of the public address */
	private privateKey: string = '';
	/** Private key encrypted using SHA256 and AESencryption */
	private encryptedPrivateKey?: string;
	/** Public address of the private key */
	private address: string = '';
	/** Public key of the private key */
	private publicKey: string = '';
	/** Private key HEX Buffer */
	private privateKeyBuffer: Buffer = Buffer.from('');
	/** Public key HEX Buffer */
	private publicKeyBuffer: Buffer = Buffer.from('');
	/** The IV used for encrypting and decrypting private keys [View the NULS repo on IV](https://github.com/nuls-io/nuls/blob/4436795eabe864437de013b83aee0dca0d5400bf/tools-module/tools/src/main/java/io/nuls/core/tools/crypto/EncryptedData.java#L38) */
	private iv = this.hexWordsArray('0000000000000000');

	/**
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	constructor(addressType: number = 1, chainId: number = 8964)
	{
		this.chainId = chainId;
		this.addressType = addressType;
		// this.startTime = Date.now();
	}

	/**
	 * Old debug function to be used if needed
	 */
	// logTime()
	// {
	// 	return Date.now() - this.startTime;
	// }

	/**
	 * Get the account generated
	 */
	public getAccount(): IGetAccount
	{
		return {
			address: this.address,
			encryptedPrivateKey: this.encryptedPrivateKey,
			prikey: this.privateKey,
			pubKey: this.publicKey
		};
	}

	/**
	 * This will loop around until it finds a matching address
	 * @param str The string to look for in addresses created - The larger the string the harder it is to find
	 * @param password A plain text password for encrypting the private key
	 * @param caseSensitive Mark this as `true` to make the address case sensitive to your input `string`
	 * @param position The position of where `string` should be inside the address - Be aware that `start` is very difficult to find
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	public createCustomAddress(str: string, password: string, caseSensitive: boolean = false, position: CustomAddressPosition = CustomAddressPosition.end, addressType: number = this.addressType, chainId: number = this.chainId): IGetAccount
	{
		const searchForText = caseSensitive ? str : str.toLowerCase();
		const appendAddresses = caseSensitive ? ['Nse', 'Nsd'] : ['nse', 'nsd'];
		const appendAddressesLoop = (usersAddress) => appendAddresses.find((appendAddress) => usersAddress.startsWith(`${appendAddress}${searchForText}`));
		let found = false,
			address,
			user;

		while(!found)
		{
			user = this.create(password, addressType, chainId);
			address = caseSensitive ? user.address : user.address.toLowerCase();

			switch(position)
			{
				case CustomAddressPosition.start:
					found = !!appendAddressesLoop(address);
					break;
				case CustomAddressPosition.anywhere:
					found = address.includes(searchForText);
					break;
				case CustomAddressPosition.end:
				default:
					found = address.endsWith(searchForText);
					break;
			}
		}

		return user;
	}

	/**
	 * Imports an account and returns the full account data
	 * @param password A plain text password for encrypting the private key or decrypting the encrypted private key
	 * @param privateKey A plain text or encrypted private key
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	public import(password?: string, privateKey?: string, addressType: number = this.addressType, chainId: number = this.chainId): IGetAccount
	{
		return this.createAccount(password, privateKey, addressType, chainId);
	}

	/**
	 * Initiates creating a new account and returns the data
	 * @param password A plain text password for encrypting the private key
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	public create(password?: string, addressType: number = this.addressType, chainId: number = this.chainId): IGetAccount
	{
		return this.createAccount(password, undefined, addressType, chainId);
	}

	/**
	 * Initiates creating a new account or important an account and returns the data
	 * @param password A plain text password for encrypting the private key or decrypting the encrypted private key
	 * @param privateKey A plain text or encrypted private key
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	private createAccount(password?: string, privateKey?: string, addressType: number = this.addressType, chainId: number = this.chainId): IGetAccount
	{
		if(privateKey) // If a private key is provided we use that
		{
			if(password && this.decryptPrivateKey(password, privateKey)) // If a password exists and it's able to decrypt the private key then we're actually dealing with an encrypted private key
			{
				this.privateKeyBuffer = this.stringToHex(this.decryptPrivateKey(password, privateKey)); // Decrypt it first into a plain text private key and then store the buffer
			}
			else
			{
				this.privateKeyBuffer = this.stringToHex(privateKey); // Turn it into a buffer for reading
			}
		}
		else
		{
			// Create a random private key
			do
			{
				this.privateKeyBuffer = randomBytes(32); // Generates the ECKey
			} while(!secp256k1.privateKeyVerify(this.privateKeyBuffer));
		}

		try
		{
			if(!this.privateKeyBuffer)
			{
				throw new Error('Invalid private key buffer');
			}

			this.publicKeyBuffer = secp256k1.publicKeyCreate(this.privateKeyBuffer);
		}
		catch(e)
		{
			if(password && privateKey)
			{
				throw new Error('Invalid password or encrypted private key provided.');
			}
			else if(privateKey)
			{
				throw new Error('Invalid private key provided.');
			}
			else
			{
				throw new Error('Invalid private key generated.');
			}
		}

		this.privateKey = this.hexToString(this.privateKeyBuffer);
		this.publicKey = this.hexToString(this.publicKeyBuffer);
		this.address = this.createAddress(addressType, chainId);

		if(password)
		{
			this.encryptedPrivateKey = this.encryptPrivateKey(password);
		}

		this.validatePrivateKey();

		return this.getAccount();
	}

	/**
	 * Validate the private key
	 */
	private validatePrivateKey(): void
	{
		if(!this.privateKeyBuffer || !this.publicKeyBuffer)
		{
			throw new Error('Invalid private key buffer');
		}

		const msg: Buffer = randomBytes(32);
		const { signature }: { signature: Buffer } = secp256k1.sign(msg, this.privateKeyBuffer);

		if(!secp256k1.verify(msg, signature, this.publicKeyBuffer))
		{
			throw new Error('Something went wrong when validating the signature.');
		}
	}

	/**
	 * Converts a hex string to a word array
	 */
	private hexWordsArray(str?: string)
	{
		return cryptoJS.enc.Hex.parse(str);
	}

	/**
	 * Encrypt the generated private key with the password using AES
	 */
	private encryptPrivateKey(password: string): string
	{
		const encryptedKey = cryptoJS.AES.encrypt(
			this.hexWordsArray(this.privateKey),
			this.hexWordsArray(this.hexToString(this.sha256(password))),
			{
				iv: this.iv
			}
		);

		return encryptedKey.ciphertext.toString();
	}

	/**
	 * Decrypt the provided private key with the password using AES
	 */
	private decryptPrivateKey(password: string, encryptedPrivateKey: string): string
	{
		const decryptedKey = cryptoJS.AES.decrypt(
			cryptoJS.enc.Base64.stringify(this.hexWordsArray(encryptedPrivateKey)),
			this.hexWordsArray(this.hexToString(this.sha256(password))),
			{
				iv: this.iv
			}
		);

		return decryptedKey.toString();
	}

	/**
	 * Use SHA256 to encrypt the string
	 */
	private sha256(str: string | Buffer): Buffer
	{
		return new shajs.sha256().update(str).digest();
	}

	/**
	 * Encrypts the private key buffer using sha256 and hash160
	 */
	private privateKeyHash(): Buffer
	{
		// sha256hash160
		// https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/utils/AddressTool.java#L61
		const hash: Buffer = new RIPEMD160().update(this.sha256(this.publicKeyBuffer)).digest();

		return hash;
	}

	/**
	 * Creates the public key hash using encryption, chainId, and addressId
	 */
	private getPublicKeyHash(addressType, chainId): Buffer
	{
		const output: Buffer = Buffer.allocUnsafe(3);

		output.writeInt16LE(chainId, 0);
		output.writeInt8(addressType, 2);

		return Buffer.concat([output, this.privateKeyHash()]);
	}

	/**
	 * Using the public key create the public address
	 */
	private createAddress(addressType, chainId): string
	{
		const publicKeyHash: Buffer = this.getPublicKeyHash(addressType, chainId);

		// https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/utils/AddressTool.java#L182
		const address: string = bs58.encode(
			Buffer.concat([
				publicKeyHash,
				Buffer.from([
					publicKeyHash.reduce((xor: number, value: number) => xor ^ value)
				])
			])
		);

		return address;
	}

	/**
	 * String to buffer
	 */
	private stringToHex(str: string): Buffer
	{
		return Buffer.from(str, 'hex');
	}

	/**
	 * Buffer to string
	 */
	private hexToString(hex: Buffer): string
	{
		return hex.toString('hex');
	}

	// set debug(value: boolean)
	// {
	// 	this._debug = value;
	// 	this.createAccount();
	// }
	//
	// get debug()
	// {
	// 	return this._debug;
	// }
}

export const Account = new AccountClass();

// Running the API
// https://github.com/nuls-io/API-server
// cd target
// java -jar API-Server-1.0-SNAPSHOT.jar
// http://172.30.20.78:8765/nuls
// There is an error at -> https://github.com/nuls-io/API-server/blob/eda6320157eb92ca964dff2b2f89c60a9d897bb2/src/main/java/io/nuls/api/server/task/BlockSyncTask.java#L87
// Database config -> https://github.com/nuls-io/API-server/blob/eda6320157eb92ca964dff2b2f89c60a9d897bb2/src/main/resources/jdbc.properties
// ^^ When you edit the config don't forget to rebuild the `target` folder by running `mvn clean -DskipTests=true package` at root project level
// Extracting command line commands
// https://github.com/nuls-io/nuls/blob/4436795eabe864437de013b83aee0dca0d5400bf/account-module/base/account-rpc/src/main/java/io/nuls/account/rpc/cmd/CreateProcessor.java
// Database http://172.30.20.78/phpmyadmin/
