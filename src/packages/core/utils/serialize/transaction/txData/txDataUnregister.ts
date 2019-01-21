import { TxDataWithdrawSerializer } from './txDataWithdraw';
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

export interface ITxDataUnregisterData {
  agentHash: AgentHash;
}

export interface ITxDataUnregisterOutput extends ITxDataOutput {
  readBytes: number;
  data: ITxDataUnregisterData;
}

/**
 * Class to handle the protocol TxDataUnregister type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-STOP-AGENT
 */
export class TxDataUnregisterSerializer {

  public static size(): number {

    return TxDataWithdrawSerializer.size();

  }

  public static read(buf: Buffer, offset: number): ITxDataUnregisterOutput {

    const { data, readBytes } = TxDataWithdrawSerializer.read(buf, offset);

    return {
      readBytes,
      data: {
        agentHash: data.depositHash,
      }
    };

  }

  public static write(data: ITxDataUnregisterData, buf: Buffer, offset: number): number {

    return TxDataWithdrawSerializer.write({ depositHash: data.agentHash }, buf, offset);

  }
}
