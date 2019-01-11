import { BlockHeaderSerializer, IBlockHeaderData } from './blockHeader';
import { IReadData } from '../common';
import { TransactionSerializer, ITransactionData } from '../transaction/transaction';

/***
  * ### Block
  * https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/core-module/kernel/src/main/java/io/nuls/kernel/model/Block.java#L41
  *
  * | Len  | Fields        | Data Type       | Remark            |
  * | ---- | ------------- | --------------- | ----------------- |
  * | ??   | header        | BlockHeader     |                   |
  * | ??   | transactions  | Transaction[]   |                   |
 */

export interface IBlockData {
  header: IBlockHeaderData;
  transactions: ITransactionData[];
}

export interface IBlockOutput extends IReadData {
  readBytes: number;
  data: IBlockData;
}

/**
 * Class to handle the protocol Block type
 */
export class BlockSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized block
   */
  public static size(data: IBlockData): number {

    let size: number = 0;

    size += BlockHeaderSerializer.size(data.header);

    for (let tx of data.transactions) {

      size += TransactionSerializer.size(tx);

    }

    return size;

  }

  /**
   * Reads a tx buf at the specified offset
   * @param buf Buffer object from where the block will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IBlockOutput {

    const initialOffset = offset;

    const { data: header, readBytes: bytes1 } = BlockHeaderSerializer.read(buf, offset);
    offset += bytes1;

    const transactions: ITransactionData[] = [];
    
    for (let i= 0; i < header.txCount; i++) {

      const { data: transaction, readBytes: bytes2 } = TransactionSerializer.read(buf, offset);
      offset += bytes2;

      transactions.push(transaction);

    }

    const output: IBlockOutput = {
      readBytes: offset - initialOffset,
      data: {
        header,
        transactions,
      }
    };

    return output;

  }

  /**
   * Writes data to buf at the specified offset
   * @param data Block data to be written to buffer
   * @param buf Buffer object where the block will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: IBlockData, buf: Buffer, offset: number = 0): number {

    offset = BlockHeaderSerializer.write(data.header, buf, offset);

    for (let tx of data.transactions) {

      offset = TransactionSerializer.write(tx, buf, offset);

    }

    return offset;

  }

}
