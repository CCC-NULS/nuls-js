import { ITransactionData } from '../../transaction';

export const withdrawTxSerializedExample: string = 'BgANazRsaAEAACAv1he9eSpqgyqVP8FcAqcxKnFGXWeHvF2WyRw+y8ckOAEjACAv1he9eSpqgyqVP8FcAqcxKnFGXWeHvF2WyRw+y8ckOAAA0O2QLgAAAP///////wEXBQEBg2SlB9vZkB9Eo9Y/QBoKAU+3f4PAjd6QLgAAAAAAAAAAAGohAySUJVBSO9nLWF/MI8sCDJF7oT2AYjCF+g4+ZRSubyJyAEYwRAIgFR0uebHJhCRfjU9P2KFu7wStP9fTJd3om6WT8e5VHaoCIBUbO4p4dzKoxOacWiAalfxMOddOdaQ1QhzwiEvt9wjc';

export const withdrawTxReadExample: ITransactionData = {
  type: 6,
  time: 1548003601165,
  remark: Buffer.from([]),
  txData: {
    depositHash: '00202fd617bd792a6a832a953fc15c02a7312a71465d6787bc5d96c91c3ecbc72438'
  },
  coinData: {
    inputs: [
      {
        owner: Buffer.from('00202fd617bd792a6a832a953fc15c02a7312a71465d6787bc5d96c91c3ecbc7243800', 'hex'),
        na: 200000000000,
        lockTime: -1
      }
    ],
    outputs: [
      {
        owner: Buffer.from('0501018364a507dbd9901f44a3d63f401a0a014fb77f83', 'hex'),
        na: 199999000000,
        lockTime: 0,
      }
    ]
  },
  scriptSign: Buffer.from('210324942550523bd9cb585fcc23cb020c917ba13d80623085fa0e3e6514ae6f2272004630440220151d2e79b1c984245f8d4f4fd8a16eef04ad3fd7d325dde89ba593f1ee551daa0220151b3b8a787732a8c4e69c5a201a95fc4c39d74e75a435421cf0884bedf708dc', 'hex')
};
