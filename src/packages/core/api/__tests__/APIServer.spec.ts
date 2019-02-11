import { APIServerClass, IAPIConfig } from '../index';

describe('APIServer', () => {
	beforeEach(() => {
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('the api server is optional and has our default value', () => {

		const APIServer: IAPIConfig = {
			host: 'https://apiserver.nuls.io',
			base: '/nuls'
		};

		const APIServerTestNet: IAPIConfig = {
			host: 'http://testnet.apiserver.nuls.io',
			base: '/nuls'
		};

		const APIDefault = new APIServerClass();
		const APILive = new APIServerClass(APIServer);
		const APITest = new APIServerClass(APIServerTestNet);

		expect(APIDefault.url).toEqual('https://mock.com/mock');
		expect(APILive.url).toEqual('https://apiserver.nuls.io/nuls');
		expect(APITest.url).toEqual('http://testnet.apiserver.nuls.io/nuls');
	});

});
