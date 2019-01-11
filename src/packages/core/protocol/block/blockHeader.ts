import { BlockHeaderSerializer, IBlockHeaderData } from '../../utils/serialize/block/blockHeader';
import { Hash } from '../../utils/crypto';
import { getSignatureHash, getSignatureFromHash } from '../../utils';

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

  protected static toRawData(blockHeader: BlockHeader): IBlockHeaderData {

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

}