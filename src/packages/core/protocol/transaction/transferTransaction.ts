import { PLACE_HOLDER } from './../../utils/serialize/common';
import { TransactionType, BlockVersion } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { ITxDataTransferData } from '../../utils/serialize/transaction/txData/txDataTransfer';
import { UTXO, TransactionObject } from '..';
import { BaseTransaction, TransactionConfig } from './baseTransaction';
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

  static fromBytes(bytes: Buffer, blockHeight?: number, blockVersion?: BlockVersion): TransferTransaction {

    let tx = new this.className(undefined, blockHeight, blockVersion);
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData, blockHeight?: number, blockVersion?: BlockVersion): TransferTransaction {

    let tx = new this.className(undefined, blockHeight, blockVersion);
    return this._fromRawData(rawData, tx);

  }

  static async fromAddress(address: string, config?: TransactionConfig, blockHeight?: number, blockVersion?: BlockVersion): Promise<TransferTransaction> {

    let tx = new this.className(undefined, blockHeight, blockVersion);
    return this._fromAddress<TransferTransaction>(address, tx, config);

  };

  static fromUtxos(utxos: UTXO[], blockHeight?: number, blockVersion?: BlockVersion): TransferTransaction {

    let tx = new this.className(undefined, blockHeight, blockVersion);
    return this._fromUtxos<TransferTransaction>(utxos, tx);

  };

  static toObject(transaction: TransferTransaction): RewardTransactionObject {

    const obj: TransactionObject = BaseTransaction.toObject(transaction);
    obj.txData = null;
    return obj;

  }

  toObject(): TransactionObject {
    return TransferTransaction.toObject(this);
  }

  to(address: string, amount: number): this {

    this.addOutput(address, amount);
    return this;

  }

}