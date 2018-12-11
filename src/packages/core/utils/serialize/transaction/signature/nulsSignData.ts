import { VarByteSerializer } from '../../varByte';
import { IReadData } from '../../common';

/***
  * ### NulsSignData
  * http://dev.nuls.io/protocol/index.html#NulsSignData
  *
  * Nuls Signature Data
  * 
  * | Len  | Fields        | Data Type | Remark       |
  * | ---- | ------------- | --------- | ------------ |
  * | 1    | signAlgType   | Byte      | Algorithm ID |
  * | ??   | signature     | VarByte   | Signature    |
 */

export interface INulsSignDataData {
  signAlgType: number;
  signature: Buffer;
}

export interface INulsSignDataOutput extends IReadData {
  readBytes: number;
  data: INulsSignDataData;
}

/**
 * Class to handle the protocol NulsSignData type
 * http://dev.nuls.io/protocol/index.html#NulsSignData
 * https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/model/NulsSignData.java#L41
 */
export class NulsSignDataSerializer {

  /**
   * Size of the serialized data
   * @param buf Buffer object from where the bytes will be read
   * @param data INulsSignDataData to calculate size
   */
  public static size(data: INulsSignDataData): number {

    return 1 + VarByteSerializer.size(data.signature);

  }

  /**
   * Reads a NulsSignData from buf at the specified offset
   * @param buf Buffer object from where the bytes will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): INulsSignDataOutput {

    const signAlgType = buf.readUInt8(offset);
    const { data: signature, readBytes } = VarByteSerializer.read(buf, offset);

    return {
      readBytes: readBytes + 1,
      data: {
        signAlgType,
        signature
      }
    };

  }

  /**
   * Writes data to buf at the specified offset
   * @param data String to be written to buf
   * @param buf Buffer object where the string will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: INulsSignDataData, buf: Buffer, offset: number): number {

    offset = buf.writeUInt8(data.signAlgType, offset);
    offset = VarByteSerializer.write(data.signature, buf, offset);

    return offset;

  }

}
