import { CoinOutput, CoinInput } from './coinData/coin';
import { CONSENSUS_LOCK_TIME } from '../../common';
// import { TransactionApi } from '../../api/transaction';
import { Hash, isValidHash } from '../../utils/crypto';
import { Address, isValidAddress } from '../../utils/crypto';
import { TransactionType } from '../../common';
import { BaseTransaction } from './baseTransaction';
import { ITxDataWithdrawData } from '../../utils/serialize/transaction/txData/txDataWithdraw';
import { MAX_FEE_PRICE_1024_BYTES, nulsToNa } from '../../utils';

// https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/consensus-module/poc/consensus-poc-protocol/src/main/java/io/nuls/consensus/poc/protocol/tx/CancelDepositTransaction.java#L41
// https://github.com/nuls-io/nuls/blob/df9a9db1855be2fe57db81947a50f4eab57471d2/consensus-module/poc/consensus-poc-rpc/src/main/java/io/nuls/consensus/poc/rpc/resource/PocConsensusResource.java#L1059
export class WithdrawTransaction extends BaseTransaction {

  private static CONSENSUS_LOCK_TIME = CONSENSUS_LOCK_TIME;

  protected _fee_price = MAX_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.Withdraw;
  protected _txData: ITxDataWithdrawData = {} as any;
  protected _address!: Address;
  protected _amount!: number;

  private _consensusInput: CoinInput | undefined;
  private _consensusOutput: CoinOutput | undefined;

  address(address: Address): this {

    this._address = address;

    this.updateConsensusOutput();
    return this;

  }

  depositHash(hash: Hash): this {

    this._txData.depositHash = hash;

    this.updateConsensusInput();
    return this;

  }

  amount(amount: number): this {

    this._amount = amount;

    this.updateConsensusInput();
    this.updateConsensusOutput();
    return this;

  }

  protected validate(): boolean {

    if (this._config.safeCheck) {

      if (!isValidHash(this._txData.depositHash)) {
        throw new Error('Invalid depositHash');
      }

      if (!isValidAddress(this._address)) {
        throw new Error('Invalid address');
      }

      if (!this._amount || this._amount < nulsToNa(2000)) {
        throw new Error('Invalid amount, should be equal or greater than 2000 nuls');
      }

    }

    return super.validate();

  }

  protected updateInputsAndOutputs(): void {
    // Override doing nothing! just to dont calculate a change output for this tx kind
  }

  private updateConsensusOutput() {

    if (this._address === undefined || this._amount === undefined) {
      return;
    }

    this._coinData.removeOutput(this._consensusOutput);

    this._consensusOutput = new CoinOutput(this._address, this._amount, 0);
    this._coinData.addOutput(this._consensusOutput);

    // Calculate the fee after setting the output
    const amount: number = this._amount - this.calculateFee();
    this._consensusOutput.na = amount;

  }

  // Assuming the consensus input with lockTime = -1 is in the index 0 
  private updateConsensusInput(depositOutputIdx: number = 0) {

    if (this._txData.depositHash === undefined || this._amount === undefined) {
      return;
    }

    this._coinData.removeInput(this._consensusInput);

    this._consensusInput = new CoinInput(this._txData.depositHash, depositOutputIdx, this._amount, WithdrawTransaction.CONSENSUS_LOCK_TIME);
    this._coinData.addInput(this._consensusInput);

  }

  // TODO: Work in an async interface including this
  // private async getWithdrawInput(config?: TransactionConfig): Promise<void> {

  //   if (this._txData.depositHash === undefined || this._amount === undefined) {
  //     return;
  //   }

  //   this.config(config);

  //   const api = new TransactionApi(this._config.api);
  //   const tx = await api.transaction(this._txData.depositHash);

  //   if (tx.outputs && tx.outputs.length > 0) {

  //     const depositOutputIdx = tx.outputs.findIndex((output) => output.lockTime === WithdrawTransaction.CONSENSUS_LOCK_TIME && output.value === this._amount);

  //     if (depositOutputIdx > -1) {

  //       this.updateConsensusInput(depositOutputIdx);

  //     }

  //   }

  // }

}