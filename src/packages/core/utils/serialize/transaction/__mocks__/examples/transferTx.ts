import { ITransactionData } from '../../transaction';
import { TxDataTransferSerializer } from '../../txData';

export const transferTxSerializedExample: string = 'AgAQRv9raAEQdGVzdCB0cmFuc2ZlciA6Kf////8BIwAgFWYJbynNhRsI/l8PARyvKi9t3b4LJ5sPZYwQAu7RFLUC0XseBgAAAAD9bggAAAACFwUBAYNkpQfb2ZAfRKPWP0AaCgFPt3+DMRQnAAAAAAAAAAAAAAAXBQEBrGb4CnFZS0fBSjSVTGkKisxuXjwA4fUFAAAAAAAAAAAAAGshAySUJVBSO9nLWF/MI8sCDJF7oT2AYjCF+g4+ZRSubyJyAEcwRQIhAIZFa62vx61F/icvBIn8KlfDrUC5/WywVyXPvXv3i0LFAiA6w+O7c03yyqnB92Itt5SRSfjGA/oydaVds4cBFcRHgA==';

export const transferTxReadExample: ITransactionData = {
  type: 2,
  time: 1548000118288,
  remark: Buffer.from('test transfer :)', 'utf-8'),
  txData: { placeholder: TxDataTransferSerializer.PLACE_HOLDER },
  coinData: {
    inputs: [
      {
        owner: Buffer.from('00201566096f29cd851b08fe5f0f011caf2a2f6dddbe0b279b0f658c1002eed114b502', 'hex'),
        na: 102661073,
        lockTime: 552701
      }
    ],
    outputs: [
      {
        owner: Buffer.from('0501018364a507dbd9901f44a3d63f401a0a014fb77f83', 'hex'),
        na: 2561073,
        lockTime: 0,
      },
      {
        owner: Buffer.from('050101ac66f80a71594b47c14a34954c690a8acc6e5e3c', 'hex'),
        na: 100000000,
        lockTime: 0,
      }
    ]
  },
  scriptSign: Buffer.from('210324942550523bd9cb585fcc23cb020c917ba13d80623085fa0e3e6514ae6f22720047304502210086456badafc7ad45fe272f0489fc2a57c3ad40b9fd6cb05725cfbd7bf78b42c502203ac3e3bb734df2caa9c1f7622db7949149f8c603fa3275a55db3870115c44780', 'hex')
};
