import { Hash } from '../../../crypto';
import { HashSerializer } from '../../hash';
import { ITxDataOutput } from './txData';
import { HASH_LENGTH } from '../../../../common';

/***
  * ### TxDataWithdraw
  * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-CANCEL-DEPOSIT
  *
  * ### TX_TYPE_CANCEL_DEPOSIT
  *
  * | Len  | Fields         | Data Type        | Remark         |
  * | ---- | -------------- | ---------------- | -------------- |
  * | ??   | depositHash  | NulsDigestData   | 委托节点地址     |
 */

export interface ITxDataWithdrawData {
  depositHash: Hash;
}

export interface ITxDataWithdrawOutput extends ITxDataOutput {
  readBytes: number;
  data: ITxDataWithdrawData;
}

/**
 * Class to handle the protocol TxDataWithdraw type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-CANCEL-DEPOSIT
 */
export class TxDataWithdrawSerializer {

  private static BYTES_LENGTH = HASH_LENGTH;

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txDataWithdraw
   */
  public static size(): number {

    return TxDataWithdrawSerializer.BYTES_LENGTH;

  }

  /**
   * Reads a txDataDeposit buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataWithdrawOutput {

    const { data: depositHash, readBytes } = HashSerializer.read(buf, offset);

    return {
      readBytes,
      data: { depositHash }
    };

  }

  /**
   * Writes txDataDeposit to buf at the specified offset
   * @param data txDataDeposit to be written to buf
   * @param buf Buffer object where the txDataDeposit will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataWithdrawData, buf: Buffer, offset: number): number {

    return HashSerializer.write(data.depositHash, buf, offset);

  }

}
