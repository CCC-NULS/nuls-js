import { AddressSerializer } from '../../address';
import { Address } from '../../../crypto';
import { ADDRESS_LENGTH } from '../../../../common';
import { IReadData } from '../../common';

/***
  * ### TxDataContractDelete
  *
  * | 尺寸  | 字段            | 数据类型           |
  * | ---- | --------------- | ---------------- |
  * | 23   | sender          | Address          |
  * | 23   | contractAddress | Address          |
 */

export interface ITxDataContractDeleteData {
  sender: Address;
  contractAddress: Address;
}

export interface ITxDataContractDeleteOutput extends IReadData {
  readBytes: number;
  data: ITxDataContractDeleteData;
}

/**
 * Class to handle the protocol TxDataContractDelete type
 */
export class TxDataContractDeleteSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txDataContractCall
   */
  public static size(): number {

    let size: number = (ADDRESS_LENGTH * 2);

    return size;

  }

  /**
   * Reads a txDataContractCall buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataContractDeleteOutput {

    const initialOffset = offset;

    const sender: Address = AddressSerializer.read(buf, offset).data;
    offset += ADDRESS_LENGTH;

    const contractAddress: Address = AddressSerializer.read(buf, offset).data;
    offset += ADDRESS_LENGTH;

    return {
      readBytes: offset - initialOffset,
      data: {
        sender,
        contractAddress
      }
    };

  }

  /**
   * Writes txDataContractCall to buf at the specified offset
   * @param data txDataContractCall to be written to buf
   * @param buf Buffer object where the txDataContractCall will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataContractDeleteData, buf: Buffer, offset: number): number {

    offset = AddressSerializer.write(data.sender, buf, offset);
    offset = AddressSerializer.write(data.contractAddress, buf, offset);

    return offset;

  }

}
