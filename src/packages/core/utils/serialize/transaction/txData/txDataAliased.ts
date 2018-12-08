import { Address, AddressHash, hashFromAddress } from './../../../crypto';
import { VarStringSerializer } from './../../varString';
import { addressFromHash } from '../../../crypto';
import { VarByteSerializer } from '../../varByte';
import { ITxDataOutput } from './txData';

/***
  * ### TxDataAliased
  * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-ACCOUNT-ALIAS
  *
  * ### TX_TYPE_ACCOUNT_ALIAS
  *
  * | 尺寸  | 字段       | 数据类型     | 说明           |
  * | ---- | ---------- | ---------- | -------------- |
  * | ??   | address    | VarByte    | 账户地址        |
  * | ??   | alias      | VarString  |  昵称          |
 */

export interface ITxDataAliasedData {
  address: Address;
  alias: string;
}

export interface ITxDataAliasedOutput extends ITxDataOutput {
  readBytes: number;
  data: ITxDataAliasedData;
}

/**
 * Class to handle the protocol TxDataAliased type
 * https://github.com/nuls-io/nuls/blob/4436795eabe864437de013b83aee0dca0d5400bf/account-module/account/src/main/java/io/nuls/account/model/Alias.java#L41
 */
export class TxDataAliasedSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txDataAliased
   */
  public static size(data: ITxDataAliasedData): number {
    
    const addressHash: AddressHash = hashFromAddress(data.address);    
    let size: number = VarByteSerializer.size(addressHash);
    size += VarStringSerializer.size(data.alias);
    
    return size;

  }

  /**
   * Reads a txDataAliased buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataAliasedOutput {

    const { data: addressHash, readBytes } = VarByteSerializer.read(buf, offset);
    const address: Address = addressFromHash(addressHash);
    offset += readBytes;

    const { data: alias, readBytes: readBytes2 } = VarStringSerializer.read(buf, offset);
    offset += readBytes2;

    return {
      readBytes: offset,
      data: {
        address,
        alias,
      }
    };

  }

  /**
   * Writes txDataAliased to buf at the specified offset
   * @param data txDataAliased to be written to buf
   * @param buf Buffer object where the txDataAliased will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataAliasedData, buf: Buffer, offset: number): number {

    const addressHash: AddressHash = hashFromAddress(data.address);
    offset = VarByteSerializer.write(addressHash, buf, offset);
    offset = VarStringSerializer.write(data.address, buf, offset);

    return offset;

  }

}
