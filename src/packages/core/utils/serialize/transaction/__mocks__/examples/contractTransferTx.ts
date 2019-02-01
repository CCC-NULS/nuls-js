import { ITransactionData } from '../../transaction';

export const contractTransferTxSerializedExample: string = 'ZwCwmiiWaAEAACBvD8JVi7GaLYROgDs0oO3QtVI0s8Ash0qy5sA4CNTWpQUBAkw/rzEoRj8rM2DURX0zwtFYri2mAQEjACDnhrx5L/1tv4IETc/t1XMlySWTpzLTpuzovKYVgR9/TgAA5AtUAgAAAAAAAAAAAAEXBQEBGDXuDQQkpMRc1lWAuDwVrFh6xd4A5AtUAgAAAAAAAAAAAAA=';

export const contractTransferTxReadExample: ITransactionData = {
  type: 103,
  time: 1548707470000,
  remark: Buffer.from([]),
  txData: {
    orginTxHash: '00206f0fc2558bb19a2d844e803b34a0edd0b55234b3c02c874ab2e6c03808d4d6a5',
    contractAddress: 'TTb4iQEYkXDy3RDJ1yk2ebNGQMUbJPPx',
    success: true
  },
  coinData: {
    inputs: [
      {
        owner: Buffer.from('0020e786bc792ffd6dbf82044dcfedd57325c92593a732d3a6ece8bca615811f7f4e00', 'hex'),
        na: 10000000000,
        lockTime: 0
      }
    ],
    outputs: [
      {
        owner: Buffer.from('0501011835ee0d0424a4c45cd65580b83c15ac587ac5de', 'hex'),
        na: 10000000000,
        lockTime: 0
      }
    ]
  },
  scriptSign: Buffer.from([])
};
