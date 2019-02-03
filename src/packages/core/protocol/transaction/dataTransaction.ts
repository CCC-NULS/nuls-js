import { TransactionType, BlockVersion } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { ITxDataTransferData } from '../../utils/serialize/transaction/txData/txDataTransfer';
import { UTXO, TransactionObject } from '..';
import { BaseTransaction, TransactionConfig } from './baseTransaction';
import { MIN_FEE_PRICE_1024_BYTES } from '../../utils';

export interface DataTransactionObject extends TransactionObject {
  txData: string;
}

export class DataTransaction extends BaseTransaction {

  protected static className = DataTransaction;

  protected _type = TransactionType.Data;
  protected _txData!: ITxDataTransferData;
  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;

  static fromBytes(bytes: Buffer, blockHeight?: number, blockVersion?: BlockVersion): DataTransaction {

    let tx = new this.className(undefined, blockHeight, blockVersion);
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData, blockHeight?: number, blockVersion?: BlockVersion): DataTransaction {

    let tx = new this.className(undefined, blockHeight, blockVersion);
    return this._fromRawData(rawData, tx);

  }

  static async fromAddress(address: string, config?: TransactionConfig, blockHeight?: number, blockVersion?: BlockVersion): Promise<DataTransaction> {

    let tx = new this.className(undefined, blockHeight, blockVersion);
    return this._fromAddress<DataTransaction>(address, tx, config);

  };

  static fromUtxos(utxos: UTXO[], blockHeight?: number, blockVersion?: BlockVersion): DataTransaction {

    let tx = new this.className(undefined, blockHeight, blockVersion);
    return this._fromUtxos<DataTransaction>(utxos, tx);

  };

  static toObject(transaction: DataTransaction): DataTransactionObject {

    const obj: TransactionObject = BaseTransaction.toObject(transaction);
    obj.txData = (obj.txData as Buffer).toString('hex');
    return obj;

  }

  toObject(): TransactionObject {
    return DataTransaction.toObject(this);
  }

  data(json: object): this;
  data(hex: string): this;
  data(data: Buffer): this;
  data(data: any | string | Buffer): this {

    if (typeof data === 'object' && !Buffer.isBuffer(data)) {

      data = Buffer.from(JSON.stringify(data), 'utf-8');

    } else if (typeof data === 'string') {

      data = Buffer.from(data, 'hex');

    }

    this._txData = data;
    this.updateInputsAndOutputs();

    return this;

  }

  protected validate(): boolean {

    if (this._config.safeCheck) {

      if (!this._txData || !Buffer.isBuffer(this._txData) || this._txData.length === 0) {
        throw new Error('Invalid data, should be filled and length must be > 1 byte');
      }

    }

    return super.validate();

  }

}