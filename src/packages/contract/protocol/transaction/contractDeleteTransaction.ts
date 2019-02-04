import { BaseTransaction, TransactionHash } from '../../../core/protocol/transaction/baseTransaction';
import { TransactionType } from '../../../core/common';
import { ITxDataContractDeleteData } from '../../../core/utils/serialize/transaction/txData/txDataContractDelete';
import { MIN_FEE_PRICE_1024_BYTES } from '../../../core/utils/fee';

// TODO: Implement this transaction
export class ContractDeleteTransaction extends BaseTransaction {

  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.ContractDelete;
  protected _txData: ITxDataContractDeleteData = {} as any;

  async send(): Promise<TransactionHash> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}