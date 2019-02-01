import { ITransactionData } from '../../transaction';

export const contractDeleteTxSerializedExample: string = 'ZgAYzpQ7aAEABQEBBUUc9fe47rlVoyedzj/h3hzKsl0FAQKSKpfp4BBj5s9KtcyYmjG5XQb5bQIjACBJpwI87HwdguHfMXYxH4ARFsdvSi4tgsHsl1fEeXiH6gFh1QAAAAAAAIZQCAAAACMAIDW0/0wmCBxiFwiZ2h6aNijPnBlsypdXvZxhs1m1mv0XAd0WAgAAAAAAeVAIAAAAARcFAQEFRRz197juuVWjJ53OP+HeHMqyXZ5lAQAAAAAAAAAAAAAAayECEK2Ye/ccU5i7kw/35d8r5KO1juvfKsjU+T19RoN4SgUARzBFAiEA42N886ZT8qAP/Rrpzr7f9CV7cgAx3rCGvO8+rkTzITUCIGbmjA/0wDPpz+6ouUJcu0BA6DTdqqvxudXmCYwio6Q8';

export const contractDeleteTxReadExample: ITransactionData = {
  type: 102,
  time: 1547187834392,
  remark: Buffer.from([]),
  txData: {
    sender: 'TTaicEBofWJcLG7pkgH65JxvQhKmcaii',
    contractAddress: 'TTb91mDwKvt96Q8pqbPs6zxAYMrwk9y5'
  },
  coinData: {
    inputs: [
      {
        owner: Buffer.from('002049a7023cec7c1d82e1df3176311f801116c76f4a2e2d82c1ec9757c4797887ea01', 'hex'),
        na: 54625,
        lockTime: 544902
      },
      {
        owner: Buffer.from('002035b4ff4c26081c62170899da1e9a3628cf9c196cca9757bd9c61b359b59afd1701', 'hex'),
        na: 136925,
        lockTime: 544889
      }
    ],
    outputs: [
      {
        owner: Buffer.from('05010105451cf5f7b8eeb955a3279dce3fe1de1ccab25d', 'hex'),
        na: 91550,
        lockTime: 0
      }
    ]
  },
  scriptSign: Buffer.from('210210ad987bf71c5398bb930ff7e5df2be4a3b58eebdf2ac8d4f93d7d4683784a0500473045022100e3637cf3a653f2a00ffd1ae9cebedff4257b720031deb086bcef3eae44f32135022066e68c0ff4c033e9cfeea8b9425cbb4040e834ddaaabf1b9d5e6098c22a3a43c', 'hex')
};
