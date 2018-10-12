// import * as NewAccount from './account/NewAccount';

export class Account
{
	/** ChainId */
	public chainId: number;
	/** Address type */
	public addressType: number;
	/** Private key of the public address */
	public privateKey?: string;

	public account: any;

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

		// this.account = new NewAccount(this.privateKey, this.addressType, this.chainId);
	}
}
