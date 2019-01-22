import { TransferTransaction } from './transferTransaction';
import { TransactionType } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { TransactionHash } from './baseTransaction';

// https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/protocol-module/protocol/src/main/java/io/nuls/protocol/model/tx/CoinBaseTransaction.java#L39
// https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/consensus-module/poc/consensus-poc-base/src/main/java/io/nuls/consensus/poc/util/ConsensusTool.java#L149
export class RewardTransaction extends TransferTransaction {

  protected static className = RewardTransaction;

  protected _fee_price = 0;
  protected _type = TransactionType.Reward;

  static fromBytes(bytes: Buffer): RewardTransaction {
    return super.fromBytes(bytes) as RewardTransaction;
  }

  static fromRawData(rawData: ITransactionData): RewardTransaction {
    return super.fromRawData(rawData) as RewardTransaction;
  }

  protected updateInputsAndOutputs(extraFee: number = 0): void {
    // No inputs nor change output
  }

  async send(): Promise<TransactionHash> {
    throw new Error('This kind of transaction can not be sent');
  }

}