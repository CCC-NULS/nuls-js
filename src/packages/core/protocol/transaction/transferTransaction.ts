import { PLACE_HOLDER } from './../../utils/serialize/common';
import { TransactionType } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { ITxDataTransferData } from '../../utils/serialize/transaction/txData/txDataTransfer';
import { MIN_FEE_PRICE_1024_BYTES } from '../../utils/fee';
import { UTXO } from '..';
import { BaseTransaction } from './baseTransaction';
import { IAPIConfig } from '../..';

// https://github.com/nuls-io/nuls/blob/041ddb94a856d41b5456e28a5a885bbce994cd03/account-ledger-module/base/account-ledger-base/src/main/java/io/nuls/account/ledger/base/service/impl/AccountLedgerServiceImpl.java#L457
// https://github.com/nuls-io/nuls/blob/041ddb94a856d41b5456e28a5a885bbce994cd03/account-ledger-module/base/account-ledger-base/src/main/java/io/nuls/account/ledger/base/service/impl/AccountLedgerServiceImpl.java#L741
export class TransferTransaction extends BaseTransaction {

  protected _type = TransactionType.Transfer;
  protected _txData: ITxDataTransferData = {
    placeholder: PLACE_HOLDER
  };

  static fromRawData(rawData: ITransactionData): TransferTransaction {

    let tx = new TransferTransaction();
    return this._fromRawData(rawData, tx);

  }

  static async fromAddress(address: string, config: IAPIConfig): Promise<TransferTransaction> {
    
    let tx = new TransferTransaction();
    return this._fromAddress<TransferTransaction>(address, config, tx);

  };

  static fromUtxos(utxos: UTXO[]): TransferTransaction {
    
    let tx = new TransferTransaction();
    return this._fromUtxos<TransferTransaction>(utxos, tx);

  };

  to(address: string, value: number = MIN_FEE_PRICE_1024_BYTES) {

    this._coinData.addOutput(address, value);

  }

  calculateFee(): number {

    return super.calculateFee(MIN_FEE_PRICE_1024_BYTES);

  }

}