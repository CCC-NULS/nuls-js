import { BaseTransaction, TransactionHash } from '../../../core/protocol/transaction/baseTransaction';
import { TransactionType, BlockVersion } from '../../../core/common';
import { ITransactionData } from '../../../core/utils/serialize/transaction/transaction';
import { ITxDataContractCreateData } from '../../../core/utils/serialize/transaction/txData/txDataContractCreate';
import { MIN_FEE_PRICE_1024_BYTES } from '../../../core/utils/fee';

// TODO: Implement this transaction
export class ContractCreateTransaction extends BaseTransaction {

  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.ContractCreate;
  protected _txData: ITxDataContractCreateData = {} as any;

  static fromBytes(bytes: Buffer, blockHeight?: number, blockVersion?: BlockVersion): ContractCreateTransaction {

    let tx = new ContractCreateTransaction(undefined, blockHeight, blockVersion);
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData, blockHeight?: number, blockVersion?: BlockVersion): ContractCreateTransaction {

    let tx = new ContractCreateTransaction(undefined, blockHeight, blockVersion);
    return this._fromRawData(rawData, tx);

  }

  async send(): Promise<TransactionHash> {
    throw new Error('Send is not implemented yet for this kind of transaction');
  }

}