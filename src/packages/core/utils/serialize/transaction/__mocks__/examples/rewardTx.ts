import { TxDataRewardSerializer } from '../../txData/txDataReward';
import { ITransactionData } from '../../transaction';

export const rewardTxSerializedExample: string = 'AQDgzzp/ZwEA/////wAEFwQjAVnZBZV+EHRNejdxUzprwEueqX+wMRfNAwAAAADpUhMAAAAXBCMBd97NtGpPJOgOZS2Fgyaab9QUz+BsIwgAAAAAAOlSEwAAABcEIwGMqoHy58Py9NOzohXiFWjzKQ4ihCva4wIAAAAA6VITAAAAFwQjAY6z3aDewbM43/jAQIh+ayckeJBbKSFNAAAAAADpUhMAAAAA';

export const rewardTxReadExample: ITransactionData = {
  type: 1,
  time: 1544027820000,
  remark: Buffer.from([]),
  txData: TxDataRewardSerializer.PLACE_HOLDER,
  coinData:
  {
    inputs: [],
    outputs: [
      {
        owner: Buffer.from('04230159d905957e10744d7a3771533a6bc04b9ea97fb0', 'hex'),
        na: 63772465,
        lockTime: 1266409
      },
      {
        owner: Buffer.from('04230177decdb46a4f24e80e652d8583269a6fd414cfe0', 'hex'),
        na: 533356,
        lockTime: 1266409
      },
      {
        owner: Buffer.from('0423018caa81f2e7c3f2f4d3b3a215e21568f3290e2284', 'hex'),
        na: 48486955,
        lockTime: 1266409
      },
      {
        owner: Buffer.from('0423018eb3dda0dec1b338dff8c040887e6b272478905b', 'hex'),
        na: 5054761,
        lockTime: 1266409
      }
    ]
  },
  scriptSign: Buffer.from([])
};

export const rewardTxExample = {
  hash: '002079409275ae77ccb99fb885c4c3924e67e5af5a7bd0390ec4f38421ecd9cf291a',
  type: 1,
  time: 1544027820000,
  blockHeight: 1265409,
  fee: 0,
  value: 117847537,
  remark: '',
  scriptSig: '',
  status: 1,
  confirmCount: 48,
  size: 168,
  inputs: [],
  outputs: [
    {
      txHash: '002079409275ae77ccb99fb885c4c3924e67e5af5a7bd0390ec4f38421ecd9cf291a',
      index: 0,
      address: 'NsdyeMiuA79sjoBDBj7H9LoFpgGpDWao',
      value: 63772465,
      lockTime: 1266409,
      status: 1
    },
    {
      txHash: '002079409275ae77ccb99fb885c4c3924e67e5af5a7bd0390ec4f38421ecd9cf291a',
      index: 1,
      address: 'Nse1VS85rue13xtXDrx9hCu8WAfM34T4',
      value: 533356,
      lockTime: 1266409,
      status: 1
    },
    {
      txHash: '002079409275ae77ccb99fb885c4c3924e67e5af5a7bd0390ec4f38421ecd9cf291a',
      index: 2,
      address: 'Nse2mbsj7uWnjiQfRpqER8MxSdt171Tx',
      value: 48486955,
      lockTime: 1266409,
      status: 1
    },
    {
      txHash: '002079409275ae77ccb99fb885c4c3924e67e5af5a7bd0390ec4f38421ecd9cf291a',
      index: 3,
      address: 'Nse2ts9ndjW6xCGasBDx3eZeY1Hqx4kw',
      value: 5054761,
      lockTime: 1266409,
      status: 1
    }
  ]
};
