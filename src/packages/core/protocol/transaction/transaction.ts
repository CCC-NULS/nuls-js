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
import { DataTransaction } from './dataTransaction';

export class Transaction {

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

      case TransactionType.Data:
        return DataTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.ContractCreate:
        return ContractCreateTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.ContractCall:
        return ContractCallTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.ContractDelete:
        return ContractDeleteTransaction.fromRawData(rawData, blockHeight, blockVersion);

      case TransactionType.ContractTransfer:
        return ContractTransferTransaction.fromRawData(rawData, blockHeight, blockVersion);

      default:
        throw new Error(`Transaction type ${TransactionType[rawData.type] ? TransactionType[rawData.type] : rawData.type} not supported`);

    }

  }

}
