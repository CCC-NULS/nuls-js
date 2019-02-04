import { Address, isValidAddress } from './../../utils/crypto';
import { TransactionType, CONSENSUS_LOCK_TIME } from '../../common';
import { BaseTransaction } from './baseTransaction';
import { ITxDataRegisterData } from '../../utils/serialize/transaction/txData/txDataRegister';
import { MAX_FEE_PRICE_1024_BYTES, nulsToNa } from '../../utils';

// https://github.com/nuls-official/nuls/blob/4c60055c9fae38c66c62b432e0b634117e2876fe/consensus-module/poc/consensus-poc-protocol/src/main/java/io/nuls/consensus/poc/protocol/tx/CreateAgentTransaction.java#L38
// https://github.com/nuls-official/nuls/blob/4c60055c9fae38c66c62b432e0b634117e2876fe/consensus-module/poc/consensus-poc-rpc/src/main/java/io/nuls/consensus/poc/rpc/resource/PocConsensusResource.java#L447
export class RegisterTransaction extends BaseTransaction {

  private static CONSENSUS_LOCK_TIME = CONSENSUS_LOCK_TIME;

  protected _fee_price = MAX_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.Register;
  protected _txData: ITxDataRegisterData = {} as any;

  private _consensusOutputIndex: number | undefined;

  agentAddress(address: Address): this {

    this._txData.agentAddress = address;

    if (!this._txData.rewardAddress) {
      this._txData.rewardAddress = address;
    }

    if (!this._changeAddress) {
      this.change(address);
    }

    this.updateConsensusOutput();
    this.updateInputsAndOutputs();

    return this;

  }

  rewardAddress(address: Address): this {

    this._txData.rewardAddress = address;

    this.updateInputsAndOutputs();
    return this;

  }

  packingAddress(address: Address): this {

    this._txData.packingAddress = address;

    this.updateInputsAndOutputs();
    return this;

  }

  deposit(amount: number): this {

    this._txData.deposit = amount;

    this.updateConsensusOutput();
    this.updateInputsAndOutputs();
    return this;

  }

  commission(percentage: number): this {

    this._txData.commissionRate = percentage;

    this.updateInputsAndOutputs();
    return this;

  }

  protected validate(): boolean {

    if (this._config.safeCheck) {

      if (!isValidAddress(this._txData.agentAddress)) {
        throw new Error('Invalid agentAddress');
      }

      if (!isValidAddress(this._txData.packingAddress)) {
        throw new Error('Invalid packingAddress');
      }

      if (!isValidAddress(this._txData.rewardAddress)) {
        throw new Error('Invalid rewardAddress');
      }

      if (this._txData.agentAddress === this._txData.packingAddress) {
        throw new Error('agentAddress can not be the same as packingAddress');
      }

      if (!this._txData.commissionRate || (this._txData.commissionRate < 10 || this._txData.commissionRate > 100)) {
        throw new Error('Invalid commission rate, should be between [10, 100]');
      }

      if (!this._txData.deposit || this._txData.deposit < nulsToNa(20000)) {
        throw new Error('Invalid deposit, should be equal or greater than 20000 nuls');
      }

    }

    return super.validate();

  }

  private updateConsensusOutput() {

    if (this._txData.agentAddress === undefined || this._txData.deposit === undefined) {
      return;
    }

    this._coinData.removeOutput(this._consensusOutputIndex);
    this._consensusOutputIndex = this._coinData.addOutput(this._txData.agentAddress, this._txData.deposit, RegisterTransaction.CONSENSUS_LOCK_TIME);

  }

}