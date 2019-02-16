import { TransactionType } from '../../common';
import { BaseTransaction, TransactionReceipt } from './baseTransaction';
import { ITxDataUnregisterData } from '../../utils/serialize/transaction/txData/txDataUnregister';
import { MAX_FEE_PRICE_1024_BYTES } from '../../utils';
import { PromiEvent } from 'web3-core-promievent';
 
// TODO: Implement this transaction
export class UnregisterTransaction extends BaseTransaction {

  protected _fee_price = MAX_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.Unregister;
  protected _txData: ITxDataUnregisterData = {} as any;

  send(): PromiEvent<TransactionReceipt> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}