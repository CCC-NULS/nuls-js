import { YellowCardTransaction } from './yellowCardTransaction';
import { RegisterTransaction } from './registerTransaction';
import { TransactionType } from '../../common';
import { TransactionSerializer, ITransactionData } from '../../utils/serialize/transaction/transaction';
import { TransferTransaction } from './transferTransaction';
import { AliasTransaction } from './aliasTransaction';
import { BaseTransaction } from './baseTransaction';
import { RewardTransaction } from './rewardTransaction';
import { DepositTransaction } from './depositTransaction';
import { WithdrawTransaction } from './withdrawTransaction';
import { RedCardTransaction } from './redCardTransaction';
import { UnregisterTransaction } from './unregisterTransaction';

export class Transaction extends BaseTransaction {

  static fromBytes(bytes: Buffer): BaseTransaction {

    const rawData: ITransactionData = TransactionSerializer.read(bytes, 0).data;
    return this.fromRawData(rawData);

  }

  static fromRawData(rawData: ITransactionData): BaseTransaction {

    switch (rawData.type) {

      case TransactionType.Reward:
        return RewardTransaction.fromRawData(rawData);

      case TransactionType.Transfer:
        return TransferTransaction.fromRawData(rawData);

      case TransactionType.Alias:
        return AliasTransaction.fromRawData(rawData);

      case TransactionType.Register:
        return RegisterTransaction.fromRawData(rawData);

      case TransactionType.Deposit:
        return DepositTransaction.fromRawData(rawData);

      case TransactionType.Withdraw:
        return WithdrawTransaction.fromRawData(rawData);

      case TransactionType.YellowCard:
        return YellowCardTransaction.fromRawData(rawData);

      case TransactionType.RedCard:
        return RedCardTransaction.fromRawData(rawData);

      case TransactionType.Unregister:
        return UnregisterTransaction.fromRawData(rawData);

      default:
        throw new Error(`Transaction type ${TransactionType[rawData.type]} not supported`);

    }

  }

  static toRawData(tx: BaseTransaction): ITransactionData {

    const type: TransactionType = tx.getType();

    switch (type) {

      case TransactionType.Reward:
        return RewardTransaction.toRawData(tx);

      case TransactionType.Alias:
        return AliasTransaction.toRawData(tx);

      case TransactionType.Transfer:
        return TransferTransaction.toRawData(tx);

      case TransactionType.Register:
        return RegisterTransaction.toRawData(tx);

      case TransactionType.Deposit:
        return DepositTransaction.toRawData(tx);

      case TransactionType.Withdraw:
        return WithdrawTransaction.toRawData(tx);

      case TransactionType.YellowCard:
        return YellowCardTransaction.toRawData(tx);

      case TransactionType.RedCard:
        return RedCardTransaction.toRawData(tx);

      case TransactionType.Unregister:
        return UnregisterTransaction.toRawData(tx);

      default:
        throw new Error(`Transaction type ${TransactionType[type]} not supported`);

    }

  }

}
