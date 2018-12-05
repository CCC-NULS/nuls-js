import { AgentHashSerializer } from '../../agentHash';
import { AgentHash } from '../../../crypto';
import { ITxDataOutput } from './txData';

/***
  * ### TxDataWithdraw
  * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-CANCEL-DEPOSIT
  *
  * ### TX_TYPE_CANCEL_DEPOSIT
  *
  * | 尺寸  | 字段       | 数据类型           | 说明           |
  * | ---- | ---------- | ---------------- | -------------- |
  * | ??   | agentHash  | NulsDigestData   | 委托节点地址     |   (joinTxHash??)
 */

export interface ITxDataWithdrawData {
  agentHash: AgentHash;
}

export interface ITxDataWithdrawOutput extends ITxDataOutput {
  readedBytes: number;
  data: ITxDataWithdrawData;
}

/**
 * Class to handle the protocol TxDataWithdraw type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-CANCEL-DEPOSIT
 */
export class TxDataWithdrawSerializer {

  /**
   * Reads a txDataDeposit buf at the specified offset
   * @param buf Buffer object from where the data will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataWithdrawOutput {

    const { data: agentHash, readedBytes } = AgentHashSerializer.read(buf, offset);

    return {
      readedBytes,
      data: { agentHash }
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

    return AgentHashSerializer.write(data.agentHash, buf, offset);

  }

}
