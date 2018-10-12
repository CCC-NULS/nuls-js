jest.mock('crypto');

describe('create new accounts', () =>
{
	describe('valid private key', () =>
	{
		beforeEach(() =>
		{
			jest.resetModules();
			jest.clearAllMocks();
		});

		test('creating a new account', () =>
		{
			const { NewAccount } = require('@/packages/core/account/newAccount');
			const account = new NewAccount();

			expect(account.getAccount()).toEqual({
				address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
				privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
				publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
			});
		});

		test('creating multiple accounts', () =>
		{
			const { NewAccount } = require('@/packages/core/account/newAccount');
			let account = new NewAccount();

			expect(account.getAccount()).toEqual({
				address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
				privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
				publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
			});

			const { randomBytes } = require('crypto');
			const { publicKeyCreate } = require('secp256k1');

			publicKeyCreate.mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));
			randomBytes.mockReturnValue(Buffer.from('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b', 'hex'));

			account = new NewAccount();

			expect(account.getAccount()).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
				privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
				publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
			});
		});

		test('providing a private key', () =>
		{
			const { NewAccount } = require('@/packages/core/account/newAccount');
			const { publicKeyCreate } = require('secp256k1');

			publicKeyCreate.mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));

			const account = new NewAccount('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b');

			expect(account.getAccount()).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
				privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
				publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
			});
		});
	});

	describe('invalid private keys', () =>
	{
		beforeEach(() =>
		{
			jest.resetModules();
			jest.clearAllMocks();
		});

		test('providing and generating an invalid private key', () =>
		{
			const { NewAccount } = require('@/packages/core/account/newAccount');
			const { publicKeyCreate } = require('secp256k1');

			publicKeyCreate.mockImplementation(() =>
			{
				throw new Error();
			});

			expect(() => new NewAccount()).toThrowError('Invalid private key generated.');
			expect(() => new NewAccount('a')).toThrowError('Invalid private key provided.');
		});

		test('signing an invalid private key', () =>
		{
			const { NewAccount } = require('@/packages/core/account/newAccount');
			const { verify } = require('secp256k1');

			verify.mockReturnValue(false);

			expect(() => new NewAccount()).toThrowError('Something went wrong when validating the signature.');
		});
	});
});
