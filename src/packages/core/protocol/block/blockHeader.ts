import { BlockHeaderSerializer, IBlockHeaderData } from '../../utils/serialize/block/blockHeader';
import { Hash, getPrivateKeyBuffer } from '../../utils/crypto';
import { getSignatureHash, getSignatureFromHash, createBlockSignature } from '../../utils';
import { IDigestData, NulsDigestData } from '../nulsDigestData';
import { NulsDigestDataSerializer } from '../../utils/serialize/nulsDigestData';

export type BlockHash = string;
export type BlockHex = string;

export interface BlockHeaderObject {
  hash: string;
  preHash: string;
  merkleHash: string;
  time: number;
  height: number;
  txCount: number;
  extend: string; // TODO: parse extend info 
  signature: string;
}

export class BlockHeader {

  protected _preHash!: Hash;
  protected _merkleHash!: Hash;
  protected _time: number = new Date().getTime();;
  protected _height!: number;
  protected _txCount!: number;
  protected _extend!: Buffer;
  protected _signature: Buffer = Buffer.from([]);

  static fromBytes(bytes: Buffer): BlockHeader {

    const blockHeader = new BlockHeader();
    const rawData: IBlockHeaderData = BlockHeaderSerializer.read(bytes, 0).data;
    return this._fromRawData(rawData, blockHeader);

  }

  static toBytes(blockHeader: BlockHeader): Buffer {

    const rawData: IBlockHeaderData = this.toRawData(blockHeader);
    const bytesLength: number = BlockHeaderSerializer.size(rawData);
    const bytes = Buffer.allocUnsafe(bytesLength);
    BlockHeaderSerializer.write(rawData, bytes, 0);

    return bytes;

  }

  static toObject(blockHeader: BlockHeader): BlockHeaderObject {

    return {
      hash: blockHeader.getHash(),
      preHash: blockHeader._preHash,
      merkleHash: blockHeader._merkleHash,
      time: blockHeader._time,
      height: blockHeader._height,
      txCount: blockHeader._txCount,
      extend: blockHeader._extend.toString('hex'), // TODO: parse extend info 
      signature: blockHeader._signature.toString('hex')
    };

  }

  static fromRawData(rawData: IBlockHeaderData): BlockHeader {
    
    const blockHeader = new BlockHeader();
    return this._fromRawData(rawData, blockHeader);

  }

  protected static _fromRawData<B extends BlockHeader>(rawData: IBlockHeaderData, blockHeader: B): B {

    blockHeader._preHash = rawData.preHash;
    blockHeader._merkleHash = rawData.merkleHash;
    blockHeader._time = rawData.time;
    blockHeader._height = rawData.height;
    blockHeader._txCount = rawData.txCount;
    blockHeader._extend = rawData.extend;
    blockHeader._signature = getSignatureHash(rawData.signature);

    return blockHeader;

  }

  static toRawData(blockHeader: BlockHeader): IBlockHeaderData {

    return {
      preHash: blockHeader._preHash,
      merkleHash: blockHeader._merkleHash,
      time: blockHeader._time,
      height: blockHeader._height,
      txCount: blockHeader._txCount,
      extend: blockHeader._extend,
      signature: getSignatureFromHash(blockHeader._signature)
    };

  }

  protected size(): number {

    const transactionData: IBlockHeaderData = BlockHeader.toRawData(this);
    return BlockHeaderSerializer.size(transactionData);

  }

  protected getHash(): BlockHash {

    const digestData: IDigestData = this.getDigest();
    
    const digestSize: number = NulsDigestDataSerializer.size(digestData);
    const hash: Buffer = Buffer.allocUnsafe(digestSize);
    NulsDigestDataSerializer.write(digestData, hash, 0);

    return hash.toString('hex');

  }

  // https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/core-module/kernel/src/main/java/io/nuls/kernel/model/BlockHeader.java#L113
  getDigest(): IDigestData {

    // serialize without signature
    const signature: Buffer = this._signature;
    this._signature = Buffer.from([]);

    const blockBytes: Buffer = BlockHeader.toBytes(this);
    const digest: IDigestData = NulsDigestData.digest(blockBytes);

    // restore signature after serialization
    this._signature = signature;

    return digest;

  }

  getTxCount(): number {
    return this._txCount;
  }

  sign(privateKey: string): this {

    const privateKeyBuffer: Buffer = getPrivateKeyBuffer(privateKey);
    this._signature = createBlockSignature(this, privateKeyBuffer);
    return this;

  }

  toObject(): BlockHeaderObject {
    return BlockHeader.toObject(this);
  }

}