import { IBlockData } from '../../block';
import { blockHeaderReadExample } from './blockHeight';

export const blockSerializedExample: string = 'ACBHC5h2v9PVo7kiWNDhQzN2RYrGaV0W0oboNMCOhaQCcAAgWWdL7AVFXXdF9Kj3sNgvtKsbsQpJMmixDFYZP9CV6OSgEBY+aAH7dAgAAQAAAD2uGw0ADABwmxU+aAEDAAIAAAACAAAAWgAQJwAAIGUuh+nNJcVxQRpvlN7+XhvxVvP+26Sk98og0oLKOxm8IQMBAeZ4pDsLRKRWYb2dzca36Qe8dVW0UR6ARc412wrDQgBHMEUCIQDu3/fusbh+vgFRKe3zMVnUbd2CaYV7XydDvZkBQEx6WQIgb3LpWq39u3dSBS8NlVbqCQAEwyDHOJF5Tke17bcY8uwBAKAQFj5oAQD/////AAMXBQEBsLVB1qV9CmIXC4tWNQ/x4lJ4symbGugBAAAAAON4CAAAABcFAQEBAtUMa4hxGqgMZzVEwx1/xxxPcQdihQUAAAAA43gIAAAAFwUBAYNkpQfb2ZAfRKPWP0AaCgFPt3+DbSseBgAAAADjeAgAAAAA';

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
          owner: Buffer.from([5, 1, 1, 176, 181, 65, 214, 165, 125, 10, 98, 23, 11, 139, 86, 53, 15, 241, 226, 82, 120, 179, 41]),
          na: 31988379,
          lockTime: 555235
        },
        {
          owner: Buffer.from([5, 1, 1, 1, 2, 213, 12, 107, 136, 113, 26, 168, 12, 103, 53, 68, 195, 29, 127, 199, 28, 79, 113]),
          na: 92627463,
          lockTime: 555235
        },
        {
          owner: Buffer.from([5, 1, 1, 131, 100, 165, 7, 219, 217, 144, 31, 68, 163, 214, 63, 64, 26, 10, 1, 79, 183, 127, 131]),
          na: 102640493,
          lockTime: 555235
        }
      ]
    }
  }]
};

