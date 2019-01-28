import { VarStringSerializer } from './../../varString';
import { AddressSerializer } from './../../address';
import { Address } from '../../../crypto';
import { ADDRESS_LENGTH } from '../../../../../../packages/core/common';
import { readUint64LE, IReadData, writeUint64LE } from '../../common';

/***
  * ### TxDataContractCall
  *
  * | 尺寸  | 字段            | 数据类型           |
  * | ---- | --------------- | ---------------- |
  * | 23   | sender          | Address          |
  * | 23   | contractAddress | Address          |
  * | 8    | value           | uint64           |
  * | 8    | gasLimit        | uint64           |
  * | 8    | price           | uint64           |
  * | ??   | methodName      | VarString        |
  * | ??   | methodDesc      | VarString        |
  * | ??   | args            | ContractArg[]    |
 */

export interface ITxDataContractCallData {
  sender: Address;
  contractAddress: Address;
  value: number;
  gasLimit: number;
  price: number;
  methodName: string;
  methodDesc: string;
  args: string[][];
}

export interface ITxDataContractCallOutput extends IReadData {
  readBytes: number;
  data: ITxDataContractCallData;
}

/**
 * Class to handle the protocol TxDataContractCall type
 * https://github.com/nuls-io/nuls/blob/16e685f2355cc28d0f59f9282122c6c0c63bbe22/contract-module/contract/src/main/java/io/nuls/contract/entity/txdata/CallContractData.java#L41
 */
export class TxDataContractCallSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txDataContractCall
   */
  public static size(data: ITxDataContractCallData): number {

    let size: number = (ADDRESS_LENGTH * 2) + (8 * 3);
    size += VarStringSerializer.size(data.methodName);
    size += VarStringSerializer.size(data.methodDesc);
    size += this.sizeArgs(data.args);

    return size;

  }

  /**
   * Reads a txDataContractCall buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataContractCallOutput {

    const initialOffset = offset;

    const sender: Address = AddressSerializer.read(buf, offset).data;
    offset += ADDRESS_LENGTH;

    const contractAddress: Address = AddressSerializer.read(buf, offset).data;
    offset += ADDRESS_LENGTH;

    const value: number = readUint64LE(buf, offset);
    offset += 8;

    const gasLimit: number = readUint64LE(buf, offset);
    offset += 8;

    const price: number = readUint64LE(buf, offset);
    offset += 8;

    const { data: methodName, readBytes } = VarStringSerializer.read(buf, offset);
    offset += readBytes;

    const { data: methodDesc, readBytes: readBytes2 } = VarStringSerializer.read(buf, offset);
    offset += readBytes2;

    const { data: args, readBytes: readBytes3 } = TxDataContractCallSerializer.readArgs(buf, offset);
    offset += readBytes3;

    return {
      readBytes: offset - initialOffset,
      data: {
        sender,
        contractAddress,
        value,
        gasLimit,
        price,
        methodName,
        methodDesc,
        args
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
  public static write(data: ITxDataContractCallData, buf: Buffer, offset: number): number {

    offset = AddressSerializer.write(data.sender, buf, offset);
    offset = AddressSerializer.write(data.contractAddress, buf, offset);
    offset = writeUint64LE(data.value, buf, offset);
    offset = writeUint64LE(data.gasLimit, buf, offset);
    offset = writeUint64LE(data.price, buf, offset);
    offset = VarStringSerializer.write(data.methodName, buf, offset);
    offset = VarStringSerializer.write(data.methodDesc, buf, offset);
    offset = TxDataContractCallSerializer.writeArgs(data.args, buf, offset);

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
