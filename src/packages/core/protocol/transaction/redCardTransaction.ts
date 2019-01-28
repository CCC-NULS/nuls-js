import { TransactionType, BlockVersion } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { BaseTransaction, TransactionHash } from './baseTransaction';
import { ITxDataRedCardData } from '../../utils/serialize/transaction/txData/txDataRedCard';
import { MAX_FEE_PRICE_1024_BYTES } from '../../utils';

export class RedCardTransaction extends BaseTransaction {

  protected _fee_price = MAX_FEE_PRICE_1024_BYTES;
  protected _system_tx = true;
  protected _type = TransactionType.RedCard;
  protected _txData: ITxDataRedCardData = {} as any;

  static fromBytes(bytes: Buffer, blockHeight?: number, blockVersion?: BlockVersion): RedCardTransaction {

    let tx = new RedCardTransaction(undefined, blockHeight, blockVersion);
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData, blockHeight?: number, blockVersion?: BlockVersion): RedCardTransaction {

    let tx = new RedCardTransaction(undefined, blockHeight, blockVersion);
    return this._fromRawData(rawData, tx);

  }

  async send(): Promise<TransactionHash> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}