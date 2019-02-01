import { BaseTransaction, TransactionHash } from '../../../core/protocol/transaction/baseTransaction';
import { TransactionType, BlockVersion } from '../../../core/common';
import { ITransactionData } from '../../../core/utils/serialize/transaction/transaction';
import { ITxDataContractTransferData } from '../../../core/utils/serialize/transaction/txData/txDataContractTransfer';
import { MIN_FEE_PRICE_1024_BYTES } from '../../../core/utils/fee';

export class ContractTransferTransaction extends BaseTransaction {

  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.ContractTransfer;
  protected _txData: ITxDataContractTransferData = {} as any;

  static fromBytes(bytes: Buffer, blockHeight?: number, blockVersion?: BlockVersion): ContractTransferTransaction {

    let tx = new ContractTransferTransaction(undefined, blockHeight, blockVersion);
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData, blockHeight?: number, blockVersion?: BlockVersion): ContractTransferTransaction {

    let tx = new ContractTransferTransaction(undefined, blockHeight, blockVersion);
    return this._fromRawData(rawData, tx);

  }

  async send(): Promise<TransactionHash> {
    throw new Error('This kind of transaction can not be sent');
  }

}