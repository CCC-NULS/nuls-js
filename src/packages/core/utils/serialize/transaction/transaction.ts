import { ITransactionOutput } from './transaction';
import { VarByteSerializer } from '..';
import { TxDataSerializer, ITxDataData } from './txData/txData';
import { CoinDataSerializer, ICoinDataData } from './coinData';
import { IReadedData } from '../common';

/***
  * ### Transaction
  * http://dev.nuls.io/protocol/index.html#Transaction
  *
  * | Len  | Fields     | Data Type   | Remark            |
  * | ---- | ---------- | ----------- | ----------------- |
  * | 2    | type       | uint16      | Trasaction Type   |
  * | 6    | time       | uint48      | timestamp         |
  * | ??   | remark     | VarByte     | remark            |
  * | ??   | txData     | ??          | Transaction data  |
  * | ??   | coinData   | ??          | Token data        |
  * | ??   | scriptSign | VarByte     | P2PKHScriptSig    |
 */

export interface ITransactionData {
  type: number;
  time: number;
  remark: Buffer;
  txData: ITxDataData;
  coinData: ICoinDataData;
  scriptSign: Buffer;
}

export interface ITransactionOutput extends IReadedData {
  readedBytes: number;
  data: ITransactionData;
}

/**
 * Class to handle the protocol Transaction type
 * http://dev.nuls.io/protocol/index.html#Transaction
 */
export class TransactionSerializer {

  /**
   * Reads a tx buf at the specified offset
   * @param buf Buffer object from where the transaction will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITransactionOutput {

    const initialOffset = offset;

    const type = buf.readUInt16LE(offset);
    offset += 2;

    const time = buf.readUIntLE(offset, 6); // 48 bits
    offset += 6;

    const { data: remark, readedBytes: bytes1 } = VarByteSerializer.read(buf, offset);
    offset += bytes1;

    const { data: txData, readedBytes: bytes2 } = TxDataSerializer.read(buf, offset, type);
    offset += bytes2;

    const { data: coinData, readedBytes: bytes3 } = CoinDataSerializer.read(buf, offset);
    offset += bytes3;

    const { data: scriptSign, readedBytes: bytes4 } = VarByteSerializer.read(buf, offset);
    offset += bytes4;

    return {
      readedBytes: offset - initialOffset,
      data: {
        type,
        time,
        remark,
        txData,
        coinData,
        scriptSign
      }
    };

  }

  /**
   * Writes data to buf at the specified offset
   * @param data Transaction data to be written to buffer
   * @param buf Buffer object where the transaction will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns The number of bytes that has been written
   */
  public static write(data: ITransactionData, buf: Buffer, offset: number = 0): number {

    const initialOffset = offset;

    offset += buf.writeUInt16LE(data.type, offset);
    offset += buf.writeUIntLE(data.time, offset, 6); // 48 bits
    offset += VarByteSerializer.write(data.remark, buf, offset);
    offset += VarByteSerializer.write(data.remark, buf, offset);
    offset += TxDataSerializer.write(data.txData, buf, offset, data.type);
    offset += CoinDataSerializer.write(data.coinData, buf, offset);

    if (data.scriptSign) {
      offset += VarByteSerializer.write(data.scriptSign, buf, offset);
    }

    return offset - initialOffset;

  }

}
