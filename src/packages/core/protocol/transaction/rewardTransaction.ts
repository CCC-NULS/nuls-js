import { TransferTransaction } from './transferTransaction';
import { TransactionType } from '../../common';
import { TransactionReceipt } from './baseTransaction';
import { PromiEvent } from 'web3-core-promievent';
 
// https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/protocol-module/protocol/src/main/java/io/nuls/protocol/model/tx/CoinBaseTransaction.java#L39
// https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/consensus-module/poc/consensus-poc-base/src/main/java/io/nuls/consensus/poc/util/ConsensusTool.java#L149
export class RewardTransaction extends TransferTransaction {

  protected _fee_price = 0;
  protected _type = TransactionType.Reward;
  protected _system_tx = true;

  protected updateInputsAndOutputs(): void {
    // No inputs nor change output
  }

  send(): PromiEvent<TransactionReceipt> {
    throw new Error('This kind of transaction can not be sent');
  }

}