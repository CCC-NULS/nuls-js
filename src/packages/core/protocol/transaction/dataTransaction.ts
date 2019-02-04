import { TransactionType } from '../../common';
import { ITxDataTransferData } from '../../utils/serialize/transaction/txData/txDataTransfer';
import { TransactionObject } from '..';
import { BaseTransaction } from './baseTransaction';
import { MIN_FEE_PRICE_1024_BYTES } from '../../utils';

export interface DataTransactionObject extends TransactionObject {
  txData: string;
}

export class DataTransaction extends BaseTransaction {

  protected static className = DataTransaction;

  protected _type = TransactionType.Data;
  protected _txData!: ITxDataTransferData;
  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;

  toObject(): TransactionObject {

    const obj: TransactionObject = super.toObject();
    obj.txData = (obj.txData as Buffer).toString('hex');
    return obj;

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