import { ITxDataWithdrawOutput, TxDataWithdrawSerializer, ITxDataWithdrawData } from './txDataWithdraw';

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

export type ITxDataUnregisterData = ITxDataWithdrawData;

export type ITxDataUnregisterOutput = ITxDataWithdrawOutput;

/**
 * Class to handle the protocol TxDataUnregister type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-STOP-AGENT
 */
export class TxDataUnregisterSerializer extends TxDataWithdrawSerializer {
}
