import { ADDRESS_LENGTH } from '../../common';
import { Address, AddressHash, addressFromHash, hashFromAddress } from '../crypto';
import { IReadData } from './common';

/**
  * ### Address
  *
  * base 58 decoded 23 bytes length buffer `byte[23]`.
  *
  * | Len    | Fields  | Data Type    | Remark        |
  * | ------ | ------- | ------------ | ------------- |
  * | 23	   | address |  byte[23]	  | 地址           |
 */

export interface IAddressOutput extends IReadData {
  readBytes: number;
  data: Address;
}

/**
 * Class to handle the protocol Address type
 * http://dev.nuls.io/protocol/index.html#Address
 */
export class AddressSerializer {

  /**
   * Reads a Address from buf at the specified offset
   * @param buf Buffer object from where the bytes will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IAddressOutput {

    const addressHash: AddressHash = buf.slice(offset, offset + ADDRESS_LENGTH);
    const address: Address = addressFromHash(addressHash);

    return { data: address, readBytes: ADDRESS_LENGTH };

  }

  /**
   * Writes Address to buf at the specified offset
   * @param data The address to be written to buf
   * @param buf Buffer object where the bytes will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: Address, buf: Buffer, offset: number): number {

    const addressHash: AddressHash = hashFromAddress(data);
    offset += addressHash.copy(buf, offset);

    return offset;

  }

}
