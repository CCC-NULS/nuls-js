import { APIServerTestNet, Transactions } from '@/index';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
const transaction = new Transactions(APIServerTestNet);
const address = 'TTapFc7eSWpUxNjQRUiLddEMVuBN9a7g';

describe('transactions', () =>
{
	beforeEach(() =>
	{
		jest.resetModules();
		jest.clearAllMocks();
	});

	test('get balance', async () =>
	{
		const url = `/balance/get/${address}`;
		const response = { call: 'getBalance' };

		mock.onGet(`${APIServerTestNet}${url}`).reply(200, response);

		const res = await transaction.getBalance(address);

		expect(res.status).toEqual(200);
		expect(res.data).toEqual(response);
		expect(res.config.url).toEqual(url);
	});

	test('get the latest block', async () =>
	{
		const url = '/block/newest';
		const response = { call: 'latestBlock' };

		mock.onGet(`${APIServerTestNet}${url}`).reply(200, response);

		const res = await transaction.getLatestBlock();

		expect(res.status).toEqual(200);
		expect(res.data).toEqual(response);
		expect(res.config.url).toEqual(url);
	});

	test('get transaction', async () =>
	{
		const url = '/tx/hash/00200c80b7f36270c94a67341c8664a7251e0e61f41b59f714e0493e21904f823bb5';
		const response = { call: 'getTransaction' };

		mock.onGet(`${APIServerTestNet}${url}`).reply(200, response);

		const res = await transaction.getTransaction('00200c80b7f36270c94a67341c8664a7251e0e61f41b59f714e0493e21904f823bb5');

		expect(res.status).toEqual(200);
		expect(res.data).toEqual(response);
		expect(res.config.url).toEqual(url);
	});
});
