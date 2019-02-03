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
  stateRoot: Buffer.from('652e87e9cd25c571411a6f94defe5e1bf156f3fedba4a4f7ca20d282ca3b19bc', 'hex'),
  extend: Buffer.from('ae1b0d000c00709b153e6801030002000000020000005a001027000020652e87e9cd25c571411a6f94defe5e1bf156f3fedba4a4f7ca20d282ca3b19bc', 'hex')
};

export const blockExtendReadExample2: IBlockExtendData = {
  consensusMemberCount: 13,
  currentVersion: 2,
  delay: 10000,
  mainVersion: 2,
  packingIndexOfRound: 2,
  percent: 90,
  roundIndex: 824195,
  roundStartTime: 1543557180000,
  stateRoot: Buffer.from('ac55fa007a045cedc3f9f618f576d6381dddbf356c47e670ab1a9277a96f39e4', 'hex'),
  extend: Buffer.from('83930c000d00606a2d636701020002000000020000005a001027000020ac55fa007a045cedc3f9f618f576d6381dddbf356c47e670ab1a9277a96f39e40001000101', 'hex')
};
