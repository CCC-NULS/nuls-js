import { TransactionType } from '../../common';
import { BaseTransaction, TransactionReceipt } from './baseTransaction';
import { ITxDataRedCardData } from '../../utils/serialize/transaction/txData/txDataRedCard';
import { PromiEvent } from 'web3-core-promievent';
 
export class RedCardTransaction extends BaseTransaction {

  protected _system_tx = true;
  protected _type = TransactionType.RedCard;
  protected _txData: ITxDataRedCardData = {} as any;

  send(): PromiEvent<TransactionReceipt> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}