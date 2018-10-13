import * as bs58 from 'bs58';
import { randomBytes } from 'crypto';
// import RIPEMD160 from 'ripemd160'; // Works for Jest
// import * as RIPEMD160 from 'ripemd160'; // Works for WallabyJS // Recommended for Typescript
import * as secp256k1 from 'secp256k1';
import * as shajs from 'sha.js';

const RIPEMD160 = require('ripemd160'); // Holy shit balls Jest and WallayJS is finally happy!

interface IGetAccount
{
	address: string;
	privateKey: string;
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
	public privateKey?: string;

	/** Public address of the private key */
	private address?: string;
	/** Public key of the private key */
	private publicKey?: string;
	/** Private key HEX Buffer */
	private privateKeyBuffer?: Buffer;
	/** Public key HEX Buffer */
	private publicKeyBuffer?: Buffer;

	/**
	 * @param privateKey You can provide a private key to generate details based on this private key
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	constructor(privateKey?: string, addressType: number = 1, chainId: number = 8964)
	{
		this.chainId = chainId;
		this.addressType = addressType;
		this.privateKey = privateKey;
		// this.startTime = Date.now();
		this.createAccount();
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
			publicKey: this.publicKey
		};
	}

	/**
	 * Initiates creating a new account and returns the data
	 */
	public createAccount(): IGetAccount | null
	{
		if(this.privateKey) // If a private key already exists we use it
		{
			this.privateKeyBuffer = this.stringToHex(this.privateKey); // Turn it into a buffer for reading
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
			if(this.privateKey)
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
	 * Encrypts the private key buffer using sha256 and hash160
	 */
	private privateKeyHash(): Buffer
	{
		// sha256hash160
		// https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/utils/AddressTool.java#L61
		const sha: Buffer = new shajs.sha256().update(this.publicKeyBuffer).digest();
		const hash: Buffer = new RIPEMD160().update(sha).digest();

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
	private stringToHex(str?: string): Buffer | undefined
	{
		if(!str) return undefined;

		return Buffer.from(str, 'hex');
	}

	/**
	 * Buffer to string
	 */
	private hexToString(hex?: Buffer): string | undefined
	{
		if(!hex) return undefined;

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
