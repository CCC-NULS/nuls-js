import { IReadedData } from '.';

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

export interface IVarIntOutput extends IReadedData {
  readedBytes: number;
  data: number;
}

/**
 * Class to handle the protocol VarInt type
 * http://dev.nuls.io/protocol/index.html#VarInt
 */
export class VarIntSerializer {

  /**
   * Reads a varInt integer from buf at the specified offset
   * @param buf Buffer object from where the number will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IVarIntOutput {

    const first = 0xFF & buf[offset];
    let readedBytes = 0;
    let data = 0;

    if (first < 0xFD) {

      data = first;
      readedBytes = 1;

    } else if (first === 0xFD) {

      data = buf.readUIntLE(offset + 1, 2);
      readedBytes = 3;

    } else if (first === 0xFE) {

      data = buf.readUIntLE(offset + 1, 4);
      readedBytes = 5;

    } else if (first === 0xFF) {

      data = buf.readUIntLE(offset + 1, 8);
      readedBytes = 9;

    } else {

      throw new Error('not implemented');

    }

    return { data, readedBytes };

  }

  /**
   * Writes data to buf at the specified offset
   * @param data Number to be written to buf
   * @param buf Buffer object where the number will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns The number of bytes that has been written
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

    } else if (data <= 0xFFFFFFFF) {

      buf[offset] = 0xFF;
      buf.writeUIntLE(data, offset + 1, 8);
      len = 9;

    } else {

      throw new Error('not implemented');

    }

    return len;

  }

}
