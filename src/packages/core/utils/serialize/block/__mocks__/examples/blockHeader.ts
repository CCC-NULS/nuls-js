import { IBlockHeaderData } from '../../blockHeader';
import { blockExtendReadExample, blockExtendReadExample2 } from './blockExtend';

export const blockHeaderSerializedExample: string = 'ACBHC5h2v9PVo7kiWNDhQzN2RYrGaV0W0oboNMCOhaQCcAAgWWdL7AVFXXdF9Kj3sNgvtKsbsQpJMmixDFYZP9CV6OSgEBY+aAH7dAgAAQAAAD2uGw0ADABwmxU+aAEDAAIAAAACAAAAWgAQJwAAIGUuh+nNJcVxQRpvlN7+XhvxVvP+26Sk98og0oLKOxm8IQMBAeZ4pDsLRKRWYb2dzca36Qe8dVW0UR6ARc412wrDQgBHMEUCIQDu3/fusbh+vgFRKe3zMVnUbd2CaYV7XydDvZkBQEx6WQIgb3LpWq39u3dSBS8NlVbqCQAEwyDHOJF5Tke17bcY8uw=';

export const blockHeaderReadExample: IBlockHeaderData = {
  preHash: '0020470b9876bfd3d5a3b92258d0e1433376458ac6695d16d286e834c08e85a40270',
  merkleHash: '002059674bec05455d7745f4a8f7b0d82fb4ab1bb10a493268b10c56193fd095e8e4',
  time: 1547229860000,
  height: 554235,
  txCount: 1,
  extend: blockExtendReadExample,
  signature: {
    publicKey: Buffer.from('030101e678a43b0b44a45661bd9dcdc6b7e907bc7555b4511e8045ce35db0ac342', 'hex'),
    signData: {
      signAlgType: 0,
      signature: Buffer.from('3045022100eedff7eeb1b87ebe015129edf33159d46ddd8269857b5f2743bd9901404c7a5902206f72e95aadfdbb7752052f0d9556ea090004c320c73891794e47b5edb718f2ec', 'hex'),
    }
  }
};

export const blockHeaderReadExample2: IBlockHeaderData = {
  preHash: '00205da0cebc0c26a7aa27a4bffbac58147fa8ad154657bb97f3c3fd94a42e692804',
  merkleHash: '0020799aac4ce9c24c636285f4e05f92cbe1d24ff9373857afbc10164d450a41f6e2',
  time: 1543557200000,
  height: 251156,
  txCount: 1,
  extend: blockExtendReadExample2,
  signature: {
    publicKey: Buffer.from('0211709aa78c67a52e3540c770641d04bec28e33f7fa536ebc0088753024a6431c', 'hex'),
    signData: {
      signAlgType: 0,
      signature: Buffer.from('3045022100b7ddd78f1f32bf84a207759bfe1952137d2cb5b931bdfc59640135739ef825b702201fb00a23f62def500fa05f28ad3e0279874cfbf535f9c5a6c1e9fa72afb1bda2', 'hex'),
    }
  }
};
