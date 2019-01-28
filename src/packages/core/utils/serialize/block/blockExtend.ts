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

    let size: number = BlockExtendSerializer.bufferSize(data);
    size = VarByteSerializer.size({ length: size } as Buffer);

    return size;

  }

  /**
   * Reads a tx buf at the specified offset
   * @param buf Buffer object from where the blockExtend will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IBlockExtendOutput {

    const { data: extBuf, readBytes } = VarByteSerializer.read(buf, offset);
    offset = 0;

    const roundIndex = extBuf.readUInt32LE(offset);
    offset += 4;

    const consensusMemberCount = extBuf.readUInt16LE(offset);
    offset += 2;

    const roundStartTime = extBuf.readUIntLE(offset, 6); // 48 bits
    offset += 6;

    const packingIndexOfRound = extBuf.readUInt16LE(offset);
    offset += 2;

    let mainVersion!: number;
    let currentVersion!: number;
    let percent!: number;
    let delay!: number;
    let stateRoot!: Buffer;

    if (extBuf.length > offset) {

      mainVersion = extBuf.readInt32LE(offset);
      offset += 4;

      currentVersion = extBuf.readInt32LE(offset);
      offset += 4;

      percent = extBuf.readUInt16LE(offset);
      offset += 2;

      delay = extBuf.readUInt32LE(offset);
      offset += 4;

      const output = VarByteSerializer.read(extBuf, offset);
      stateRoot = output.data;
      offset += output.readBytes;

    }

    const output: IBlockExtendOutput = {
      readBytes,
      data: {
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

    const extSize = BlockExtendSerializer.bufferSize(data);
    const extBuf = Buffer.allocUnsafe(extSize);
    let extOffset = 0;

    extOffset = extBuf.writeUInt32LE(data.roundIndex, extOffset);
    extOffset = extBuf.writeUInt16LE(data.consensusMemberCount, extOffset);
    extOffset = extBuf.writeUIntLE(data.roundStartTime, extOffset, 6); // 48 bits
    extOffset = extBuf.writeUInt16LE(data.packingIndexOfRound, extOffset);

    if (data.currentVersion) {

      extOffset = extBuf.writeInt32LE(data.mainVersion as number, extOffset);
      extOffset = extBuf.writeInt32LE(data.currentVersion as number, extOffset);
      extOffset = extBuf.writeUInt16LE(data.percent as number, extOffset);
      extOffset = extBuf.writeUInt32LE(data.delay as number, extOffset);

      extOffset = VarByteSerializer.write(data.stateRoot as Buffer, extBuf, extOffset);

    }

    offset = VarByteSerializer.write(extBuf, buf, offset);

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
