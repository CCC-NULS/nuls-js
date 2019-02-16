import { TransactionType } from '../../common';
import { BaseTransaction, TransactionReceipt } from './baseTransaction';
import { ITxDataYellowCardData } from '../../utils/serialize/transaction/txData/txDataYellowCard';
import { PromiEvent } from 'web3-core-promievent';
 
export class YellowCardTransaction extends BaseTransaction {

  protected _system_tx = true;
  protected _type = TransactionType.YellowCard;
  protected _txData: ITxDataYellowCardData = {} as any;

  send(): PromiEvent<TransactionReceipt> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}