import { PLACE_HOLDER } from '../../../../../../packages/core/common';
import { ITxDataOutput } from './txData';

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

export interface ITxDataRewardOutput extends ITxDataOutput {
  readedBytes: number;
  value: number;
}

/**
 * Class to handle the protocol TxDataReward type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-COINBASE
 */
export class TxDataRewardSerializer {

  /**
   * Reads a txDataReward buf at the specified offset
   * @param buf Buffer object from where the number will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataRewardOutput {

    return {
      readedBytes: PLACE_HOLDER.length,
      value: buf.readUIntLE(offset + 1, PLACE_HOLDER.length)
    };

  }

  /**
   * Writes value to buf at the specified offset
   * @param value Number to be written to buf
   * @param buf Buffer object where the number will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns The number of bytes that has been written
   */
  public static write(buf: Buffer, offset: number): number {

    PLACE_HOLDER.copy(buf, offset);
    offset += PLACE_HOLDER.length;

    return offset;

  }

}
