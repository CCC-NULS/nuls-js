import { Account, AddressType, ChainIdType, CustomAddressPosition } from '../../index';
import { randomBytes } from 'crypto';
import { publicKeyCreate, verify } from 'secp256k1';

jest.mock('crypto');
jest.mock('secp256k1');

describe('create new accounts', () => {

	beforeEach(() => {
		jest.restoreAllMocks();
	});
 
	describe('valid private key', () => {

		describe('create', () => {

			it('creating a new account', () => {

				expect(Account.create().toObject()).toEqual({
					address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
					privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
					publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});
			});

			it('creating a contract account and different chainId', () => {

				(randomBytes as jest.Mock).mockReturnValue(Buffer.from('2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402', 'hex'));

				expect(Account.create(undefined, AddressType.Contract, 9000).toObject()).toEqual({
					address: '4fDyBjzqYi5bfqMDT9ggC8SdLtvfw88Yu',
					privateKey: '2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402',
					publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				expect(Account.create('Password1!', AddressType.Contract, 9000).toObject()).toEqual({
					address: '4fDyBjzqYi5bfqMDT9ggC8SdLtvfw88Yu',
					encryptedPrivateKey: '5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e',
					privateKey: '2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402',
					publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				(randomBytes as jest.Mock).mockReturnValue(Buffer.from('af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f', 'hex'));
				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('020ddd85313e4472d9226217631c278ae958d971eb450ce746cabebd6cad2c2b57', 'hex'));

				expect(Account.create(undefined, AddressType.Contract, undefined).toObject()).toEqual({
					address: 'NseAJWR2ADH2BE1LB2mmzAv83mMAwRrr',
					privateKey: 'af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f',
					publicKey: '020ddd85313e4472d9226217631c278ae958d971eb450ce746cabebd6cad2c2b57'
				});

				(randomBytes as jest.Mock).mockReturnValue(Buffer.from('0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0', 'hex'));
				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('02d868f43a77be7222c49b25aea6848fd56a074cb7464f520883970a84e3c6ff4c', 'hex'));

				expect(Account.create(undefined, undefined, 9000).toObject()).toEqual({
					address: '4fDxuLT7te9PZMSymWenrpiJdP4W5Phgp',
					privateKey: '0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0',
					publicKey: '02d868f43a77be7222c49b25aea6848fd56a074cb7464f520883970a84e3c6ff4c'
				});

				const account = Account.create();

				account.switchChain(ChainIdType.Testnet);
				expect(account.toObject().address).toEqual('TTapxY8ZmLd2qZ2uw9doYBxivLmXvaHF');

				account.switchChain(ChainIdType.Mainnet);
				expect(account.toObject().address).toEqual('Nsdzo27Y8zRx6iausVr9vec9hoZLhbnp');

				account.switchChain(9000);
				expect(account.toObject().address).toEqual('4fDxuLT7te9PZMSymWenrpiJdP4W5Phgp');
			});

			it('creating a new account with a password', () => {

				(randomBytes as jest.Mock).mockReturnValue(Buffer.from('889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97', 'hex'));
				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b', 'hex'));

				expect(Account.create('Password1!').toObject()).toEqual({
					address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
					encryptedPrivateKey: 'b39747ac8e9aa114f6a173d29f57d70082de584704b399b6de0a51804f45f9b24eca1a53ed8b64e9c73b8297b8cc3faf',
					privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
					publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});
			});

			it('creating multiple accounts', () => {

				(randomBytes as jest.Mock).mockReturnValue(Buffer.from('889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97', 'hex'));
				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b', 'hex'));

				expect(Account.create('Password1!').toObject()).toEqual({
					address: 'Nse1TYHc6Rxs84iimrnygSF2kqrUAQM6',
					encryptedPrivateKey: 'b39747ac8e9aa114f6a173d29f57d70082de584704b399b6de0a51804f45f9b24eca1a53ed8b64e9c73b8297b8cc3faf',
					privateKey: '889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97',
					publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));
				(randomBytes as jest.Mock).mockReturnValue(Buffer.from('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b', 'hex'));

				expect(Account.create().toObject()).toEqual({
					address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
					privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
					publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
				});
			});
		});

		describe('import', () => {

			it('providing an unencrypted private key', () => {

				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));

				expect(Account.import('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b').toObject()).toEqual({
					address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
					privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
					publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
				});
			});

			it('decrypting a private key', () => {

				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));

				expect(Account.import('6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01', 'Password1!').toObject()).toEqual({
					address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
					encryptedPrivateKey: '6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01',
					privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
					publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
				});
			});

			it('importing a contract account and different chainId', () => {

				(randomBytes as jest.Mock).mockReturnValue(Buffer.from('2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402', 'hex'));
				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b', 'hex'));

				expect(Account.import('2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402', undefined, AddressType.Contract, 9000).toObject()).toEqual({
					address: '4fDyBjzqYi5bfqMDT9ggC8SdLtvfw88Yu',
					privateKey: '2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402',
					publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				expect(Account.import('5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e', 'Password1!', AddressType.Contract, 9000).toObject()).toEqual({
					address: '4fDyBjzqYi5bfqMDT9ggC8SdLtvfw88Yu',
					encryptedPrivateKey: '5af6f2f9aa014d467c22a7523ed352a0eaed4816b4caa3cc52c15d68d627089db055f95d3de88e01fab28d2fa96fb10e',
					privateKey: '2e4fa652034f495089daebb9a390600cb144eafe3fe34fad0750ee9674dfc402',
					publicKey: '02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b'
				});

				(randomBytes as jest.Mock).mockReturnValue(Buffer.from('af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f', 'hex'));
				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('020ddd85313e4472d9226217631c278ae958d971eb450ce746cabebd6cad2c2b57', 'hex'));

				expect(Account.import('af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f', undefined, AddressType.Contract, undefined).toObject()).toEqual({
					address: 'NseAJWR2ADH2BE1LB2mmzAv83mMAwRrr',
					privateKey: 'af39d78c05f4c16be7e5bc6ab0dd0bcb5313f787ac6bac999b5b6a36c5d35b3f',
					publicKey: '020ddd85313e4472d9226217631c278ae958d971eb450ce746cabebd6cad2c2b57'
				});

				(randomBytes as jest.Mock).mockReturnValue(Buffer.from('0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0', 'hex'));
				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('02d868f43a77be7222c49b25aea6848fd56a074cb7464f520883970a84e3c6ff4c', 'hex'));

				expect(Account.import('0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0', undefined, undefined, 9000).toObject()).toEqual({
					address: '4fDxuLT7te9PZMSymWenrpiJdP4W5Phgp',
					privateKey: '0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0',
					publicKey: '02d868f43a77be7222c49b25aea6848fd56a074cb7464f520883970a84e3c6ff4c'
				});
			});

			it('importing an account without a password and adding a password', () => {

				(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f', 'hex'));

				expect(Account.import('2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b', 'Password1!').toObject()).toEqual({
					address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqTqYx',
					encryptedPrivateKey: '6f1a067690b4481de3743de3f015da5f172d939b5b1b4842c16977278a9c1fb914adc6079df87c70ab6cef422d6add01',
					privateKey: '2d5ed8706749f6d7c096772a075c027f56fae4148bacbf6c78b59df09f84b07b',
					publicKey: '033f4031d22289befe017472bb954b59d9ba043ce67fbc60c50ee3a48c56b89b1f'
				});
			});
		});

	});

	describe('createCustomAddress', () => {

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

		it('find `josh` where caseSensitive=false and position=end', () => {

			jest.spyOn(Account, 'create').mockImplementation(() => {
				const i = Math.floor((Math.random() * 4) + 1);

				return addresses[i - 1];
			});

			expect(Account.createCustomAddress('josh', 'Password1!')).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjOsH',
				helloWorld: true
			});
		});

		it('find `josh` where caseSensitive=true and position=end', () => {

			jest.spyOn(Account, 'create').mockImplementation(() => {
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

			expect(Account.createCustomAddress('JOSH', 'Password1!', true)).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqJOSH',
				helloWorld: true
			});
		});

		it('find `josh` where caseSensitive=false and position=start', () => {

			jest.spyOn(Account, 'create').mockImplementation(() => {
				const i = Math.floor((Math.random() * 4) + 1);

				return addresses[i - 1];
			});

			expect(Account.createCustomAddress('josh', 'Password1!', false, CustomAddressPosition.start)).toEqual({
				address: 'NsejoShXvuPdDCYcTnkK4LDwDNZqTqYx',
				helloWorld: true
			});
		});

		it('find `josh` where caseSensitive=false and position=anywhere', () => {

			jest.spyOn(Account, 'create').mockImplementation(() => {
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

			expect(Account.createCustomAddress('josh', 'Password1!', false, CustomAddressPosition.anywhere)).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjosh',
				helloWorld: true
			});

			jest.spyOn(Account, 'create').mockImplementation(() => {
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

			expect(Account.createCustomAddress('josh', 'Password1!', false, CustomAddressPosition.anywhere)).toEqual({
				address: 'Nse8Ar5XvuPdDJOSHnkK4LDwDNZqTqYx',
				helloWorld: true
			});
		});

		// TODO: Review this test (only CustomAddressPosition supported values)
		// it('find `josh` where caseSensitive=false and position=asdf', () => {

		// 	jest.spyOn(Account, 'create').mockImplementation(() => {
		// 		const i = Math.floor((Math.random() * 2) + 1);

		// 		return addresses[i - 1];
		// 	});

		// 	expect(Account.createCustomAddress('josh', 'Password1!', false, 'asdf')).toEqual({
		// 		address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjOsH',
		// 		helloWorld: true
		// 	});
		// });

		it('contract address and custom chainId', () => {

			const createSpy = jest.spyOn(Account, 'create').mockImplementation(() => {
				const i = Math.floor((Math.random() * 4) + 1);

				return addresses[i - 1];
			});

			const customAccount = Account.createCustomAddress('josh', 'Password1!', undefined, undefined, AddressType.Contract, 9000);

			expect(customAccount).toEqual({
				address: 'Nse8Ar5XvuPdDCYcTnkK4LDwDNZqjOsH',
				helloWorld: true
			});

			expect(createSpy.mock.calls[0]).toEqual(['Password1!', AddressType.Contract, 9000]);
		});
	});

	describe('invalid private keys', () => {
	
		it('providing and generating an invalid private key', () => {

			(publicKeyCreate as jest.Mock).mockImplementation(() => {
				throw new Error();
			});

			expect(() => Account.create()).toThrowError('Error creating account: Error: Invalid private key');
			expect(() => Account.import('foo', undefined)).toThrowError('Error importing account: Error: Invalid private key provided');
			expect(() => Account.import('0b49a019cc0ddd0eee422b944dda8926df46744e550123b3a0faa8f19ba221e0', 'bar')).toThrowError('Error importing account: Error: Invalid private key provided');
		});

		it('signing an invalid private key', () => {

			(publicKeyCreate as jest.Mock).mockReturnValue(Buffer.from('020ddd85313e4472d9226217631c278ae958d971eb450ce746cabebd6cad2c2b57', 'hex'));
			(verify as jest.Mock).mockReturnValue(false);

			expect(() => Account.create()).toThrowError('Something went wrong when validating the keypair signature');
		});
	});
});
