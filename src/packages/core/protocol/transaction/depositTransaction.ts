import { Hash, isValidHash } from './../../utils/crypto';
import { Address, isValidAddress } from '../../utils/crypto';
import { TransactionType, CONSENSUS_LOCK_TIME } from '../../common';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { BaseTransaction, TransactionConfig } from './baseTransaction';
import { ITxDataDepositData } from '../../utils/serialize/transaction/txData/txDataDeposit';
import { UTXO } from '../utxo';
import { MAX_FEE_PRICE_1024_BYTES, nulsToNa } from '../../utils';

// https://github.com/nuls-official/nuls/blob/4c60055c9fae38c66c62b432e0b634117e2876fe/consensus-module/poc/consensus-poc-protocol/src/main/java/io/nuls/consensus/poc/protocol/tx/DepositTransaction.java#L38
// https://github.com/nuls-official/nuls/blob/4c60055c9fae38c66c62b432e0b634117e2876fe/consensus-module/poc/consensus-poc-rpc/src/main/java/io/nuls/consensus/poc/rpc/resource/PocConsensusResource.java#L505
export class DepositTransaction extends BaseTransaction {

  private static CONSENSUS_LOCK_TIME = CONSENSUS_LOCK_TIME;

  protected _fee_price = MAX_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.Deposit;
  protected _txData: ITxDataDepositData = {} as any;

  private _consensusOutputIndex: number | undefined;

  static fromBytes(bytes: Buffer) {

    let tx = new DepositTransaction();
    return this._fromBytes(bytes, tx);

  }

  static fromRawData(rawData: ITransactionData): DepositTransaction {

    let tx = new DepositTransaction();
    return this._fromRawData(rawData, tx);

  }

  static async fromAddress(address: string, config?: TransactionConfig): Promise<DepositTransaction> {

    let tx = new DepositTransaction();
    return this._fromAddress<DepositTransaction>(address, tx, config);

  };

  static fromUtxos(utxos: UTXO[]): DepositTransaction {

    let tx = new DepositTransaction();
    return this._fromUtxos<DepositTransaction>(utxos, tx);

  };

  address(address: Address): this {

    this._txData.address = address;

    if (!this._changeAddress) {
      this.change(address);
    }

    this.updateConsensusOutput();
    this.updateInputsAndOutputs();
    return this;
    
  }

  agentHash(hash: Hash): this {

    this._txData.agentHash = hash;

    this.updateInputsAndOutputs();
    return this;
    
  }

  deposit(amount: number): this {

    this._txData.deposit = amount;

    this.updateConsensusOutput();
    this.updateInputsAndOutputs();
    return this;
    
  }

  protected validate(): boolean {

    if (this._config.safeCheck) {

      if (!isValidHash(this._txData.agentHash)) {
        throw new Error('Invalid agentHash');
      }

      if (!isValidAddress(this._txData.address)) {
        throw new Error('Invalid address');
      }

      if (!this._txData.deposit || this._txData.deposit < nulsToNa(2000)) {
        throw new Error('Invalid deposit, should be equal or greater than 2000 nuls');
      }

    }

    return super.validate();

  }

  private updateConsensusOutput() {

    if (this._txData.address === undefined || this._txData.deposit === undefined) {
      return;
    }

    this._coinData.removeOutput(this._consensusOutputIndex);
    this._consensusOutputIndex = this._coinData.addOutput(this._txData.address, this._txData.deposit, DepositTransaction.CONSENSUS_LOCK_TIME);

  }

}