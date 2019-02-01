import { VarByteSerializer } from './../../varByte';
import { VarStringSerializer } from '../../varString';
import { AddressSerializer } from '../../address';
import { Address } from '../../../crypto';
import { ADDRESS_LENGTH } from '../../../../common';
import { readUint64LE, IReadData, writeUint64LE } from '../../common';

/***
  * ### TxDataContractCreate
  *
  * | 尺寸  | 字段            | 数据类型           |
  * | ---- | --------------- | ---------------- |
  * | 23   | sender          | Address          |
  * | 23   | contractAddress | Address          |
  * | 8    | value           | uint64           |
  * | 4    | codeLen         | uint32           |
  * | ??   | code            | VarByte          |
  * | 8    | gasLimit        | uint64           |
  * | 8    | price           | uint64           |
  * | ??   | args            | ContractArg[]    |
 */

export interface ITxDataContractCreateData {
  sender: Address;
  contractAddress: Address;
  value: number;
  codeLen: number;
  code: Buffer;
  gasLimit: number;
  price: number;
  args: string[][];
}

export interface ITxDataContractCreateOutput extends IReadData {
  readBytes: number;
  data: ITxDataContractCreateData;
}

/**
 * Class to handle the protocol TxDataContractCreate type
 */
export class TxDataContractCreateSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txDataContractCreate
   */
  public static size(data: ITxDataContractCreateData): number {

    let size: number = (ADDRESS_LENGTH * 2) + (8 * 3) + 4;
    size += VarByteSerializer.size(data.code);
    size += this.sizeArgs(data.args);

    return size;

  }

  /**
   * Reads a txDataContractCreate buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataContractCreateOutput {

    const initialOffset = offset;

    const sender: Address = AddressSerializer.read(buf, offset).data;
    offset += ADDRESS_LENGTH;

    const contractAddress: Address = AddressSerializer.read(buf, offset).data;
    offset += ADDRESS_LENGTH;

    const value: number = readUint64LE(buf, offset);
    offset += 8;

    const codeLen: number = buf.readUInt32LE(offset);
    offset += 4;

    const { data: code, readBytes } = VarByteSerializer.read(buf, offset);
    offset += readBytes;

    const gasLimit: number = readUint64LE(buf, offset);
    offset += 8;

    const price: number = readUint64LE(buf, offset);
    offset += 8;

    const { data: args, readBytes: readBytes2 } = TxDataContractCreateSerializer.readArgs(buf, offset);
    offset += readBytes2;

    return {
      readBytes: offset - initialOffset,
      data: {
        sender,
        contractAddress,
        value,
        codeLen,
        code,
        gasLimit,
        price,
        args
      }
    };

  }

  /**
   * Writes txDataContractCreate to buf at the specified offset
   * @param data txDataContractCreate to be written to buf
   * @param buf Buffer object where the txDataContractCreate will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataContractCreateData, buf: Buffer, offset: number): number {

    offset = AddressSerializer.write(data.sender, buf, offset);
    offset = AddressSerializer.write(data.contractAddress, buf, offset);
    offset = writeUint64LE(data.value, buf, offset);
    offset = buf.writeUInt32LE(data.codeLen, offset);
    offset = VarByteSerializer.write(data.code, buf, offset);
    offset = writeUint64LE(data.gasLimit, buf, offset);
    offset = writeUint64LE(data.price, buf, offset);
    offset = TxDataContractCreateSerializer.writeArgs(data.args, buf, offset);

    return offset;

  }

  private static sizeArgs(data: string[][]): number {

    let size: number = 1;

    for (const arg of data) {

      size += 1;

      for (const argItem of arg) {

        size += VarStringSerializer.size(argItem);

      }

    }

    return size;
    
  }

  private static readArgs(buf: Buffer, offset: number): IReadData {

    const initialOffset = offset;
    const argsLength: number = buf.readUInt8(offset);
    offset += 1;

    const args: any[] = [];

    for (let i = 0; i < argsLength; i++) {

      const arglen = buf.readUInt8(offset);
      offset += 1;

      const arg: string[] = [];
      for (let j = 0; j < arglen; j++) {

        const { data, readBytes } = VarStringSerializer.read(buf, offset);
        offset += readBytes;

        arg.push(data);

      }

      args.push(arg);

    }

    return {
      readBytes: offset - initialOffset,
      data: args
    }

  }

  private static writeArgs(data: string[][], buf: Buffer, offset: number): number {

    offset = buf.writeUInt8(data.length, offset);

    for (const arg of data) {

      offset = buf.writeUInt8(arg.length, offset);

      for (const argItem of arg) {

        offset = VarStringSerializer.write(argItem, buf, offset);

      }

    }

    return offset;

  }

}
