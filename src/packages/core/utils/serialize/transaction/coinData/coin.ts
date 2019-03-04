import { AddressHash } from '../../../crypto';
import { IReadData, VarByteSerializer, writeUint64LE, readUint64LE } from '../..';

/**
  * ### Coin
  * https://github.com/nuls-io/nuls/blob/master/core-module/kernel/src/main/java/io/nuls/kernel/model/Coin.java#L77
  * 
  * TODO: Implement P2SH address serialization:
  * https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/account-ledger-module/base/account-ledger-base/src/main/java/io/nuls/account/ledger/base/service/impl/AccountLedgerServiceImpl.java#L731
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

export interface ICoinOutput extends IReadData {
  data: ICoinData;
};

/**
 * Class to handle the protocol Coin type
 * https://github.com/nuls-io/nuls/blob/master/core-module/kernel/src/main/java/io/nuls/kernel/model/Coin.java#L77
 */
export class CoinSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized coin
   */
  public static size(data: ICoinData): number {

    let size: number = 8 + 6;
    size += VarByteSerializer.size(data.owner);

    return size;

  }

  /**
   * Reads a coin from buf at the specified offset
   * @param buf Buffer object from where the number will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ICoinOutput {

    const initialOffset = offset;

    const { data: owner, readBytes } = VarByteSerializer.read(buf, offset);
    offset += readBytes;
    
    const na = readUint64LE(buf, offset);
    offset += 8;

    // TODO: Sometimes lockTime is -1 so we are using int48 instead uint48 to serialize it
    const lockTime = buf.readIntLE(offset, 6); // 48 bits
    offset += 6; // 48 bits
    
    return {
      readBytes: offset - initialOffset,
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
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ICoinData, buf: Buffer, offset: number): number {

    offset = VarByteSerializer.write(data.owner, buf, offset);
    offset = writeUint64LE(data.na, buf, offset);
    // TODO: Sometimes lockTime is -1 so we are using int48 instead uint48 to serialize it
    offset = buf.writeIntLE(data.lockTime, offset, 6); // 48 bits

    return offset;

  }

}
