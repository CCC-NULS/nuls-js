import { AddressSerializer } from '../../address';
import { Address } from '../../../crypto';
import { ADDRESS_LENGTH } from '../../../../common';
import { VarByteSerializer } from '../../varByte';
import { IReadData } from '../../common';

/***
  * ### TxDataRedCard
  * 
  * https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/consensus-module/poc/consensus-poc-protocol/src/main/java/io/nuls/consensus/poc/protocol/entity/RedPunishData.java#L39
  *
  * | Len  | Fields      | Data Type        | Remark         |
  * | ---- | ----------- | ---------------- | -------------- |
  * | 23   | address     | byte[23]         |                |
  * | 1    | reasonCode  | byte             |                |
  * | ??   | evidence    | VarByte          |                |
  * 
 */

export interface ITxDataRedCardData {
  address: Address;
  reasonCode: number;
  evidence: Buffer
}

export interface ITxDataRedCardOutput extends IReadData {
  readBytes: number;
  data: ITxDataRedCardData;
}

/**
 * Class to handle the protocol TxDataRedCard type
 */
export class TxDataRedCardSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized TxDataRedCard
   */
  public static size(data: ITxDataRedCardData): number {

    let size: number = ADDRESS_LENGTH + 1;
    size += VarByteSerializer.size(data.evidence);

    return size;

  }

  /**
   * Reads a txDataRedCard buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataRedCardOutput {

    const initialOffset = offset;

    const { data: address, readBytes } = AddressSerializer.read(buf, offset)
    offset += readBytes;

    const reasonCode = buf.readUInt8(offset);
    offset += 1;

    const { data: evidence, readBytes: readBytes2 } = VarByteSerializer.read(buf, offset)
    offset += readBytes2;

    return {
      readBytes: offset - initialOffset,
      data: {
        address,
        reasonCode,
        evidence
      }
    };

  }

  /**
   * Writes txDataRedCard to buf at the specified offset
   * @param data txDataRedCard to be written to buf
   * @param buf Buffer object where the txDataRedCard will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataRedCardData, buf: Buffer, offset: number): number {

    offset = AddressSerializer.write(data.address, buf, offset);
    offset = buf.writeUInt8(data.reasonCode, offset);
    offset = VarByteSerializer.write(data.evidence, buf, offset);

    return offset;

  }

}
