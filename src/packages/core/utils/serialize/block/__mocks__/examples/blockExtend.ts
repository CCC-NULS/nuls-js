import { IBlockExtendData } from '../../blockExtend';

export const blockExtendSerializedExample: string = 'Pa4bDQAMAHCbFT5oAQMAAgAAAAIAAABaABAnAAAgZS6H6c0lxXFBGm+U3v5eG/FW8/7bpKT3yiDSgso7Gbw=';

export const blockExtendReadExample: IBlockExtendData = {
  consensusMemberCount: 12,
  currentVersion: 2,
  delay: 10000,
  mainVersion: 2,
  packingIndexOfRound: 3,
  percent: 90,
  roundIndex: 859054,
  roundStartTime: 1547229830000,
  stateRoot: Buffer.from('652e87e9cd25c571411a6f94defe5e1bf156f3fedba4a4f7ca20d282ca3b19bc', 'hex')
};
