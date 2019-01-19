import { PLACE_HOLDER } from './../../utils/serialize/common';
import { TransactionType } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { ITxDataTransferData } from '../../utils/serialize/transaction/txData/txDataTransfer';
import { UTXO } from '..';
import { BaseTransaction, TransactionConfig } from './baseTransaction';
import { MIN_FEE_PRICE_1024_BYTES } from '../../utils';

// https://github.com/nuls-io/nuls/blob/041ddb94a856d41b5456e28a5a885bbce994cd03/account-ledger-module/base/account-ledger-base/src/main/java/io/nuls/account/ledger/base/service/impl/AccountLedgerServiceImpl.java#L457
// https://github.com/nuls-io/nuls/blob/041ddb94a856d41b5456e28a5a885bbce994cd03/account-ledger-module/base/account-ledger-base/src/main/java/io/nuls/account/ledger/base/service/impl/AccountLedgerServiceImpl.java#L741
export class TransferTransaction extends BaseTransaction {

  protected static className = TransferTransaction;

  protected _type = TransactionType.Transfer;
  protected _txData: ITxDataTransferData = {
    placeholder: PLACE_HOLDER
  };
  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;

  static fromBytes(bytes: Buffer): TransferTransaction {

    let tx = new this.className();
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData): TransferTransaction {

    let tx = new this.className();
    return this._fromRawData(rawData, tx);

  }

  static async fromAddress(address: string, config?: TransactionConfig): Promise<TransferTransaction> {
    
    let tx = new this.className();
    return this._fromAddress<TransferTransaction>(address, tx, config);

  };

  static fromUtxos(utxos: UTXO[]): TransferTransaction {
    
    let tx = new this.className();
    return this._fromUtxos<TransferTransaction>(utxos, tx);

  };

  to(address: string, amount: number): this {

    this.addOutput(address, amount);
    return this;

  }

}