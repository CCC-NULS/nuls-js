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
  readedBytes: number;
  data: ITxDataAliasedData;
}

/**
 * Class to handle the protocol TxDataAliased type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-ACCOUNT-ALIAS
 */
export class TxDataAliasedSerializer {

  /**
   * Reads a txDataAliased buf at the specified offset
   * @param buf Buffer object from where the data will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataAliasedOutput {

    const { readedBytes, data: addressHash } = VarByteSerializer.read(buf, offset);
    offset += readedBytes;
    const address: Address = addressFromHash(addressHash);

    const { readedBytes: readedBytes2, data: alias } = VarStringSerializer.read(buf, offset);

    return {
      readedBytes: readedBytes + readedBytes2,
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
   * @returns The number of bytes that has been written
   */
  public static write(data: ITxDataAliasedData, buf: Buffer, offset: number): number {

    const addressHash: AddressHash = hashFromAddress(data.address);
    const writtenBytes = VarByteSerializer.write(addressHash, buf, offset);

    return writtenBytes;

  }

}
