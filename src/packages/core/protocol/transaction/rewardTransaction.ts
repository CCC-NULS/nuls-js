import { TransactionType } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { BaseTransaction, TransactionConfig } from './baseTransaction';
import { ITxDataRewardData } from '../../utils/serialize/transaction/txData/txDataReward';
import { UTXO } from '../utxo';
import { PLACE_HOLDER } from '../../utils/serialize';

// https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/protocol-module/protocol/src/main/java/io/nuls/protocol/model/tx/CoinBaseTransaction.java#L39
// https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/consensus-module/poc/consensus-poc-base/src/main/java/io/nuls/consensus/poc/util/ConsensusTool.java#L149
export class RewardTransaction extends BaseTransaction {

  protected _fee_price = 0;
  protected _type = TransactionType.Reward;
  protected _txData: ITxDataRewardData = {
    placeholder: PLACE_HOLDER
  };

  static fromBytes(bytes: Buffer) {

    let tx = new RewardTransaction();
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData): RewardTransaction {

    let tx = new RewardTransaction();
    return this._fromRawData(rawData, tx);

  }

  static async fromAddress(address: string, config?: TransactionConfig): Promise<RewardTransaction> {

    let tx = new RewardTransaction();
    return this._fromAddress<RewardTransaction>(address, tx, config);

  };

  static fromUtxos(utxos: UTXO[]): RewardTransaction {

    let tx = new RewardTransaction();
    return this._fromUtxos<RewardTransaction>(utxos, tx);

  };

  constructor() {
    super();
  }

}