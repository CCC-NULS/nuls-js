import { TransactionType } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { BaseTransaction, TransactionHash } from './baseTransaction';
import { ITxDataYellowCardData } from '../../utils/serialize/transaction/txData/txDataYellowCard';
import { MAX_FEE_PRICE_1024_BYTES } from '../../utils';

export class YellowCardTransaction extends BaseTransaction {

  protected _fee_price = MAX_FEE_PRICE_1024_BYTES;
  protected _system_tx = true;
  protected _type = TransactionType.YellowCard;
  protected _txData: ITxDataYellowCardData = {} as any;

  static fromBytes(bytes: Buffer) {

    let tx = new YellowCardTransaction();
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData): YellowCardTransaction {

    let tx = new YellowCardTransaction();
    return this._fromRawData(rawData, tx);

  }

  async send(): Promise<TransactionHash> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}