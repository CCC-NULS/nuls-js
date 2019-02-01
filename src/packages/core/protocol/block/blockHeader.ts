import { BlockVersion } from './../../common';
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
  consensusMemberCount: number;
  currentVersion?: number;
  delay?: number;
  mainVersion?: number;
  packingIndexOfRound: number;
  percent?: number;
  roundIndex: number;
  roundStartTime: number;
  stateRoot?: string;
  signature: string;
}

export class BlockHeader {

  protected _preHash!: Hash;
  protected _merkleHash!: Hash;
  protected _time: number = new Date().getTime();;
  protected _height!: number;
  protected _txCount!: number;
  protected _consensusMemberCount!: number;
  protected _currentVersion?: number;
  protected _delay?: number;
  protected _mainVersion?: number;
  protected _packingIndexOfRound!: number;
  protected _percent?: number;
  protected _roundIndex!: number;
  protected _roundStartTime!: number;
  protected _stateRoot?: Buffer;
  protected _signature!: Buffer;

  protected _internalTxCount!: number;

  static fromBytes(bytes: Buffer, internalTxCount?: number): BlockHeader {

    const blockHeader = new BlockHeader(internalTxCount);
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
      consensusMemberCount: blockHeader._consensusMemberCount,
      currentVersion: blockHeader._currentVersion,
      delay: blockHeader._delay,
      mainVersion: blockHeader._mainVersion,
      packingIndexOfRound: blockHeader._packingIndexOfRound,
      percent: blockHeader._percent,
      roundIndex: blockHeader._roundIndex,
      roundStartTime: blockHeader._roundStartTime,
      stateRoot: blockHeader._stateRoot && blockHeader._stateRoot.toString('hex'),
      signature: blockHeader._signature.toString('hex')
    };

  }

  static fromRawData(rawData: IBlockHeaderData, internalTxCount?: number): BlockHeader {

    const blockHeader = new BlockHeader(internalTxCount);
    return this._fromRawData(rawData, blockHeader);

  }

  constructor(internalTxCount: number = 0) {
    this._internalTxCount = internalTxCount;
  }

  protected static _fromRawData<B extends BlockHeader>(rawData: IBlockHeaderData, blockHeader: B): B {

    blockHeader._preHash = rawData.preHash;
    blockHeader._merkleHash = rawData.merkleHash;
    blockHeader._time = rawData.time;
    blockHeader._height = rawData.height;
    blockHeader._txCount = rawData.txCount;
    blockHeader._consensusMemberCount = rawData.extend.consensusMemberCount;
    blockHeader._currentVersion = rawData.extend.currentVersion;
    blockHeader._delay = rawData.extend.delay;
    blockHeader._mainVersion = rawData.extend.mainVersion;
    blockHeader._packingIndexOfRound = rawData.extend.packingIndexOfRound;
    blockHeader._percent = rawData.extend.percent;
    blockHeader._roundIndex = rawData.extend.roundIndex;
    blockHeader._roundStartTime = rawData.extend.roundStartTime;
    blockHeader._stateRoot = rawData.extend.stateRoot;
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
      extend: {
        consensusMemberCount: blockHeader._consensusMemberCount,
        currentVersion: blockHeader._currentVersion,
        delay: blockHeader._delay,
        mainVersion: blockHeader._mainVersion,
        packingIndexOfRound: blockHeader._packingIndexOfRound,
        percent: blockHeader._percent,
        roundIndex: blockHeader._roundIndex,
        roundStartTime: blockHeader._roundStartTime,
        stateRoot: blockHeader._stateRoot,
      },
      signature: getSignatureFromHash(blockHeader._signature)
    };

  }

  protected size(): number {

    const transactionData: IBlockHeaderData = BlockHeader.toRawData(this);
    return BlockHeaderSerializer.size(transactionData);

  }

  setInternalTxCount(count: number) {
    this._internalTxCount = count;
  }
  
  getHash(): BlockHash {

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
    (this._signature as any) = null;

    // Substract contract transfer transactions form txCount before digesting
    const txCount: number = this._txCount;
    this._txCount = this._txCount - this._internalTxCount;

    const blockBytes: Buffer = BlockHeader.toBytes(this);
    const digest: IDigestData = NulsDigestData.digest(blockBytes);

    // restore signature after serialization
    this._signature = signature;
    this._txCount = txCount;

    return digest;

  }

  getTxCount(): number {
    return this._txCount;
  }

  getHeight(): number {
    return this._height;
  }

  getMainVersion(): number {
    return this._mainVersion || BlockVersion.NotDefined;
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