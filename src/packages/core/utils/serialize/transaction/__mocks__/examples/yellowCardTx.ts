import { ITransactionData } from '../../transaction';

export const yellowCardTxSerializedExample: string = 'BwDgC8Z1aAEAAQUBAQxq1yJVUaymmXJ/wasAmfIatc8s/////wA=';

export const yellowCardTxReadExample: ITransactionData = {
  type: 7,
  time: 1548164140000,
  remark: Buffer.from([]),
  txData: {
    addresses: ['TTaj3ig7xbXBK5F4xMfScrXhnFpuujMJ']
  },
  coinData: {
    inputs: [],
    outputs: []
  },
  scriptSign: Buffer.from([])
};
