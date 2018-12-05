import { AddressHash } from './../../crypto';
import { IReadedData, VarByteSerializer, writeUint64LE, readUint64LE } from '..';

/***
  * ### Coin
  * https://github.com/nuls-io/nuls/blob/master/core-module/kernel/src/main/java/io/nuls/kernel/model/Coin.java#L77
  *
  * | Len  | Fields     | Data Type   | Remark             |
  * | ---- | ---------- | ----------- | ------------------ |
  * | ??   | owner      | VarByte     | Owner address hash |
  * | 8    | na         | int64       | Nuls amount        |
  * | 6    | lockTime   | uint48      | Lock time          |
  * 
 */
export interface ICoinData {
  owner: AddressHash;
  na: number;
  lockTime: number;
}

export interface ICoinOutput extends IReadedData {
  data: ICoinData;
};

/**
 * Class to handle the protocol Coin type
 * https://github.com/nuls-io/nuls/blob/master/core-module/kernel/src/main/java/io/nuls/kernel/model/Coin.java#L77
 */
export class CoinSerializer {

  /**
   * Reads a coin from buf at the specified offset
   * @param buf Buffer object from where the number will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ICoinOutput {

    const initialOffset = offset;

    const { data: owner, readedBytes } = VarByteSerializer.read(buf, offset);
    offset += readedBytes;
    
    const na = readUint64LE(buf, offset);
    offset += 8;

    const lockTime = buf.readUIntLE(offset, 6); // 48 bits
    offset += 6; // 48 bits
    
    return {
      readedBytes: offset - initialOffset,
      data: {
        owner,
        na,
        lockTime
      }
    };

  }

  /**
   * Writes value to buf at the specified offset
   * @param data Coin to be written to buf
   * @param buf Buffer object where the number will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns The number of bytes that has been written
   */
  public static write(data: ICoinData, buf: Buffer, offset: number): number {

    const initialOffset = offset;

    offset += VarByteSerializer.write(data.owner, buf, offset);
    offset += writeUint64LE(data.na, buf, offset);
    offset += buf.writeUIntLE(data.lockTime, offset, 6); // 48 bits

    return offset - initialOffset;

  }

}
