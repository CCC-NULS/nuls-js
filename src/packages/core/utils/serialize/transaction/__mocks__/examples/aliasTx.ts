import { ITransactionData } from '../../transaction';

export const aliasTxSerializedExample: string = 'AwBKdR4TaAEAFwUBAaxm+ApxWUtHwUo0lUxpCorMbl48DGFuZ2VsaWxsb3VfMQIjACBqaDyfbaSVxLslHW97o6eIjGpQePL1HawJux4I59nQJAEA4fUFAAAAAAAAAAAAACMAIPdl5i6d/IcB8dwA/a27ZvuoEjMeQH1K0hkgLYisf2kLAQDh9QUAAAAAAAAAAAAAAhcFAQGsZvgKcVlLR8FKNJVMaQqKzG5ePMCe5gUAAAAAAAAAAAAAFwQjAbUOGMvNGJFJlFDxJd5QhRvQmm2sAOH1BQAAAAAAAAAAAABrIQN37cDQ5pZvDa4hBvdYof6moN5KOyzrR8JmU2B4CM/ITwBHMEUCIQDrixEFmng1DmnIY6lJDQzJW93pKDX288Ymc9agALomjAIgHvr+yQSHYHF4gWuI4EdjVetbFZW3E+EGshyLCF5xTMc=';

export const aliasTxReadExample: ITransactionData = {
  type: 3,
  time: 1546508989770,
  remark: Buffer.from([]),
  txData: {
    address: 'TTattJmAz28RNH95VsRqnGNRhvKAV5Fj',
    alias: 'angelillou_1'
  },
  coinData:
  {
    inputs: [
      {
        owner: Buffer.from('00206a683c9f6da495c4bb251d6f7ba3a7888c6a5078f2f51dac09bb1e08e7d9d02401', 'hex'),
        na: 100000000,
        lockTime: 0
      },
      {
        owner: Buffer.from('0020f765e62e9dfc8701f1dc00fdadbb66fba812331e407d4ad219202d88ac7f690b01', 'hex'),
        na: 100000000,
        lockTime: 0
      }
    ],
    outputs: [
      {
        owner: Buffer.from('050101ac66f80a71594b47c14a34954c690a8acc6e5e3c', 'hex'),
        na: 99000000,
        lockTime: 0
      },
      {
        owner: Buffer.from('042301b50e18cbcd1891499450f125de50851bd09a6dac', 'hex'),
        na: 100000000,
        lockTime: 0
      }
    ]
  },
  scriptSign: Buffer.from('210377edc0d0e6966f0dae2106f758a1fea6a0de4a3b2ceb47c26653607808cfc84f00473045022100eb8b11059a78350e69c863a9490d0cc95bdde92835f6f3c62673d6a000ba268c02201efafec90487607178816b88e0476355eb5b1595b713e106b21c8b085e714cc7', 'hex')
};
