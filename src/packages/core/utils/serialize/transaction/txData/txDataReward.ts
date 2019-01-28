import { PLACE_HOLDER, IReadData } from '../../common';

/***
  * ### TxDataReward (Coinbase)
  * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-COINBASE
  *
  * ### TX_TYPE_COINBASE
  *
  * | 尺寸   | 字段         | 数据类型    | 说明      |
  * | ---- | ---------- | ------- | -------------- |
  * | ??   | txData     | byte[]  | 0xFFFFFFFF     |
 */

export type ITxDataRewardData = Buffer;

export interface ITxDataRewardOutput extends IReadData {
  readBytes: number;
  data: ITxDataRewardData;
}

/**
 * Class to handle the protocol TxDataReward type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-COINBASE
 */
export class TxDataRewardSerializer {

  public static PLACE_HOLDER = PLACE_HOLDER;

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txDataReward
   */
  public static size(): number {
    
    return TxDataRewardSerializer.PLACE_HOLDER.length;

  }

  /**
   * Reads a txDataReward buf at the specified offset
   * @param buf Buffer object from where the number will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataRewardOutput {

    return {
      readBytes: TxDataRewardSerializer.PLACE_HOLDER.length,
      data: buf.slice(offset, offset + TxDataRewardSerializer.PLACE_HOLDER.length)
    };

  }

  /**
   * Writes txDataReward to buf at the specified offset
   * @param buf Buffer object where the txDataReward will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(buf: Buffer, offset: number): number {

    TxDataRewardSerializer.PLACE_HOLDER.copy(buf, offset);

    return offset + TxDataRewardSerializer.PLACE_HOLDER.length;

  }

}
