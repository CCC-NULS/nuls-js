import { TransactionType } from '../../common';
import { BaseTransaction, TransactionHash } from './baseTransaction';
import { ITxDataUnregisterData } from '../../utils/serialize/transaction/txData/txDataUnregister';
import { MAX_FEE_PRICE_1024_BYTES } from '../../utils';

// TODO: Implement this transaction
export class UnregisterTransaction extends BaseTransaction {

  protected _fee_price = MAX_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.Unregister;
  protected _txData: ITxDataUnregisterData = {} as any;

  async send(): Promise<TransactionHash> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}