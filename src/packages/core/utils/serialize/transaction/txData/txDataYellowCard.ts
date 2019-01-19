import { AddressSerializer } from './../../address';
import { Address } from '../../../crypto';
import { ITxDataOutput } from '.';
import { ADDRESS_LENGTH } from '../../../../common';
import { VarIntSerializer } from '../../varInt';

/***
  * ### TxDataYellowCard
  * 
  * https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/consensus-module/poc/consensus-poc-protocol/src/main/java/io/nuls/consensus/poc/protocol/entity/YellowPunishData.java#L45
  *
  * | Len  | Fields      | Data Type        | Remark         |
  * | ---- | ----------- | ---------------- | -------------- |
  * | ??   | addresSize  | VarInt           |                |
  * | ??   | addreses    | byte[23][]       |                |
  * 
 */

export interface ITxDataYellowCardData {
  addresses: Address[];
}

export interface ITxDataYellowCardOutput extends ITxDataOutput {
  readBytes: number;
  data: ITxDataYellowCardData;
}

/**
 * Class to handle the protocol TxDataYellowCard type
 */
export class TxDataYellowCardSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized TxDataYellowCard
   */
  public static size(data: ITxDataYellowCardData): number {

    let size: number = (data.addresses.length * ADDRESS_LENGTH);
    size += VarIntSerializer.size(data.addresses.length);

    return size;

  }

  /**
   * Reads a txDataYellowCard buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataYellowCardOutput {

    const initialOffset = offset;

    const { data: size, readBytes } = VarIntSerializer.read(buf, offset);
    offset += readBytes;

    const addresses: Address[] = [];

    for (let i = 0; i < size; i++) {

      const { data: address, readBytes } = AddressSerializer.read(buf, offset)
      addresses.push(address);
      offset += readBytes;

    }

    return {
      readBytes: offset - initialOffset,
      data: { addresses }
    };

  }

  /**
   * Writes txDataYellowCard to buf at the specified offset
   * @param data txDataYellowCard to be written to buf
   * @param buf Buffer object where the txDataYellowCard will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataYellowCardData, buf: Buffer, offset: number): number {

    offset = VarIntSerializer.write(data.addresses.length, buf, offset);

    for (let i = 0; i < data.addresses.length; i++) {

      offset = AddressSerializer.write(data.addresses[i], buf, offset);

    }

    return offset;

  }

}
