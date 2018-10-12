interface IGetAccount {
    address: string;
    privateKey: string;
    publicKey: string;
}
export declare class NewAccount {
    /** ChainId */
    chainId: number;
    /** Address type */
    addressType: number;
    /** Public address of the private key */
    private address?;
    /** Private key of the public address */
    private privateKey?;
    /** Public key of the private key */
    private publicKey?;
    /** Private key HEX Buffer */
    private privateKeyBuffer?;
    /** Public key HEX Buffer */
    private publicKeyBuffer?;
    /**
     * @param privateKey You can provide a private key to generate details based on this private key
     * @param addressType The default address type, a chain can contain several address types, and the address type is contained in the address. [View the NULS repo on addressType](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L76).
     * @param chainId The default chain id (NULS main chain), the chain id affects the generation of the address. [View the NULS repo on chainId](https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/context/NulsContext.java#L70).
     */
    constructor(privateKey?: string, addressType?: number, chainId?: number);
    /**
     * Old debug function to be used if needed
     */
    /**
     * Get the account generated
     */
    getAccount(): IGetAccount | null;
    /**
     * Initiates creating a new account and returns the data
     */
    createAccount(): IGetAccount | null;
    /**
     * Validate the private key
     */
    private validatePrivateKey;
    /**
     * Encrypts the private key buffer using sha256 and hash160
     */
    private privateKeyHash;
    /**
     * Creates the public key hash using encryption, chainId, and addressId
     */
    private getPublicKeyHash;
    /**
     * Using the public key create the public address
     */
    private createAddress;
    /**
     * String to buffer
     */
    private stringToHex;
    /**
     * Buffer to string
     */
    private hexToString;
}
export {};
