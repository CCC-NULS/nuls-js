import { PLACE_HOLDER } from './../../utils/serialize/common';
import { TransactionType } from '../../common';
import { ITxDataTransferData } from '../../utils/serialize/transaction/txData/txDataTransfer';
import { TransactionObject } from '..';
import { BaseTransaction } from './baseTransaction';
import { MIN_FEE_PRICE_1024_BYTES } from '../../utils';

export interface RewardTransactionObject extends TransactionObject {
  txData: null;
}

// https://github.com/nuls-io/nuls/blob/041ddb94a856d41b5456e28a5a885bbce994cd03/account-ledger-module/base/account-ledger-base/src/main/java/io/nuls/account/ledger/base/service/impl/AccountLedgerServiceImpl.java#L457
// https://github.com/nuls-io/nuls/blob/041ddb94a856d41b5456e28a5a885bbce994cd03/account-ledger-module/base/account-ledger-base/src/main/java/io/nuls/account/ledger/base/service/impl/AccountLedgerServiceImpl.java#L741
export class TransferTransaction extends BaseTransaction {

  protected static className = TransferTransaction;

  protected _type = TransactionType.Transfer;
  protected _txData: ITxDataTransferData = PLACE_HOLDER;
  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;

  toObject(): TransactionObject {

    const obj: TransactionObject = super.toObject();
    obj.txData = null;
    return obj;

  }

  to(address: string, amount: number): this {

    this.addOutput(address, amount);
    return this;

  }

}