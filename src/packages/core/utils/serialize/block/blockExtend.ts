import { VarByteSerializer } from '..';
import { IReadData } from '../common';

/***
  * ### Block extend
  * https://github.com/nuls-io/nuls/blob/master/consensus-module/poc/consensus-poc-base/src/main/java/io/nuls/consensus/poc/model/BlockExtendsData.java#L41
  *
  * | Len  | Fields                  | Data Type       | Remark            |
  * | ---- | ----------------------- | --------------- | ----------------- |
  * | 32   | roundIndex              | uint32          |                   |
  * | 16   | consensusMemberCount    | uint16          |                   |
  * | 48   | roundStartTime          | uint48          |                   |
  * | 16   | packingIndexOfRound     | uint16          |                   |
  * | 32   | mainVersion             | int32           |                   |
  * | 32   | currentVersion          | int32           |                   |
  * | 16   | percent                 | uint16          |                   |
  * | 32   | delay                   | uint32          |                   |
  * | ??   | stateRoot               | VarByte         |                   |
  * 
 */

export interface IBlockExtendData {
  extend?: Buffer;
  roundIndex: number;
  consensusMemberCount: number;
  roundStartTime: number;
  packingIndexOfRound: number;
  mainVersion?: number;
  currentVersion?: number;
  percent?: number;
  delay?: number;
  stateRoot?: Buffer;
}

export interface IBlockExtendOutput extends IReadData {
  readBytes: number;
  data: IBlockExtendData;
}

/**
 * Class to handle the protocol BlockExtend type
 */
export class BlockExtendSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized blockExtend
   */
  public static size(data: IBlockExtendData): number {

    let extend: Buffer;

    if (data.extend) {

      extend = data.extend;

    } else {

      let size: number = BlockExtendSerializer.bufferSize(data);
      extend = { length: size } as Buffer;

    }

    return VarByteSerializer.size(extend);

  }

  /**
   * Reads a tx buf at the specified offset
   * @param buf Buffer object from where the blockExtend will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IBlockExtendOutput {

    const { data: extend, readBytes } = VarByteSerializer.read(buf, offset);
    offset = 0;

    const roundIndex = extend.readUInt32LE(offset);
    offset += 4;

    const consensusMemberCount = extend.readUInt16LE(offset);
    offset += 2;

    const roundStartTime = extend.readUIntLE(offset, 6); // 48 bits
    offset += 6;

    const packingIndexOfRound = extend.readUInt16LE(offset);
    offset += 2;

    let mainVersion!: number;
    let currentVersion!: number;
    let percent!: number;
    let delay!: number;
    let stateRoot!: Buffer;

    if (extend.length > offset) {

      mainVersion = extend.readInt32LE(offset);
      offset += 4;

      currentVersion = extend.readInt32LE(offset);
      offset += 4;

      percent = extend.readUInt16LE(offset);
      offset += 2;

      delay = extend.readUInt32LE(offset);
      offset += 4;

      const output = VarByteSerializer.read(extend, offset);
      stateRoot = output.data;
      offset += output.readBytes;

    }

    const output: IBlockExtendOutput = {
      readBytes,
      data: {
        extend,
        roundIndex,
        consensusMemberCount,
        roundStartTime,
        packingIndexOfRound,
        mainVersion,
        currentVersion,
        percent,
        delay,
        stateRoot
      }
    };

    return output;

  }

  /**
   * Writes data to buf at the specified offset
   * @param data BlockExtend data to be written to buffer
   * @param buf Buffer object where the blockExtend will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: IBlockExtendData, buf: Buffer, offset: number = 0): number {

    let extend: Buffer;

    // Extend could contain more data than the officialy supported
    if (data.extend) {

      extend = data.extend;

    } else {

      const extSize = BlockExtendSerializer.bufferSize(data);
      let extOffset = 0;
      extend = Buffer.allocUnsafe(extSize);

      extOffset = extend.writeUInt32LE(data.roundIndex, extOffset);
      extOffset = extend.writeUInt16LE(data.consensusMemberCount, extOffset);
      extOffset = extend.writeUIntLE(data.roundStartTime, extOffset, 6); // 48 bits
      extOffset = extend.writeUInt16LE(data.packingIndexOfRound, extOffset);

      if (data.currentVersion) {

        extOffset = extend.writeInt32LE(data.mainVersion as number, extOffset);
        extOffset = extend.writeInt32LE(data.currentVersion as number, extOffset);
        extOffset = extend.writeUInt16LE(data.percent as number, extOffset);
        extOffset = extend.writeUInt32LE(data.delay as number, extOffset);

        extOffset = VarByteSerializer.write(data.stateRoot as Buffer, extend, extOffset);

      }

    }

    offset = VarByteSerializer.write(extend, buf, offset);

    return offset;

  }

  private static bufferSize(data: IBlockExtendData): number {

    let size: number = 4 + 2 + 6 + 2;

    if (data.currentVersion) {

      size += 4 + 4 + 2 + 4;
      size += VarByteSerializer.size(data.stateRoot as Buffer);

    }

    return size;

  }

}
