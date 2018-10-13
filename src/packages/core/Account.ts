const { NewAccount } = require('@/packages/core/account/NewAccount');

export class Account extends NewAccount
{
	constructor(privateKey?: number, addressType: number = 1, chainId: number = 8964)
	{
		super(privateKey, addressType, chainId);
	}
}
