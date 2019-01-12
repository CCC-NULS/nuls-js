import { AddressType, ChainIdType, CustomAddressPosition } from '@/index';

jest.mock('crypto');

describe('create new accounts', () => {
	let account: Account;

	describe('valid private key', () => {
		describe('create', () => {
			beforeEach(() => {
				jest.resetModules();
				jest.clearAllMocks();
			});

			test('creating a new account', () => {
				const { Account } = require('@/index');
				account = new Account();

				expect(account.create()).toEqual({
					address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
					prikey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
					pubKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});
			});

			test('creating a contract account and different chainId', () => {
				const { Account } = require('@/index');
				const { randomBytes } = require('crypto');
				const { publicKeyCreate } = require('secp256k1');

				account = new Account();

				randomBytes.mockReturnValue(Buffer.from('2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402', 'hex'));

				expect(account.create(undefined, AddressType.Contract, 9000)).toEqual({
					address: '4fDyBjzqYi5bfqMDT9ggC8SdLtvfw88Yu',
					prikey: '2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402',
					pubKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				expect(account.create('Password1!', AddressType.Contract, 9000)).toEqual({
					address: '4fDyBjzqYi5bfqMDT9ggC8SdLtvfw88Yu',
					encryptedPrivateKey: '5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e',
					prikey: '2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402',
					pubKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				randomBytes.mockReturnValue(Buffer.from('af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f', 'hex'));
				publicKeyCreate.mockReturnValue(Buffer.from('020ddd85313e4472d9226217631c278ae958d971eb450ce746cabebd6cad2c2b57', 'hex'));

				expect(account.create(undefined, AddressType.Contract, undefined)).toEqual({
					address: 'NseAJWR2ADH2BE1LB2mmzAv83mMAwRrr',
					prikey: 'af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f',
					pubKey: '020ddd85313e4472d9226217631c278ae958d971eb450ce746cabebd6cad2c2b57'
				});

				randomBytes.mockReturnValue(Buffer.from('0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0', 'hex'));
				publicKeyCreate.mockReturnValue(Buffer.from('02d868f43a77be7222c49b25aea6848fd56a074cb7464f520883970a84e3c6ff4c', 'hex'));

				expect(account.create(undefined, undefined, 9000)).toEqual({
					address: '4fDxuLT7te9PZMSymWenrpiJdP4W5Phgp',
					prikey: '0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0',
					pubKey: '02d868f43a77be7222c49b25aea6848fd56a074cb7464f520883970a84e3c6ff4c'
				});

				account.switchChain(ChainIdType.Testnet);
				expect(account.create().address).toEqual('TTapxY8ZmLd2qZ2uw9doYBxivLmXvaHF');

				account.switchChain(ChainIdType.Mainnet);
				expect(account.create().address).toEqual('Nsdzo27Y8zRx6iausVr9vec9hoZLhbnp');

				account.switchChain(9000);
				expect(account.create().address).toEqual('4fDxuLT7te9PZMSymWenrpiJdP4W5Phgp');
			});

			test('creating a new account with a password', () => {
				const { Account } = require('@/index');

				account = new Account();

				expect(account.create('Password1!')).toEqual({
					address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
					encryptedPrivateKey: 'b39747ac8e9aa114f6a173d29f57d70082de584704b399b6de0a51804f45f9b24eca1a53ed8b64e9c73b8297b8cc3faf',
					prikey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
					pubKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});
			});

			test('creating multiple accounts', () => {
				const { Account } = require('@/index');
				const { randomBytes } = require('crypto');
				const { publicKeyCreate } = require('secp256k1');

				account = new Account();

				expect(account.create('Password1!')).toEqual({
					address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
					encryptedPrivateKey: 'b39747ac8e9aa114f6a173d29f57d70082de584704b399b6de0a51804f45f9b24eca1a53ed8b64e9c73b8297b8cc3faf',
					prikey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
					pubKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				publicKeyCreate.mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));
				randomBytes.mockReturnValue(Buffer.from('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b', 'hex'));

				expect(account.create()).toEqual({
					address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
					prikey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
					pubKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
				});
			});
		});

		describe('import', () => {
			beforeEach(() => {
				jest.resetModules();
				jest.clearAllMocks();
			});

			test('providing an unencrypted private key', () => {
				const { Account } = require('@/index');
				const { publicKeyCreate } = require('secp256k1');

				account = new Account();

				publicKeyCreate.mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));

				expect(account.import('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b')).toEqual({
					address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
					prikey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
					pubKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
				});
			});

			test('decrypting a private key', () => {
				const { Account } = require('@/index');
				const { publicKeyCreate } = require('secp256k1');

				account = new Account();

				publicKeyCreate.mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));

				expect(account.import('6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01', 'Password1!')).toEqual({
					address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
					encryptedPrivateKey: '6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01',
					prikey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
					pubKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
				});
			});

			test('importing a contract account and different chainId', () => {
				const { Account } = require('@/index');
				const { randomBytes } = require('crypto');
				const { publicKeyCreate } = require('secp256k1');

				account = new Account();

				randomBytes.mockReturnValue(Buffer.from('2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402', 'hex'));
				publicKeyCreate.mockReturnValue(Buffer.from('02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b', 'hex'));

				expect(account.import('2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402', undefined, AddressType.Contract, 9000)).toEqual({
					address: '4fDyBjzqYi5bfqMDT9ggC8SdLtvfw88Yu',
					prikey: '2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402',
					pubKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				expect(account.import('5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e', 'Password1!', AddressType.Contract, 9000)).toEqual({
					address: '4fDyBjzqYi5bfqMDT9ggC8SdLtvfw88Yu',
					encryptedPrivateKey: '5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e',
					prikey: '2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402',
					pubKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				randomBytes.mockReturnValue(Buffer.from('af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f', 'hex'));
				publicKeyCreate.mockReturnValue(Buffer.from('020ddd85313e4472d9226217631c278ae958d971eb450ce746cabebd6cad2c2b57', 'hex'));

				expect(account.import('af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f', undefined, AddressType.Contract, undefined)).toEqual({
					address: 'NseAJWR2ADH2BE1LB2mmzAv83mMAwRrr',
					prikey: 'af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f',
					pubKey: '020ddd85313e4472d9226217631c278ae958d971eb450ce746cabebd6cad2c2b57'
				});

				randomBytes.mockReturnValue(Buffer.from('0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0', 'hex'));
				publicKeyCreate.mockReturnValue(Buffer.from('02d868f43a77be7222c49b25aea6848fd56a074cb7464f520883970a84e3c6ff4c', 'hex'));

				expect(account.import('0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0', undefined, undefined, 9000)).toEqual({
					address: '4fDxuLT7te9PZMSymWenrpiJdP4W5Phgp',
					prikey: '0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0',
					pubKey: '02d868f43a77be7222c49b25aea6848fd56a074cb7464f520883970a84e3c6ff4c'
				});
			});

			test('importing an account without a password and adding a password', () => {
				const { Account } = require('@/index');
				const { publicKeyCreate } = require('secp256k1');

				account = new Account();

				publicKeyCreate.mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));

				expect(account.import('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b', 'Password1!')).toEqual({
					address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
					encryptedPrivateKey: '6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01',
					prikey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
					pubKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
				});
			});
		});
	});

	describe('createCustomAddress', () => {
		beforeEach(() => {
			jest.resetModules();
			jest.clearAllMocks();
		});

		const addresses = [
			{
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjOsH',
				helloWorld: true
			},
			{
				address: 'Nse8Ar5XvuPdDJOSHnkK4LDwDNZqTqYx',
				helloWorld: true
			},
			{
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
				helloWorld: true
			},
			{
				address: 'NsejoShXvuPdDCYcTnkK4LDwDNZqTqYx',
				helloWorld: true
			}
		];

		test('find `josh` where caseSensitive=false and position=end', () => {
			const { Account } = require('@/index');

			account = new Account();

			account.create = jest.fn(() => {
				const i = Math.floor((Math.random() * 4) + 1);

				return addresses[i - 1];
			});

			expect(account.createCustomAddress('josh', 'Password1!')).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjOsH',
				helloWorld: true
			});
		});

		test('find `josh` where caseSensitive=true and position=end', () => {
			const { Account } = require('@/index');

			account = new Account();

			account.create = jest.fn(() => {
				const i = Math.floor((Math.random() * 2) + 1);
				const addresses2 = [
					{
						address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqJOSH',
						helloWorld: true
					},
					{
						address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjosh',
						helloWorld: true
					}
				];

				return addresses2[i - 1];
			});

			expect(account.createCustomAddress('JOSH', 'Password1!', true)).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqJOSH',
				helloWorld: true
			});
		});

		test('find `josh` where caseSensitive=false and position=start', () => {
			const { Account } = require('@/index');

			account = new Account();

			account.create = jest.fn(() => {
				const i = Math.floor((Math.random() * 4) + 1);

				return addresses[i - 1];
			});

			expect(account.createCustomAddress('josh', 'Password1!', false, CustomAddressPosition.start)).toEqual({
				address: 'NsejoShXvuPdDCYcTnkK4LDwDNZqTqYx',
				helloWorld: true
			});
		});

		test('find `josh` where caseSensitive=false and position=anywhere', () => {
			const { Account } = require('@/index');

			account = new Account();

			account.create = jest.fn(() => {
				const i = Math.floor((Math.random() * 2) + 1);
				const addresses2 = [
					{
						address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjosh',
						helloWorld: true
					},
					{
						address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
						helloWorld: true
					}
				];

				return addresses2[i - 1];
			});

			expect(account.createCustomAddress('josh', 'Password1!', false, CustomAddressPosition.anywhere)).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjosh',
				helloWorld: true
			});

			account.create = jest.fn(() => {
				const i = Math.floor((Math.random() * 2) + 1);
				const addresses2 = [
					{
						address: 'Nse8Ar5XvuPdDJOSHnkK4LDwDNZqTqYx',
						helloWorld: true
					},
					{
						address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
						helloWorld: true
					}
				];

				return addresses2[i - 1];
			});

			expect(account.createCustomAddress('josh', 'Password1!', false, CustomAddressPosition.anywhere)).toEqual({
				address: 'Nse8Ar5XvuPdDJOSHnkK4LDwDNZqTqYx',
				helloWorld: true
			});
		});

		// TODO: Review this test (only CustomAddressPosition supported values)
		// test('find `josh` where caseSensitive=false and position=asdf', () => {

		// 	account.create = jest.fn(() => {
		// 		const i = Math.floor((Math.random() * 2) + 1);

		// 		return addresses[i - 1];
		// 	});

		// 	expect(account.createCustomAddress('josh', 'Password1!', false, 'asdf')).toEqual({
		// 		address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjOsH',
		// 		helloWorld: true
		// 	});
		// });

		test('contract address and custom chainId', () => {
			const { Account } = require('@/index');

			account = new Account();

			const createSpy = jest.spyOn(account, 'create').mockImplementation(() => {
				const i = Math.floor((Math.random() * 4) + 1);

				return addresses[i - 1];
			});

			const customAccount = account.createCustomAddress('josh', 'Password1!', undefined, undefined, AddressType.Contract, 9000);

			expect(customAccount).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjOsH',
				helloWorld: true
			});

			expect(createSpy.mock.calls[0]).toEqual(['Password1!', AddressType.Contract, 9000]);
		});
	});

	describe('invalid private keys', () => {
		beforeEach(() => {
			jest.resetModules();
			jest.clearAllMocks();
		});

		test('providing and generating an invalid private key', () => {
			const { Account } = require('@/index');
			const { publicKeyCreate } = require('secp256k1');

			account = new Account();

			publicKeyCreate.mockImplementation(() => {
				throw new Error();
			});

			expect(() => account.create()).toThrowError('Invalid private key generated.');
			expect(() => account.import('foo', undefined)).toThrowError('Invalid private key provided.');
			expect(() => account.import('0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0', 'bar')).toThrowError('Invalid password or encrypted private key provided.');
		});

		test('signing an invalid private key', () => {
			const { Account } = require('@/index');
			const { verify } = require('secp256k1');

			account = new Account();

			verify.mockReturnValue(false);

			expect(() => account.create()).toThrowError('Something went wrong when validating the signature.');
		});
	});
});
