import { IBlockData } from '../../block';
import { blockHeaderReadExample, blockHeaderReadExample2 } from './blockHeader';

export const blockSerializedExample: string = 'ACBHC5h2v9PVo7kiWNDhQzN2RYrGaV0W0oboNMCOhaQCcAAgWWdL7AVFXXdF9Kj3sNgvtKsbsQpJMmixDFYZP9CV6OSgEBY+aAH7dAgAAQAAAD2uGw0ADABwmxU+aAEDAAIAAAACAAAAWgAQJwAAIGUuh+nNJcVxQRpvlN7+XhvxVvP+26Sk98og0oLKOxm8IQMBAeZ4pDsLRKRWYb2dzca36Qe8dVW0UR6ARc412wrDQgBHMEUCIQDu3/fusbh+vgFRKe3zMVnUbd2CaYV7XydDvZkBQEx6WQIgb3LpWq39u3dSBS8NlVbqCQAEwyDHOJF5Tke17bcY8uwBAKAQFj5oAQD/////AAMXBQEBsLVB1qV9CmIXC4tWNQ/x4lJ4symbGugBAAAAAON4CAAAABcFAQEBAtUMa4hxGqgMZzVEwx1/xxxPcQdihQUAAAAA43gIAAAAFwUBAYNkpQfb2ZAfRKPWP0AaCgFPt3+DbSseBgAAAADjeAgAAAAA';
export const blockSerializedExample2: string = 'ACBdoM68DCanqiekv/usWBR/qK0VRle7l/PD/ZSkLmkoBAAgeZqsTOnCTGNihfTgX5LL4dJP+Tc4V6+8EBZNRQpB9uKAuC1jZwEU1QMAAQAAAEKDkwwADQBgai1jZwECAAIAAAACAAAAWgAQJwAAIKxV+gB6BFztw/n2GPV21jgd3b81bEfmcKsaknepbznkAAEAAQEhAhFwmqeMZ6UuNUDHcGQdBL7CjjP3+lNuvACIdTAkpkMcAEcwRQIhALfd148fMr+Eogd1m/4ZUhN9LLW5Mb38WWQBNXOe+CW3AiAfsAoj9i3vUA+gXyitPgJ5h0z79TX5xabB6fpyr7G9ogEAgLgtY2cBAP////8AARcFAQHAr1pAN1JIIEpRoqhJz9+ujpevNdJIhA0AAAAA/NgDAAAAAA==';

export const blockReadExample: IBlockData = {
  header: blockHeaderReadExample,
  transactions: [{
    type: 1,
    remark: Buffer.from([]),
    scriptSign: Buffer.from([]),
    time: 1547229860000,
    txData: Buffer.from([255, 255, 255, 255]),
    coinData: {
      inputs: [],
      outputs: [
        {
          owner: Buffer.from('050101b0b541d6a57d0a62170b8b56350ff1e25278b329', 'hex'),
          na: 31988379,
          lockTime: 555235
        },
        {
          owner: Buffer.from('0501010102d50c6b88711aa80c673544c31d7fc71c4f71', 'hex'),
          na: 92627463,
          lockTime: 555235
        },
        {
          owner: Buffer.from('0501018364a507dbd9901f44a3d63f401a0a014fb77f83', 'hex'),
          na: 102640493,
          lockTime: 555235
        }
      ]
    }
  }]
};

export const blockReadExample2: IBlockData = {
  header: blockHeaderReadExample2,
  transactions: [{
    type: 1,
    remark: Buffer.from([]),
    scriptSign: Buffer.from([]),
    time: 1543557200000,
    txData: Buffer.from([255, 255, 255, 255]),
    coinData: {
      inputs: [],
      outputs: [
        {
          owner: Buffer.from('050101c0af5a40375248204a51a2a849cfdfae8e97af35', 'hex'),
          na: 226773202,
          lockTime: 252156
        }
      ]
    },
  }]
};
