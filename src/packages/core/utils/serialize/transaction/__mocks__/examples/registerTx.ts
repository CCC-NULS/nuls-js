import { ITransactionData } from '../../transaction';

export const registerTxSerializedExample: string = 'BACfVvdXZgEAAEDlnDASAAAFAQGGZ1hlvLdP8tWZv/zlL3Y4txLfzQUBAV3inJKwy6bZZX2C27Rl6FnpCRYMBQEBhmdYZby3T/LVmb/85S92OLcS380AAAAAAABZQAEjACCXEVlWR9puVQSdXQrLu7SdeBe8BTs3q2jKMReZNbGgmwDAXMGefo0DAAAAAAAAAAIXBQEBhmdYZby3T/LVmb/85S92OLcS380AQOWcMBIAAP///////xcFAQGGZ1hlvLdP8tWZv/zlL3Y4txLfzYDazAFOewMAAAAAAAAAayECoM7CA17lQKCVEKRTcp+p3M7vCb1L/jb64q035vT3diwARzBFAiEApewvaVF8eZTWbAAmy1w9XnikmunkZtsVWcdLWdAzQzkCIHCs+hfInl3WDrhpIUqI6QLiDQ0H9v/N5JnPGhOTlGVy';

export const registerTxReadExample: ITransactionData = {
  type: 4,
  time: 1539074119327,
  remark: Buffer.from([]),
  txData: {
    deposit: 20000000000000,
    agentAddress: 'TTarYnUfsftmm7DrStandCEdd4SNiELS',
    packingAddress: 'TTap4GvKxhjTnHgcSt6JQjZZLFSvNULS',
    rewardAddress: 'TTarYnUfsftmm7DrStandCEdd4SNiELS',
    commissionRate: 100
  },
  coinData: {
    inputs: [
      {
        owner: Buffer.from('00209711595647da6e55049d5d0acbbbb49d7817bc053b37ab68ca31179935b1a09b00', 'hex'),
        na: 999999899000000,
        lockTime: 0
      }
    ],
    outputs: [
      {
        owner: Buffer.from('05010186675865bcb74ff2d599bffce52f7638b712dfcd', 'hex'),
        na: 20000000000000,
        lockTime: -1
      },
      {
        owner: Buffer.from('05010186675865bcb74ff2d599bffce52f7638b712dfcd', 'hex'),
        na: 979999898000000,
        lockTime: 0
      }
    ]
  },
  scriptSign: Buffer.from('2102a0cec2035ee540a09510a453729fa9dcceef09bd4bfe36fae2ad37e6f4f7762c00473045022100a5ec2f69517c7994d66c0026cb5c3d5e78a49ae9e466db1559c74b59d0334339022070acfa17c89e5dd60eb869214a88e902e20d0d07f6ffcde499cf1a1393946572', 'hex')
};
