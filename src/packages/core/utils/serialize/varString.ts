import { VarByteSerializer } from './varByte';
import { IReadData } from './common';

/***
  * ### VarString
  * http://dev.nuls.io/protocol/index.html#VarString
  *
  * A variable-length byte stream consisting of a variable-length buffer. The string is encoded in UTF8.
  *
  * | Len    | Fields | Data Type     | Remark                 |
  * | ------ | ------ | ------------- | -------------          |
  * | ?      | length | VarInt        | 字符串的长度，以字节为单位 |
  * | length | value  | uint8[length] | 字符串本身               |
 */

export interface IVarStringOutput extends IReadData {
  readBytes: number;
  data: string;
}

/**
 * Class to handle the protocol VarString type
 * http://dev.nuls.io/protocol/index.html#VarString
 */
export class VarStringSerializer {

  public static DEFAULT_ENCODING: string = 'utf8';
  
  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized VarString
   */
  public static size(data: string): number {

    const bytes: Buffer = Buffer.from(data, VarStringSerializer.DEFAULT_ENCODING);
    return VarByteSerializer.size(bytes);

  }

  /**
   * Reads a varString from buf at the specified offset
   * @param buf Buffer object from where the bytes will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IVarStringOutput {

    const { data, readBytes } = VarByteSerializer.read(buf, offset);
  
    return {
      readBytes,
      data: data.toString(VarStringSerializer.DEFAULT_ENCODING)
    };

  }

  /**
   * Writes data to buf at the specified offset
   * @param data String to be written to buf
   * @param buf Buffer object where the string will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: string, buf: Buffer, offset: number): number {

    const buffData = Buffer.from(data, VarStringSerializer.DEFAULT_ENCODING);

    return VarByteSerializer.write(buffData, buf, offset);

  }
  
}
