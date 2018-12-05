import { IReadedData, VarIntSerializer } from '.';

/***
  * ### VarByte
  * http://dev.nuls.io/protocol/index.html#VarByte
  *
  * Variable-length buffer, consistent with the VarString implementation.
  *
  * | Len  | Fields   | Data Type    | Remark                 |
  * | ------ | ------ | ------------ | -------------          |
  * | ?      | length | VarInt       | 字符串的长度，以字节为单位  |
  * | length | data   | byte[length] | 字符串本身               |
 */

export interface IVarByteOutput extends IReadedData {
  readedBytes: number;
  data: Buffer;
}

/**
 * Class to handle the protocol VarByte type
 * http://dev.nuls.io/protocol/index.html#VarByte
 */
export class VarByteSerializer {

  /**
   * Reads a varByte from buf at the specified offset
   * @param buf Buffer object from where the bytes will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IVarByteOutput {

    const { data: bytesToRead, readedBytes } = VarIntSerializer.read(buf, offset);
    const data: Buffer = buf.slice(offset + readedBytes, offset + readedBytes + bytesToRead);

    return { data, readedBytes: readedBytes + bytesToRead };

  }

  /**
   * Writes data to buf at the specified offset
   * @param data Buffer of bytes to be written to buf
   * @param buf Buffer object where the bytes will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: Buffer, buf: Buffer, offset: number): number {

    offset = VarIntSerializer.write(data.length, buf, offset);
    offset += data.copy(buf, offset);

    return offset;

  }

}
