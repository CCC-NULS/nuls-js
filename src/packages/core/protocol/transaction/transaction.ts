import { TransactionType } from '../../common';
import { TransactionSerializer, ITransactionData } from '../../utils/serialize/transaction/transaction';
import { TransferTransaction } from './transferTransaction';
import { BaseTransaction } from './baseTransaction';
import { AliasTransaction } from './aliasTransaction';

export class Transaction extends BaseTransaction {

  static fromBytes(bytes: Buffer): BaseTransaction {

    const rawData: ITransactionData = TransactionSerializer.read(bytes, 0).data;
    return this.fromRawData(rawData);

  }

  static fromRawData(rawData: ITransactionData): BaseTransaction {

    let tx: BaseTransaction;

    switch (rawData.type) {

      case TransactionType.Alias:
        tx = AliasTransaction.fromRawData(rawData);

      case TransactionType.Transfer:
      default:
        tx = TransferTransaction.fromRawData(rawData);

    }

    return tx;

  }

  static toRawData(tx: BaseTransaction): ITransactionData {

    let rawData: ITransactionData;

    switch (tx.getType()) {

      case TransactionType.Alias:
        rawData = AliasTransaction.toRawData(tx);

      case TransactionType.Transfer:
      default:
        rawData = TransferTransaction.toRawData(tx);

    }

    return rawData;

  }

}
