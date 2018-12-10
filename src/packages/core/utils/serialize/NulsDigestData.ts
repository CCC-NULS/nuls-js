import { VarByteSerializer } from './varByte';
import { IReadData } from './common';

/***
  * ### NulsDigestData
  * http://dev.nuls.io/protocol/index.html#NulsDigestData
  *
  * Nuls Digest Data
  * 
  * | Len  | Fields        | Data Type | Remark |
  * | ---- | ------------- | --------- | ------ |
  * | 1    | digestAlgType | Byte      | 算法ID |
  * | ??   | digest        | VarByte   | 摘要   |
 */

export interface INulsDigestDataData {
  digestAlgType: number;
  digest: Buffer;
}

export interface INulsDigestDataOutput extends IReadData {
  readBytes: number;
  data: INulsDigestDataData;
}

/**
 * Class to handle the protocol NulsDigestData type
 * http://dev.nuls.io/protocol/index.html#NulsDigestData
 */
export class NulsDigestDataSerializer {

  /**
   * Reads a NulsDigestData from buf at the specified offset
   * @param buf Buffer object from where the bytes will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): INulsDigestDataOutput {

    const digestAlgType = buf.readUInt8(offset);
    const { data: digest, readBytes } = VarByteSerializer.read(buf, offset);

    return {
      readBytes: readBytes + 1,
      data: {
        digestAlgType,
        digest
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
  public static write(data: INulsDigestDataData, buf: Buffer, offset: number): number {

    offset = buf.writeUInt8(data.digestAlgType, offset);
    offset = VarByteSerializer.write(data.digest, buf, offset);

    return offset;

  }

}
