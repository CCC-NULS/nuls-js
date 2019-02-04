import { BaseTransaction, TransactionHash } from '../../../core/protocol/transaction/baseTransaction';
import { TransactionType } from '../../../core/common';
import { ITxDataContractCreateData } from '../../../core/utils/serialize/transaction/txData/txDataContractCreate';
import { MIN_FEE_PRICE_1024_BYTES } from '../../../core/utils/fee';

// TODO: Implement this transaction
export class ContractCreateTransaction extends BaseTransaction {

  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.ContractCreate;
  protected _txData: ITxDataContractCreateData = {} as any;

  async send(): Promise<TransactionHash> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}