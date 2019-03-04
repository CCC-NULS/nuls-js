import { Address, AddressHash, hashFromAddress, addressFromHash } from '../../../crypto';
import { VarStringSerializer } from '../../varString';
import { VarByteSerializer } from '../../varByte';
import { IReadData } from '../../common';

/**
  * ### TxDataAlias
  * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-ACCOUNT-ALIAS
  *
  * ### TX_TYPE_ACCOUNT_ALIAS
  *
  * | 尺寸  | 字段       | 数据类型     | 说明           |
  * | ---- | ---------- | ---------- | -------------- |
  * | ??   | address    | VarByte    | 账户地址        |
  * | ??   | alias      | VarString  |  昵称          |
 */

export interface ITxDataAliasData {
  address: Address;
  alias: string;
}

export interface ITxDataAliasOutput extends IReadData {
  readBytes: number;
  data: ITxDataAliasData;
}

/**
 * Class to handle the protocol TxDataAlias type
 * https://github.com/nuls-io/nuls/blob/4436795eabe864437de013b83aee0dca0d5400bf/account-module/account/src/main/java/io/nuls/account/model/Alias.java#L41
 */
export class TxDataAliasSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txDataAlias
   */
  public static size(data: ITxDataAliasData): number {

    const addressHash: AddressHash = hashFromAddress(data.address);    
    let size: number = VarByteSerializer.size(addressHash);
    size += VarStringSerializer.size(data.alias);
    
    return size;

  }

  /**
   * Reads a txDataAlias buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataAliasOutput {

    const initialOffset = offset;

    const { data: addressHash, readBytes } = VarByteSerializer.read(buf, offset);
    const address: Address = addressFromHash(addressHash);
    offset += readBytes;

    const { data: alias, readBytes: readBytes2 } = VarStringSerializer.read(buf, offset);
    offset += readBytes2;

    return {
      readBytes: offset - initialOffset,
      data: {
        address,
        alias,
      }
    };

  }

  /**
   * Writes txDataAlias to buf at the specified offset
   * @param data txDataAlias to be written to buf
   * @param buf Buffer object where the txDataAlias will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataAliasData, buf: Buffer, offset: number): number {

    const addressHash: AddressHash = hashFromAddress(data.address);
    offset = VarByteSerializer.write(addressHash, buf, offset);
    offset = VarStringSerializer.write(data.alias, buf, offset);

    return offset;

  }

}
