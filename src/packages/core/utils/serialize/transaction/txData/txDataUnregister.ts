import { AgentHashSerializer } from '../../agentHash';
import { AgentHash } from '../../../crypto';
import { ITxDataOutput } from './txData';

/***
  * ### TxDataUnregister
  * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-STOP-AGENT
  *
  * ### TX_TYPE_STOP_AGENT
  *
  * | 尺寸  | 字段       | 数据类型           | 说明           |
  * | ---- | ---------- | ---------------- | -------------- |
  * | ??   | agentHash  | NulsDigestData   | 委托节点地址     |   (createTxHash??)
 */

export interface ITxDataUnregisterOutput extends ITxDataOutput {
  readedBytes: number;
  data: AgentHash;
}

/**
 * Class to handle the protocol TxDataUnregister type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-STOP-AGENT
 */
export class TxDataUnregisterSerializer {

  /**
   * Reads a txDataUnregister buf at the specified offset
   * @param buf Buffer object from where the data will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataUnregisterOutput {

    return AgentHashSerializer.read(buf, offset);

  }

  /**
   * Writes txDataUnregister to buf at the specified offset
   * @param data txDataUnregister to be written to buf
   * @param buf Buffer object where the txDataUnregister will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns The number of bytes that has been written
   */
  public static write(data: AgentHash, buf: Buffer, offset: number): number {

    return AgentHashSerializer.write(data, buf, offset);

  }

}
