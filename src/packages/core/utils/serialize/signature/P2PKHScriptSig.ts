import { IReadData } from '../common';
import { VarByteSerializer } from '../..';
import { NulsSignDataSerializer, INulsSignDataData } from './nulsSignData';
import { NulsDataSerializer, INulsDataData } from '../nulsData';

/***
  * ### P2PKHScriptSig
  * http://dev.nuls.io/protocol/index.html#P2PKHScriptSig
  *
  * NULS transaction signature
  * 
  * | Len  | Fields        | Data Type    | Remark          |
  * | ---- | ------------- | ------------ | --------------- |
  * | ??   | publicKey     | VarByte      | Public Key      |
  * | ??   | NulsSignData  | NulsSignData | Signagture Data |
 */

export interface IP2PKHScriptSigData {
  publicKey: Buffer;
  signData: INulsSignDataData;
}

export interface IP2PKHScriptSigOutput extends IReadData {
  readBytes: number;
  data: IP2PKHScriptSigData | null;
}

/**
 * Class to handle the protocol P2PKHScriptSig type
 * http://dev.nuls.io/protocol/index.html#P2PKHScriptSig
 * https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/script/P2PHKSignature.java#L44
 */
export class P2PKHScriptSigSerializer {

  public static SERIALIZE_LENGTH = 110;

  /**
   * Size of the serialized data
   * @param buf Buffer object from where the bytes will be read
   * @param data IP2PKHScriptSigData to calculate size
   */
  public static size(data: IP2PKHScriptSigData | INulsDataData): number {

    const nulsData = NulsDataSerializer.size(data);

    if (nulsData > 0) {
      return nulsData;
    }

    let size: number = VarByteSerializer.size((data as IP2PKHScriptSigData).publicKey);
    size += NulsSignDataSerializer.size((data as IP2PKHScriptSigData).signData);

    return size;

  }

  /**
   * Reads a P2PKHScriptSig from buf at the specified offset
   * @param buf Buffer object from where the bytes will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IP2PKHScriptSigOutput {

    const nulsData = NulsDataSerializer.read(buf, offset);

    if (nulsData.readBytes > 0) {
      return {
        readBytes: nulsData.readBytes,
        data: null
      };
    }

    const { data: publicKey, readBytes } = VarByteSerializer.read(buf, offset);
    offset += readBytes;

    const { data: signData, readBytes: readBytes2 } = NulsSignDataSerializer.read(buf, offset);

    return {
      readBytes: readBytes + readBytes2,
      data: {
        publicKey,
        signData
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
  public static write(data: IP2PKHScriptSigData | null, buf: Buffer, offset: number): number {

    const newOffset = NulsDataSerializer.write(data, buf, offset);

    if (newOffset > offset) {
      return newOffset;
    }
    
    offset = VarByteSerializer.write((data as IP2PKHScriptSigData).publicKey, buf, offset);
    offset = NulsSignDataSerializer.write((data as IP2PKHScriptSigData).signData, buf, offset);

    return offset;

  }

}
