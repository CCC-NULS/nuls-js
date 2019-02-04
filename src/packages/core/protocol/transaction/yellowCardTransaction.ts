import { TransactionType } from '../../common';
import { BaseTransaction, TransactionHash } from './baseTransaction';
import { ITxDataYellowCardData } from '../../utils/serialize/transaction/txData/txDataYellowCard';

export class YellowCardTransaction extends BaseTransaction {

  protected _system_tx = true;
  protected _type = TransactionType.YellowCard;
  protected _txData: ITxDataYellowCardData = {} as any;

  async send(): Promise<TransactionHash> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}