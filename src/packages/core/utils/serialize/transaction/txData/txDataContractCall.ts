import { VarStringSerializer } from './../../varString';
import { AddressSerializer } from './../../address';
import { Address } from '../../../crypto';
import { ITxDataOutput } from './txData';
import { ADDRESS_LENGTH } from '../../../../../../packages/core/common';
import { readUint64LE, IReadedData, writeUint64LE } from '../../common';

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

export interface ITxDataContractCallOutput extends ITxDataOutput {
  readedBytes: number;
  data: ITxDataContractCallData;
}

/**
 * Class to handle the protocol TxDataContractCall type
 */
export class TxDataContractCallSerializer {

  /**
   * Reads a txDataContractCall buf at the specified offset
   * @param buf Buffer object from where the data will be readed
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

    const { data: methodName, readedBytes } = VarStringSerializer.read(buf, offset);
    offset += readedBytes;

    const { data: methodDesc, readedBytes: readedBytes2 } = VarStringSerializer.read(buf, offset);
    offset += readedBytes2;

    const { data: args, readedBytes: readedBytes3 } = TxDataContractCallSerializer.readArgs(buf, offset);
    offset += readedBytes3;

    return {
      readedBytes: offset - initialOffset,
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

  private static readArgs(buf: Buffer, offset: number): IReadedData {

    const initialOffset = offset;
    const argsLength: number = buf.readUInt8(offset);
    offset += 1;

    const args: any[] = [];

    for (let i = 0; i < argsLength; i++) {

      const arglen = buf.readUInt8(offset);
      offset += 1;

      const arg: string[] = [];
      for (let j = 0; j < arglen; j++) {

        const { data, readedBytes } = VarStringSerializer.read(buf, offset);
        offset += readedBytes;

        arg.push(data);

      }

      args.push(arg);

    }

    return {
      readedBytes: offset - initialOffset,
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
