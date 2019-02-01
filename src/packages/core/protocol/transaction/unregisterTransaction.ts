import { TransactionType, BlockVersion } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { BaseTransaction, TransactionHash } from './baseTransaction';
import { ITxDataUnregisterData } from '../../utils/serialize/transaction/txData/txDataUnregister';
import { MAX_FEE_PRICE_1024_BYTES } from '../../utils';

// TODO: Implement this transaction
export class UnregisterTransaction extends BaseTransaction {

  protected _fee_price = MAX_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.Unregister;
  protected _txData: ITxDataUnregisterData = {} as any;

  static fromBytes(bytes: Buffer, blockHeight?: number, blockVersion?: BlockVersion): UnregisterTransaction {

    let tx = new UnregisterTransaction(undefined, blockHeight, blockVersion);
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData, blockHeight?: number, blockVersion?: BlockVersion): UnregisterTransaction {

    let tx = new UnregisterTransaction(undefined, blockHeight, blockVersion);
    return this._fromRawData(rawData, tx);

  }

  async send(): Promise<TransactionHash> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}