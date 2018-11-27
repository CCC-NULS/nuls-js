import { ITxDataRewardOutput, TxDataRewardSerializer } from './txDataReward';

/***
  * ### TxDataTransfer
  * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-TRANSFER
  *
  * ### TX_TYPE_TRANSFER
  *
  * | 尺寸   | 字段         | 数据类型    | 说明      |
  * | ---- | ---------- | ------- | -------------- |
  * | ??   | txData     | byte[]  | 0xFFFFFFFF     |
 */

export type ITxDataTransferOutput = ITxDataRewardOutput;

/**
 * Class to handle the protocol TxDataTransfer type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-TRANSFER
 */
export class TxDataTransferSerializer extends TxDataRewardSerializer {
}
