import { IReadData, writeUint64LE, readUint64LE } from '.';

/***
  * ### VarInt
  * http://dev.nuls.io/protocol/index.html#VarInt
  *
  * Variable-length integers that can be encoded based on the values expressed to save space.
  *
  * | Value         | Len  | Structure     |
  * | ------------- | ---- | ------------- |
  * | < 0xfd        | 1    | uint8         |
  * | <= 0xffff     | 3    | 0xfd + uint16 |
  * | <= 0xffffffff | 5    | 0xfe + uint32 |
  * | > 0xffffffff  | 9    | 0xff + uint64 |
 */

export interface IVarIntOutput extends IReadData {
  readBytes: number;
  data: number;
}

/**
 * Class to handle the protocol VarInt type
 * http://dev.nuls.io/protocol/index.html#VarInt
 */
export class VarIntSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized VarInt
   */
  public static size(data: number): number {

    // if negative, it's actually a very large unsigned long value
    if (data < 0) {
      // 1 marker + 8 data bytes
      return 9;
    }
    if (data < 0xFD) {
      // 1 data byte
      return 1;
    }
    if (data <= 0xFFFF) {
      // 1 marker + 2 data bytes
      return 3;
    }
    if (data <= 0xFFFFFFFF) {
      // 1 marker + 4 data bytes
      return 5;
    }
    // 1 marker + 8 data bytes
    return 9;

  }

  /**
   * Reads a varInt integer from buf at the specified offset
   * @param buf Buffer object from where the number will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IVarIntOutput {

    const first = 0xFF & buf[offset];
    let readBytes = 0;
    let data = 0;

    if (first < 0xFD) {

      data = first;
      readBytes = 1;

    } else if (first === 0xFD) {

      data = buf.readUIntLE(offset + 1, 2);
      readBytes = 3;

    } else if (first === 0xFE) {

      data = buf.readUIntLE(offset + 1, 4);
      readBytes = 5;

    } else if (first === 0xFF) {

      // data = buf.readUIntLE(offset + 1, 8);
      // readBytes = 9;
    
      data = readUint64LE(buf, offset + 1);
      readBytes = 9;

    } else {

      throw new Error('not implemented');

    }

    return { data, readBytes };

  }

  /**
   * Writes data to buf at the specified offset
   * @param data Number to be written to buf
   * @param buf Buffer object where the number will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: number, buf: Buffer, offset: number): number {

    let len = 1;

    if (data < 0xFD) {

      buf[offset] = data;

    } else if (data <= 0xFFFF) {

      buf[offset] = 0xFD;
      buf.writeUIntLE(data, offset + 1, 2);
      len = 3;

    } else if (data <= 0xFFFFFFFF) {

      buf[offset] = 0xFE;
      buf.writeUIntLE(data, offset + 1, 4);
      len = 5;

    } else if (data > 0xFFFFFFFF) {

      // buf[offset] = 0xFF;
      // buf.writeUIntLE(data, offset + 1, 8);
      // len = 9;

      buf[offset] = 0xFF;
      writeUint64LE(data, buf, offset + 1);
      len = 9;

    } else {

      throw new Error('not implemented');

    }

    return offset + len;

  }

}
