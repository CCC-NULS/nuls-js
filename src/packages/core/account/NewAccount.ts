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
	privateKey: string;
	privateKeyEncrypted?: string;
	publicKey: string;
}

export class NewAccount
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
	private privateKeyEncrypted?: string;
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
	 * @param password Encrypt your new private key with this password or decrypt the private key you provide with this password
	 * @param privateKey You can provide a private key to generate details based on this private key (if you're providing an encrypted key you must provide the password in the first param, otherwise provide `null` password)
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	constructor(password?: string, privateKey?: string, addressType: number = 1, chainId: number = 8964)
	{
		this.chainId = chainId;
		this.addressType = addressType;
		// this.startTime = Date.now();
		this.createAccount(password, privateKey);
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
	public getAccount(): IGetAccount | null
	{
		if(!this.address || !this.privateKey || !this.publicKey) return null;

		return {
			address: this.address,
			privateKey: this.privateKey,
			privateKeyEncrypted: this.privateKeyEncrypted,
			publicKey: this.publicKey
		};
	}

	/**
	 * Initiates creating a new account and returns the data
	 * @param password A password to encrypt the private key with
	 * @param privateKey Provide a private key to import the account
	 */
	public createAccount(password?: string, privateKey?: string): IGetAccount | null
	{
		if(privateKey) // If a private key is provided we use that
		{
			if(password) // If a password exists then we're actually dealing with an encrypted private key
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
		this.address = this.createAddress();

		if(password)
		{
			this.privateKeyEncrypted = this.encryptPrivateKey(password);
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
	private getPublicKeyHash(): Buffer
	{
		const output: Buffer = Buffer.allocUnsafe(3);

		output.writeInt16LE(this.chainId, 0);
		output.writeInt8(this.addressType, 2);

		return Buffer.concat([output, this.privateKeyHash()]);
	}

	/**
	 * Using the public key create the public address
	 */
	private createAddress(): string
	{
		const publicKeyHash: Buffer = this.getPublicKeyHash();

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
