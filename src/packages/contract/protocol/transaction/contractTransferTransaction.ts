import { BaseTransaction, TransactionReceipt } from '../../../core/protocol/transaction/baseTransaction';
import { TransactionType } from '../../../core/common';
import { ITxDataContractTransferData } from '../../../core/utils/serialize/transaction/txData/txDataContractTransfer';
import { MIN_FEE_PRICE_1024_BYTES } from '../../../core/utils/fee';
import { PromiEvent } from 'web3-core-promievent';
 
export class ContractTransferTransaction extends BaseTransaction {

  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.ContractTransfer;
  protected _txData: ITxDataContractTransferData = {} as any;

  send(): PromiEvent<TransactionReceipt> {
    throw new Error('This kind of transaction can not be sent');
  }

}