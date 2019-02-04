import { TransactionType } from '../../common';
import { BaseTransaction, TransactionHash } from './baseTransaction';
import { ITxDataRedCardData } from '../../utils/serialize/transaction/txData/txDataRedCard';

export class RedCardTransaction extends BaseTransaction {

  protected _system_tx = true;
  protected _type = TransactionType.RedCard;
  protected _txData: ITxDataRedCardData = {} as any;

  async send(): Promise<TransactionHash> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}