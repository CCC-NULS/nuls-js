import { APIServerTestNet, Transactions } from '@/index';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);
const transaction = new Transactions(APIServerTestNet);
const address = 'TTapFc7eSWpUxNjQRUiLddEMVuBN9a7g';

describe.only('transactions', () =>
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

	test('get the latest block;', async () =>
	{
		const url = '/block/newest';
		const response = { call: 'latestBlock' };

		mock.onGet(`${APIServerTestNet}${url}`).reply(200, response);

		const res = await transaction.latestBlock();

		expect(res.status).toEqual(200);
		expect(res.data).toEqual(response);
		expect(res.config.url).toEqual(url);
	});
});
