import { ITransactionData } from '../../transaction';

export const redCardTxSerializedExample: string = 'CABQ8gZwaAEABQEBPIlkqnjGkhJvQrn8IbmOAcT+6DgDAAMjACBpMtXwhFp/vWGB1oGPeDV25Lbf6YdeVkM6wxdqRfdaewAAIEqp0QEAAP///////yMAIMkYGnpzhVrt5aZID5X9MStRRHatJF6sRgCw2dJpfmkeAADgV+tIGwAA////////IwAgCdiu1tOriEt5Ux/smf2/BV1YaRVpjbFJh/ffF2DwZmsAAEDlnDASAAD///////8CFwUBATyJZKp4xpISb0K5/CG5jgHE/ug4ACBKqdEBAABQggSlaQEXBQEBbW/cxkI0e/XlXHSTb7ecB/yZbyoAID2IeS0AAAAAAAAAAAA=';

export const redCardTxReadExample: ITransactionData = {
  type: 8,
  time: 1548067730000,
  remark: Buffer.from([]),
  txData: {
    address: 'TTan1LXZg5R3MiFFs8V5CuBizMXrNm1E',
    evidence: Buffer.from([]),
    reasonCode: 3
  },
  coinData: {
    inputs: [
      {
        owner: Buffer.from('00206932d5f0845a7fbd6181d6818f783576e4b6dfe9875e56433ac3176a45f75a7b00', 'hex'),
        na: 2000000000000,
        lockTime: -1
      },
      {
        owner: Buffer.from('0020c9181a7a73855aede5a6480f95fd312b514476ad245eac4600b0d9d2697e691e00', 'hex'),
        na: 30000000000000,
        lockTime: -1
      },
      {
        owner: Buffer.from('002009d8aed6d3ab884b79531fec99fdbf055d586915698db14987f7df1760f0666b00', 'hex'),
        na: 20000000000000,
        lockTime: -1
      }
    ],
    outputs: [
      {
        owner: Buffer.from('0501013c8964aa78c692126f42b9fc21b98e01c4fee838', 'hex'),
        na: 2000000000000,
        lockTime: 1553251730000
      },
      {
        owner: Buffer.from('0501016d6fdcc642347bf5e55c74936fb79c07fc996f2a', 'hex'),
        na: 50000000000000,
        lockTime: 0
      }
    ]
  },
  scriptSign: Buffer.from([])
};
