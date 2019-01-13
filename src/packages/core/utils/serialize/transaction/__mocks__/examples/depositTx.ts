import { ITransactionData } from '../../transaction';

export const depositTxSerializedExample: string = 'BQBW+PdXZgEAAEDlnDASAAAFAQGGZ1hlvLdP8tWZv/zlL3Y4txLfzQAgD3TkVrC8yizZRn2ReLoLARlwUyvw73OxT+n6egtbCPYBIwAgD3TkVrC8yizZRn2ReLoLARlwUyvw73OxT+n6egtbCPYBgNrMAU57AwAAAAAAAAACFwUBAYZnWGW8t0/y1Zm//OUvdji3Et/NAEDlnDASAAD///////8XBQEBhmdYZby3T/LVmb/85S92OLcS381AWNhkHWkDAAAAAAAAAGshAqDOwgNe5UCglRCkU3KfqdzO7wm9S/42+uKtN+b093YsAEcwRQIhAMmTXuYAiSYv0YrZ/j7S3MPNaixLH8eM5BsHAvh6VZL0AiASSJaLrZ8St+mkJnOam67XiU1IW81HvJVKQmiNlWETOA==';

export const depositTxReadExample: ITransactionData = {
  type: 5,
  time: 1539074160726,
  remark: Buffer.from([]),
  txData: {
    deposit: 20000000000000,
    address: 'TTarYnUfsftmm7DrStandCEdd4SNiELS',
    agentHash: '00200f74e456b0bcca2cd9467d9178ba0b011970532bf0ef73b14fe9fa7a0b5b08f6'
  },
  coinData: {
    inputs: [
      {
        owner: Buffer.from('00200f74e456b0bcca2cd9467d9178ba0b011970532bf0ef73b14fe9fa7a0b5b08f601', 'hex'),
        na: 979999898000000,
        lockTime: 0
      }
    ],
    outputs: [
      {
        owner: Buffer.from('05010186675865bcb74ff2d599bffce52f7638b712dfcd', 'hex'),
        na: 20000000000000,
        lockTime: -1,
      },
      {
        owner: Buffer.from('05010186675865bcb74ff2d599bffce52f7638b712dfcd', 'hex'),
        na: 959999897000000,
        lockTime: 0,
      }
    ]
  },
  scriptSign: Buffer.from('2102a0cec2035ee540a09510a453729fa9dcceef09bd4bfe36fae2ad37e6f4f7762c00473045022100c9935ee60089262fd18ad9fe3ed2dcc3cd6a2c4b1fc78ce41b0702f87a5592f402201248968bad9f12b7e9a426739a9baed7894d485bcd47bc954a42688d95611338', 'hex')
};
