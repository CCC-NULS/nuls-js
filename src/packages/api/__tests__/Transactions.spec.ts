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
		const response = {
			code: '10000',
			data: {
				address,
				assetsCode: null,
				blockHeight: null,
				id: null,
				locked: 0,
				usable: 3000000000000
			},
			msg: '\u64cd\u4f5c\u6210\u529f',
			success: true
		};

		mock.onGet(`${APIServerTestNet}${url}`).reply(200, response);

		const res = await transaction.getBalance(address);

		expect(res.status).toEqual(200);
		expect(res.data).toEqual(response);
		expect(res.config.url).toEqual(url);
	});
});
