import { BLACK_HOLE_ADDRESS } from './../../common';
import { TransactionType } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { MAX_FEE_PRICE_1024_BYTES } from '../../utils/fee';
import { UTXO } from '..';
import { BaseTransaction, TransactionConfig, TransactionHex } from './baseTransaction';
import { ITxDataAliasData } from '../../utils/serialize/transaction/txData/txDataAlias';

// https://github.com/nuls-io/nuls/blob/6e22e5ba554fae9e690faaa3797cdddb49f90c44/account-module/base/account-base/src/main/java/io/nuls/account/service/AliasService.java#L110
export class AliasTransaction extends BaseTransaction {

  // Alias price
  // https://github.com/nuls-io/nuls/blob/6e22e5ba554fae9e690faaa3797cdddb49f90c44/account-module/base/account-base/src/main/java/io/nuls/account/service/AliasService.java#L154
  private static ALIAS_NA = 100000000;

  protected _fee_price = MAX_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.Alias;
  protected _txData!: ITxDataAliasData;

  static fromBytes(bytes: Buffer) {

    let tx = new AliasTransaction();
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData): AliasTransaction {

    let tx = new AliasTransaction();
    return this._fromRawData(rawData, tx);

  }

  static async fromAddress(address: string, config?: TransactionConfig): Promise<AliasTransaction> {

    let tx = new AliasTransaction();
    return this._fromAddress<AliasTransaction>(address, tx, config);

  };

  static fromUtxos(utxos: UTXO[]): AliasTransaction {

    let tx = new AliasTransaction();
    return this._fromUtxos<AliasTransaction>(utxos, tx);

  };

  constructor() {
    super();
    this.addOutput(BLACK_HOLE_ADDRESS, AliasTransaction.ALIAS_NA);
  }

  alias(address: string, alias: string): this {

    this._txData = {
      address,
      alias
    };

    if (!this._changeAddress) {
      this.change(address);
    }

    this.calculateInputsAndChangeOutput();
    return this;

  }

  serialize(): TransactionHex {

    if (this._config.safeCheck) {

      if (this._txData.address !== this._changeAddress) {
        throw new Error('The address which is going to be aliased must match with the changeAddress');
      }

    }

    return super.serialize();

  }

}