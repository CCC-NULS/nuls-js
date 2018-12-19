import { UTXO } from './../utxo';
import { TransactionType } from '../../common';
import { TransactionSerializer, ITransactionData } from '../../utils/serialize/transaction/transaction';
import { CoinData } from '../coin/coinData';
import { NulsDigestData, IDigestData } from '../nulsDigestData';
import { NulsDigestDataSerializer } from '../../utils/serialize/nulsDigestData';
import { createTransactionSignature } from '../../utils/signature';
import { MIN_FEE_PRICE_1024_BYTES, getFee } from '../../utils/fee';
import { IAPIConfig, CoinInput, CoinOutput } from '../..';
import { UtxoApi } from '../../api/utxo';
import { getPrivateKeyBuffer } from '../../utils/crypto';

export abstract class BaseTransaction {

  protected static TX_FEE_PRICE = MIN_FEE_PRICE_1024_BYTES;
  protected _type!: TransactionType;
  protected _time: number = new Date().getTime();
  protected _remark: Buffer = Buffer.from([]);
  protected _txData!: any;
  protected _coinData: CoinData = new CoinData();
  protected _signature!: Buffer | undefined;

  private _utxos: CoinInput[] = [];
  private _changeAddress!: string;
  private _changeOutputIndex: number | undefined;

  static fromBytes(bytes: Buffer): BaseTransaction {
    throw new Error('Not implemented');
  }

  protected static _fromBytes<T extends BaseTransaction>(bytes: Buffer, tx: T): T {
    
    const rawData: ITransactionData = TransactionSerializer.read(bytes, 0).data;
    return this._fromRawData(rawData, tx);

  }

  static toBytes(tx: BaseTransaction): Buffer {

    const rawData: ITransactionData = this.toRawData(tx);
    const bytesLength: number = TransactionSerializer.size(rawData);
    const bytes = Buffer.allocUnsafe(bytesLength);
    TransactionSerializer.write(rawData, bytes, 0);

    return bytes;

  }

  static fromRawData(rawData: ITransactionData): BaseTransaction {
    throw new Error('Not implemented');
  }

  protected static _fromRawData<T extends BaseTransaction>(rawData: ITransactionData, tx: T): T {

    if (rawData.type !== tx._type) {
      throw new Error(`Error reading Transaction from rawData (Incompatible types: ${rawData.type} !== ${tx._type})`);
    }

    tx._type = rawData.type;
    tx._remark = rawData.remark;
    tx._time = rawData.time;
    tx._coinData = CoinData.fromRawData(rawData.coinData);
    tx._signature = rawData.scriptSign;

    return tx;

  }

  protected static toRawData(tx: BaseTransaction): ITransactionData {

    return {
      type: tx._type,
      time: tx._time,
      remark: tx._remark,
      txData: tx._txData,
      coinData: CoinData.toRawData(tx._coinData),
      scriptSign: tx._signature
    };

  }

  static fromUtxos(utxos: UTXO[]): BaseTransaction {
    throw new Error('Not implemented');
  };

  protected static _fromUtxos<T extends BaseTransaction>(utxos: UTXO[], tx: T): T {

    utxos.forEach((utxo: UTXO) => {

      const input: CoinInput = new CoinInput(utxo.hash, utxo.idx, utxo.value, utxo.lockTime);

      tx._utxos.push(input);
      tx._coinData.inputs.push(input);

    });

    return tx;

  }

  static async fromAddress(address: string, config: IAPIConfig): Promise<BaseTransaction> {
    throw new Error('Not implemented');
  };

  protected static async _fromAddress<T extends BaseTransaction>(address: string, config: IAPIConfig, tx: T): Promise<T> {

    tx._changeAddress = address;

    const api = new UtxoApi(config);
    const utxos = await api.getUtxos(address);

    return BaseTransaction._fromUtxos(utxos, tx);

  }

  time(time: number): this {

    this._time = time;
    return this;

  }

  remark(remark: string | Buffer): this {

    this._remark = typeof remark === 'string'
      ? Buffer.from(remark, 'utf8')
      : remark;
    
    this.calculateInputsAndChangeOutput();
    return this;

  }

  change(address: string): this {

    this._changeAddress = address;

    this.calculateInputsAndChangeOutput();
    return this;

  }

  getFee(): number {

    return this._coinData.getFee();

  }

  // TODO: Implement all kinds of signatures (P2PKH, P2PS, etc...)
  sign(privateKey: string): this {

    const privateKeyBuffer: Buffer = getPrivateKeyBuffer(privateKey);
    this._signature = createTransactionSignature(this, privateKeyBuffer);
    return this;

  }

  serialize(): string {
    
    return BaseTransaction.toBytes(this).toString('hex');

  }

  protected getHash(): string {

    const digestData: IDigestData = this.getDigest();
    const digestSize: number = NulsDigestDataSerializer.size(digestData);
    const hash: Buffer = Buffer.allocUnsafe(digestSize);

    NulsDigestDataSerializer.write(digestData, hash, 0);

    return hash.toString('hex');

  }

  // https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/model/Transaction.java#L213
  getDigest(): IDigestData {

    const transactionData: ITransactionData = BaseTransaction.toRawData(this);

    const transactionHashSize: number = TransactionSerializer.sizeHash(transactionData);
    const transactionHash: Buffer = Buffer.allocUnsafe(transactionHashSize);
    TransactionSerializer.writeHash(transactionData, transactionHash);

    return NulsDigestData.digest(transactionHash);

  }

  protected addOutput(address: string, amount: number): this {

    const output: CoinOutput = new CoinOutput(address, amount);
    this._coinData.outputs.push(output);

    this.calculateInputsAndChangeOutput();
    return this;

  }

  protected coinData(coinData: CoinData): this {

    this._coinData = coinData;
    return this;

  }

  protected calculateFee(feePrice: number = BaseTransaction.TX_FEE_PRICE): number {

    const transactionSize: number = this.size();
    return getFee(transactionSize, feePrice);

  }

  protected size(): number {

    const transactionData: ITransactionData = BaseTransaction.toRawData(this);
    return TransactionSerializer.size(transactionData);

  }

  protected removeChangeOutput() {
    if (this._changeOutputIndex !== undefined) {
      this._coinData.outputs.splice(this._changeOutputIndex, 1);
      this._changeOutputIndex = undefined;
    }
  }

  protected clearSignatures() {
    this._signature = undefined;
  }

  protected resetInputs() {
    this._coinData.inputs = [...this._utxos];
  }

  // https://github.com/nuls-io/nuls/blob/6e22e5ba554fae9e690faaa3797cdddb49f90c44/account-ledger-module/account-ledger/src/main/java/io/nuls/account/ledger/util/CoinDataTool.java#L44
  // https://github.com/nuls-io/nuls/blob/041ddb94a856d41b5456e28a5a885bbce994cd03/account-ledger-module/base/account-ledger-base/src/main/java/io/nuls/account/ledger/base/service/impl/AccountLedgerServiceImpl.java#L782
  // TODO: Improve this method... 
  protected calculateInputsAndChangeOutput(): void {

    this.removeChangeOutput();
    this.clearSignatures();

    const utxos: CoinInput[] = this._utxos;
    this._coinData.inputs = [];

    const amount: number = this._coinData.outputs.reduce((prev: number, curr: CoinOutput) => prev + curr.na, 0);

    let totalAvailable = 0;
    let totalToSpent = 0;

    for (let input of utxos) {

      this._coinData.inputs.push(input);
      totalAvailable += input.na;

      // TODO: Not the more efficient way to calculate fees, but the easiest one. Optimize it getting the size from the Coin!
      let fee: number = this.calculateFee();
      totalToSpent = amount + fee;

      // In this case we should calculate a change output coin to send the remaining amount
      if (totalAvailable > totalToSpent) {

        const changeNa = totalAvailable - totalToSpent;

        // if the change coin was already added in the previous iteration, we just update the na
        if (this._changeOutputIndex !== undefined) {

          const changeOutput: CoinOutput = this._coinData.outputs[this._changeOutputIndex];
          changeOutput.na = changeNa;

        } else {

          // Prevent from burning nuls
          if (!this._changeAddress) {
            this.resetInputs();
            return;
            // throw new Error('Change address must be specified');
          }

          const changeCoin = new CoinOutput(this._changeAddress, changeNa);
          this._coinData.outputs.unshift(changeCoin);
          this._changeOutputIndex = 0;
          const changeOutput: CoinOutput = this._coinData.outputs[this._changeOutputIndex];

          // Recalculating fees with the new size after adding the change output
          const oldTotalToSpent = totalToSpent;
          fee = this.calculateFee();
          totalToSpent = amount + fee;

          // if after adding the change output, the inputs are not enough to pay the new fees,
          // add one more input and do the calculation again
          if (totalAvailable < totalToSpent) {
            continue;
          }

          changeOutput.na = totalAvailable - totalToSpent;

          // if after adding the change output, the change amount is equal to the new fees, better to do not add the output
          if (changeOutput.na === 0) {
            this._coinData.outputs.shift();
            totalToSpent = oldTotalToSpent;
          }

        }

      }

      // If we have enough inputs to pay the transaction, break the loop  
      if (totalAvailable >= totalToSpent) {
        return;
      }

    }

    if (totalAvailable < totalToSpent) {

      this.resetInputs();

    }

  }

}