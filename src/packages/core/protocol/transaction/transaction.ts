import { YellowCardTransaction } from './yellowCardTransaction';
import { RegisterTransaction } from './registerTransaction';
import { TransactionType, BlockVersion } from '../../common';
import { TransactionSerializer, ITransactionData } from '../../utils/serialize/transaction/transaction';
import { TransferTransaction } from './transferTransaction';
import { AliasTransaction } from './aliasTransaction';
import { BaseTransaction } from './baseTransaction';
import { RewardTransaction } from './rewardTransaction';
import { DepositTransaction } from './depositTransaction';
import { WithdrawTransaction } from './withdrawTransaction';
import { RedCardTransaction } from './redCardTransaction';
import { UnregisterTransaction } from './unregisterTransaction';
import { ContractCreateTransaction, ContractCallTransaction, ContractDeleteTransaction, ContractTransferTransaction } from '../../../contract/protocol/transaction';

export class Transaction extends BaseTransaction {

  static fromBytes(bytes: Buffer, blockHeight?: number, blockVersion?: BlockVersion): BaseTransaction {

    const rawData: ITransactionData = TransactionSerializer.read(bytes, 0).data;
    return this.fromRawData(rawData, blockHeight, blockVersion);

  }

  static fromRawData(rawData: ITransactionData, blockHeight?: number, blockVersion?: BlockVersion): BaseTransaction {

    switch (rawData.type) {

      case TransactionType.Reward:
        return RewardTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.Transfer:
        return TransferTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.Alias:
        return AliasTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.Register:
        return RegisterTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.Deposit:
        return DepositTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.Withdraw:
        return WithdrawTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.YellowCard:
        return YellowCardTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.RedCard:
        return RedCardTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.Unregister:
        return UnregisterTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.ContractCreate:
        return ContractCreateTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.ContractCall:
        return ContractCallTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.ContractDelete:
        return ContractDeleteTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.ContractTransfer:
        return ContractTransferTransaction.fromRawData(rawData, blockHeight, blockVersion);

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

      case TransactionType.ContractCreate:
        return ContractCreateTransaction.toRawData(tx);

      case TransactionType.ContractCall:
        return ContractCallTransaction.toRawData(tx);

      case TransactionType.ContractDelete:
        return ContractDeleteTransaction.toRawData(tx);

      case TransactionType.ContractTransfer:
        return ContractTransferTransaction.toRawData(tx);

      default:
        throw new Error(`Transaction type ${TransactionType[type]} not supported`);

    }

  }

}
