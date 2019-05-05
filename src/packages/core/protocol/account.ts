import * as bs58 from 'bs58';
import { randomBytes } from 'crypto';
import AES from 'crypto-js/aes';
import Hex from 'crypto-js/enc-hex';
import Base64 from 'crypto-js/enc-base64';

import * as secp256k1 from 'secp256k1';
import { getPrivateKeyBuffer, getXOR, sha256, ripemd160 } from '../utils';

export interface AccountObject {
	address: string;
	encryptedPrivateKey?: string;
	privateKey: string;
	publicKey: string;
}

export enum AddressType {
	Default = 1,
	Contract = 2
}

export enum ChainIdType {
	Testnet = 261,
	Mainnet = 8964
}

export enum CustomAddressPosition {
	end = 'end',
	start = 'start',
	anywhere = 'anywhere'
}

export interface AccountConstructor {
	new(): Account;
};

export type AccountClass = AccountConstructor & typeof Account

export class Account {

	/** The IV used for encrypting and decrypting private keys [View the NULS repo on IV](https://github.com/nuls-io/nuls/blob/4436795eabe864437de013b83aee0dca0d5400bf/tools-module/tools/src/main/java/io/nuls/core/tools/crypto/EncryptedData.java#L38) */
	private static IV = Hex.parse('0000000000000000');

	/** ChainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70) */
	private chainId: ChainIdType = ChainIdType.Mainnet;

	/** Address type The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76) */
	private addressType: AddressType = AddressType.Default;

	/** Private key of the public address */
	private privateKey: string = '';

	/** Private key encrypted using SHA256 and AESencryption */
	private encryptedPrivateKey?: string;

	/** Public key of the private key */
	private publicKey: string = '';

	/** Public address of the private key */
	private address: string = '';

	/** Private key HEX Buffer */
	private privateKeyBuffer: Buffer = Buffer.from([]);

	/** Public key HEX Buffer */
	private publicKeyBuffer: Buffer = Buffer.from([]);

	/**
	 * This will loop around until it finds a matching address
	 * @param str The string to look for in addresses created - The larger the string the harder it is to find
	 * @param password A plain text password for encrypting the private key
	 * @param caseSensitive Mark this as `true` to make the address case sensitive to your input `string`
	 * @param position The position of where `string` should be inside the address - Be aware that `start` is very difficult to find
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	public static createCustomAddress(str: string, password: string, caseSensitive: boolean = false, position: CustomAddressPosition = CustomAddressPosition.end, addressType: AddressType = AddressType.Default, chainId: ChainIdType = ChainIdType.Mainnet): AccountObject {
		const searchForText = caseSensitive ? str : str.toLowerCase();
		const appendAddresses = caseSensitive ? ['Nse', 'Nsd'] : ['nse', 'nsd'];
		const appendAddressesLoop = (usersAddress) => appendAddresses.find((appendAddress) => usersAddress.startsWith(`${appendAddress}${searchForText}`));
		let found = false,
			address,
			user;

		while (!found) {
			user = this.create(password, addressType, chainId);
			address = caseSensitive ? user.address : user.address.toLowerCase();

			switch (position) {
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
	 * @param privateKey A plain text or encrypted private key
	 * @param password A plain text password for encrypting the private key or decrypting the encrypted private key
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	public static import(privateKey: string, password?: string, addressType: AddressType = AddressType.Default, chainId: ChainIdType = ChainIdType.Mainnet): Account {

		try {

			// If a password exists and it's able to decrypt the private key then we're actually dealing with an encrypted private key
			if (password) {
				privateKey = this.decryptPrivateKey(privateKey, password) || privateKey;
			}

			const privateKeyBuffer = getPrivateKeyBuffer(privateKey);

			return this.createAccount(privateKeyBuffer, password, addressType, chainId);

		} catch (e) {

			throw new Error(`Error importing account: ${e}`);

		}
	}

	/**
	 * Initiates creating a new account and returns the data
	 * @param password A plain text password for encrypting the private key
	 * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
	 * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
	 */
	public static create(password?: string, addressType: AddressType = AddressType.Default, chainId: ChainIdType = ChainIdType.Mainnet): Account {

		try {

			const privateKeyBuffer = this.createPrivateKeyBuffer();

			return this.createAccount(privateKeyBuffer, password, addressType, chainId);

		} catch (e) {

			throw new Error(`Error creating account: ${e}`);

		}
	}

	private static createAccount(this: AccountClass, privateKeyBuffer: Buffer, password?: string, addressType: AddressType = AddressType.Default, chainId: ChainIdType = ChainIdType.Mainnet): Account {

		const account = new this();

		account.privateKeyBuffer = privateKeyBuffer;
		account.addressType = addressType;
		account.chainId = chainId;

		try {

			account.publicKeyBuffer = this.createPublicKeyBuffer(account.privateKeyBuffer);

		} catch (e) {

			throw new Error('Invalid private key');

		}

		account.privateKey = account.privateKeyBuffer.toString('hex');
		account.publicKey = account.publicKeyBuffer.toString('hex');

		account.address = this.getAddress(account.publicKeyBuffer, account.addressType, account.chainId);

		if (password) {
			account.encryptedPrivateKey = this.encryptPrivateKey(account.privateKey, password);
		}

		this.validateKeyPair(account.privateKeyBuffer, account.publicKeyBuffer);

		return account;

	}

	/**
	 * Validate the key pair
	 */
	private static validateKeyPair(privateKeyBuffer: Buffer, publicKeyBuffer: Buffer): void {

		const msg: Buffer = randomBytes(32);
		const { signature } = secp256k1.sign(msg, privateKeyBuffer);

		if (!secp256k1.verify(msg, signature, publicKeyBuffer)) {
			throw new Error('Something went wrong when validating the keypair signature');
		}
	}

	/**
	 * Encrypt the generated private key with the password using AES
	 */
	private static encryptPrivateKey(privateKey: string, password: string): string {

		const encryptedKey = AES.encrypt(
			Hex.parse(privateKey),
			Hex.parse(sha256(password).toString('hex')),
			{ iv: Account.IV }
		);

		return encryptedKey.ciphertext.toString();

	}

	/**
	 * Decrypt the provided private key with the password using AES
	 */
	private static decryptPrivateKey(encryptedPrivateKey: string, password: string): string {

		const decryptedKey = AES.decrypt(
			Base64.stringify(Hex.parse(encryptedPrivateKey)),
			Hex.parse(sha256(password).toString('hex')),
			{ iv: Account.IV }
		);

		return decryptedKey.toString();

	}

	private static createPrivateKeyBuffer(): Buffer {

		let privateKeyBuffer: Buffer;

		do {
			privateKeyBuffer = randomBytes(32);
		} while (!secp256k1.privateKeyVerify(privateKeyBuffer));

		return privateKeyBuffer;

	}

	private static createPublicKeyBuffer(privateKeyBuffer: Buffer): Buffer {

		return secp256k1.publicKeyCreate(privateKeyBuffer);

	}

	// https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/utils/AddressTool.java#L182
	/**
	 * Using the public key create the public address
	 */
	private static getAddress(publicKeyBuffer: Buffer, addressType: AddressType, chainId: ChainIdType): string {

		const addressHash: Buffer = this.getAddressHash(publicKeyBuffer, addressType, chainId);
		return bs58.encode(Buffer.concat([addressHash, Buffer.from([getXOR(addressHash)])]));

	}

	// https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/utils/AddressTool.java#L61
	// https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/model/Address.java#L120
	/**
	 * Creates the public key hash using encryption, chainId, and addressId
	 */
	private static getAddressHash(publicKeyBuffer: Buffer, addressType: AddressType, chainId: ChainIdType): Buffer {

		const output: Buffer = Buffer.allocUnsafe(3);
		const hash160: Buffer = ripemd160(sha256(publicKeyBuffer));

		output.writeInt16LE(chainId, 0);
		output.writeInt8(addressType, 2);

		return Buffer.concat([output, hash160]);

	}

	constructor() { }

	public switchChain(chainId: ChainIdType) {

		this.chainId = chainId;
		this.address = Account.getAddress(this.publicKeyBuffer, this.addressType, this.chainId);

	}

	/**
	 * Get the account generated
	 */
	public toObject(): AccountObject {

		const account: AccountObject = {
			address: this.address,
			privateKey: this.privateKey,
			publicKey: this.publicKey
		};

		if (this.encryptedPrivateKey) {
			account.encryptedPrivateKey = this.encryptedPrivateKey;
		}

		return account;

	}

}
