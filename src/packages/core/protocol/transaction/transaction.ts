import { TransactionType } from '../../common';
import { TransactionSerializer, ITransactionData } from '../../utils/serialize/transaction/transaction';
import { TransferTransaction } from './transferTransaction';
import { CoinData } from '../coin/coinData';
import { BaseTransaction } from './baseTransaction';

export class Transaction extends BaseTransaction {

  protected _type!: TransactionType;
  protected _time: number = new Date().getTime();
  protected _remark!: Buffer;
  protected _txData!: any;
  protected _coinData: CoinData = new CoinData();
  protected _signature!: Buffer | undefined;

  static fromBytes(bytes: string) {

    const bf = Buffer.from(bytes, 'base64');
    const transactionRawData: ITransactionData = TransactionSerializer.read(bf, 0).data;
    Transaction.fromRawData(transactionRawData);

  }

  static fromRawData(rawData: ITransactionData): BaseTransaction {

    let tx: BaseTransaction;

    switch (rawData.type) {

      case TransactionType.Transfer:
      default:
        tx = TransferTransaction.fromRawData(rawData);

    }

    return tx;

  }

}