import { VarByteSerializer } from '..';
import { IReadData } from '../common';
import { HashSerializer } from '../hash';
import { Hash } from '../../crypto';
import { HASH_LENGTH } from '../../../../core/common';
import { P2PKHScriptSigSerializer, IP2PKHScriptSigData } from '../signature/P2PKHScriptSig';

/***
  * ### Block header
  * https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/core-module/kernel/src/main/java/io/nuls/kernel/model/BlockHeader.java#L43
  *
  * | Len  | Fields     | Data Type       | Remark            |
  * | ---- | ---------- | --------------- | ----------------- |
  * | 34   | preHash    | NulsDigestData  |                   |
  * | 34   | merkleHash | NulsDigestData  |                   |
  * | ??   | stateRoot  | VarByte         |                   |
  * | 6    | time       | uint48          | second            |
  * | 4    | height     | uint32          |                   |
  * | 4    | txCount    | uint32          |                   |
  * | ??   | extend     | VarByte         | restrictions      |
  * | ??   | signature  | P2PKHScriptSig  |                   |
 */

export interface IBlockHeaderData {
  preHash: Hash;
  merkleHash: Hash;
  time: number;
  height: number;
  txCount: number;
  extend: Buffer;
  signature: IP2PKHScriptSigData;
}

export interface IBlockHeaderOutput extends IReadData {
  readBytes: number;
  data: IBlockHeaderData;
}

/**
 * Class to handle the protocol BlockHeader type
 */
export class BlockHeaderSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized blockHeader
   */
  public static size(data: IBlockHeaderData): number {

    let size: number = 6 + 4 + 4 + HASH_LENGTH + HASH_LENGTH;
    size += VarByteSerializer.size(data.extend);
    size += P2PKHScriptSigSerializer.size(data.signature);

    return size;

  }

  /**
   * Reads a tx buf at the specified offset
   * @param buf Buffer object from where the blockHeader will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IBlockHeaderOutput {

    const initialOffset = offset;

    const { data: preHash, readBytes: bytes1 } = HashSerializer.read(buf, offset);
    offset += bytes1;

    const { data: merkleHash, readBytes: bytes2 } = HashSerializer.read(buf, offset);
    offset += bytes2;

    const time = buf.readUIntLE(offset, 6);
    offset += 6;

    const height = buf.readUInt32LE(offset);
    offset += 4;

    const txCount = buf.readUInt32LE(offset);
    offset += 4;

    const { data: extend, readBytes: bytes4 } = VarByteSerializer.read(buf, offset);
    offset += bytes4;

    const { data: signature, readBytes: bytes5 } = P2PKHScriptSigSerializer.read(buf, offset);
    offset += bytes5;

    const output: IBlockHeaderOutput = {
      readBytes: offset - initialOffset,
      data: {
        preHash,
        merkleHash,
        time,
        height,
        txCount,
        extend,
        signature
      }
    };

    return output;

  }

  /**
   * Writes data to buf at the specified offset
   * @param data BlockHeader data to be written to buffer
   * @param buf Buffer object where the blockHeader will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: IBlockHeaderData, buf: Buffer, offset: number = 0): number {

    offset = HashSerializer.write(data.preHash, buf, offset);
    offset = HashSerializer.write(data.merkleHash, buf, offset);
    offset = buf.writeUIntLE(data.time, offset, 6);
    offset = buf.writeUInt32LE(data.height, offset);
    offset = buf.writeUInt32LE(data.txCount, offset);
    offset = VarByteSerializer.write(data.extend, buf, offset);
    offset = P2PKHScriptSigSerializer.write(data.signature, buf, offset);

    return offset;

  }

}
