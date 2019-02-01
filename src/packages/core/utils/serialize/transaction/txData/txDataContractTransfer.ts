import { HashSerializer } from './../../hash';
import { HASH_LENGTH } from './../../../../common';
import { Hash, Address } from './../../../crypto';
import { IReadData } from '../../common';
import { ADDRESS_LENGTH } from '@/packages/core/common';
import { AddressSerializer } from '../../address';

/***
  * ### TxDataContractTransfer
  *
  * | 尺寸  | 字段            | 数据类型              |
  * | ---- | --------------- | ------------------- |
  * | 34   | orginTxHash     | NulsDigestDataData  |
  * | 23   | contractAddress | Address             |
  * | 1    | success         | byte                |
 */

export interface ITxDataContractTransferData {
  orginTxHash: Hash;
  contractAddress: Address;
  success: boolean;
}

export interface ITxDataContractTransferOutput extends IReadData {
  readBytes: number;
  data: ITxDataContractTransferData;
};

/**
 * Class to handle the protocol TxDataContractTransfer type
 */
export class TxDataContractTransferSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txDataContractTransfer
   */
  public static size(): number {

    let size: number = ADDRESS_LENGTH + HASH_LENGTH + 1;

    return size;

  }

  /**
   * Reads a txDataContractTransfer buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataContractTransferOutput {

    const initialOffset = offset;

    const orginTxHash: Hash = HashSerializer.read(buf, offset).data;
    offset += HASH_LENGTH;

    const contractAddress: Address = AddressSerializer.read(buf, offset).data;
    offset += ADDRESS_LENGTH;

    const success: boolean = !!buf.readUInt8(offset);
    offset += 1;

    return {
      readBytes: offset - initialOffset,
      data: {
        orginTxHash,
        contractAddress,
        success
      }
    };

  }

  /**
   * Writes txDataContractTransfer to buf at the specified offset
   * @param data txDataContractTransfer to be written to buf
   * @param buf Buffer object where the txDataContractTransfer will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataContractTransferData, buf: Buffer, offset: number): number {

    offset = HashSerializer.write(data.orginTxHash, buf, offset);
    offset = AddressSerializer.write(data.contractAddress, buf, offset);
    offset = buf.writeUInt8(data.success ? 1 : 0, offset);

    return offset;

  }

}
