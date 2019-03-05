import { ApiTransaction } from '../../api/transaction';
import { BlockApi, ApiBlock } from '../../api/block';
import { CoinDataObject } from '../coin/coinData';
import { UTXO, Utxo } from '../utxo';
import { TransactionType, BlockVersion } from '../../common';
import { TransactionSerializer, ITransactionData } from '../../utils/serialize/transaction/transaction';
import { CoinData } from '../coin/coinData';
import { NulsDigestData, IDigestData } from '../nulsDigestData';
import { NulsDigestDataSerializer } from '../../utils/serialize/nnulsDigestData';
import { createTransactionSignature } from '../../utils/signature';
import { MIN_FEE_PRICE_1024_BYTES, getFee } from '../../utils/fee';
import { getPrivateKeyBuffer } from '../../utils/crypto';
import { IAPIConfig, TransactionApi } from '../../api';
import { CoinInput, CoinOutput, CoinInputObject, CoinOutputObject } from '../coin';
import * as cfg from 'config';
import { PromiEvent } from 'web3-core-promievent';

export type TransactionStaticClass = typeof BaseTransaction;

export interface TransactionConstructor<T extends BaseTransaction> {
  new(config?: TransactionConfig, blockHeight?: number, blockVersion?: BlockVersion): T;
};

export type TransactionClass<T extends BaseTransaction> = TransactionConstructor<T> & TransactionStaticClass

export type TransactionHash = string;
export type TransactionReceipt = ApiTransaction;
export type TransactionHex = string;

export interface TransactionConfig {
  api?: IAPIConfig;
  safeCheck?: boolean;
  blocksMinedTimeout?: number;
}

export interface DefaultTransactionConfig extends TransactionConfig {
  safeCheck: boolean;
  blocksMinedTimeout: number;
}

export interface TransactionObject {
  hash: string;
  type: TransactionType;
  blockHeight: number;
  time: number;
  remark: string;
  txData: any;
  inputs: CoinInputObject[];
  outputs: CoinOutputObject[];
  signature: string;
}

export abstract class BaseTransaction {

  protected _type!: TransactionType;
  protected _time: number = new Date().getTime();
  protected _remark: Buffer = Buffer.from([]);
  protected _txData!: any;
  protected _coinData: CoinData = new CoinData();
  protected _signature: Buffer = Buffer.from([]);
  protected _blockHeight: number = -1;
  protected _blockVersion: number = BlockVersion.NotDefined;

  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;
  protected _system_tx: boolean = false;
  protected _changeAddress!: string;
  protected _extraFee: number = 0;
  protected _config: DefaultTransactionConfig = {
    safeCheck: true,
    blocksMinedTimeout: cfg.nuls.api.blocksMinedTimeout
  };

  private _utxos: CoinInput[] = [];
  private _changeOutput: CoinOutput | undefined;

  static fromBytes<T extends BaseTransaction>(this: TransactionClass<T>, bytes: Buffer, blockHeight?: number, blockVersion?: BlockVersion): T {

    let tx: T = new this(undefined, blockHeight, blockVersion);
    const rawData: ITransactionData = TransactionSerializer.read(bytes, 0).data;
    return this._fromRawData(rawData, tx);

  }

  static fromRawData<T extends BaseTransaction>(this: TransactionClass<T>, rawData: ITransactionData, blockHeight?: number, blockVersion?: BlockVersion): T {

    let tx: T = new this(undefined, blockHeight, blockVersion);
    return this._fromRawData(rawData, tx);

  }

  static _fromRawData<T extends BaseTransaction>(rawData: ITransactionData, tx: T): T {

    if (rawData.type !== tx._type) {
      throw new Error(`Error reading Transaction from rawData (Incompatible types: ${TransactionType[rawData.type]} !== ${TransactionType[tx._type]})`);
    }

    tx._type = rawData.type;
    tx._time = rawData.time;
    tx._remark = rawData.remark;
    tx._txData = rawData.txData;
    tx._coinData = CoinData.fromRawData(rawData.coinData);
    tx._signature = rawData.scriptSign;

    return tx;

  }

  static fromUtxos<T extends BaseTransaction>(this: TransactionClass<T>, utxos: UTXO[], blockHeight?: number, blockVersion?: BlockVersion): T {

    let tx: T = new this(undefined, blockHeight, blockVersion);

    utxos.forEach((utxo: UTXO) => {

      const input: CoinInput = new CoinInput(utxo.fromHash, utxo.fromIndex, utxo.value, utxo.lockTime);

      tx._utxos.push(input);
      tx._coinData.addInput(input);

    });

    return tx;

  };

  protected static async fromAddress<T extends BaseTransaction>(this: TransactionClass<T>, address: string, config: TransactionConfig): Promise<T> {

    const utxos = await Utxo.getUtxos(address, config ? config.api : undefined);
    const tx: T = this.fromUtxos(utxos);

    tx._changeAddress = address;

    tx.config(config);

    return tx;

  };

  constructor(config?: TransactionConfig, blockHeight: number = -1, blockVersion: BlockVersion = BlockVersion.SmartContracts) {
    this._blockHeight = blockHeight;
    this._blockVersion = blockVersion;
    this.config(config);
  }

  toBytes(): Buffer {

    const rawData: ITransactionData = this.toRawData();
    const bytesLength: number = TransactionSerializer.size(rawData);
    const bytes = Buffer.allocUnsafe(bytesLength);
    TransactionSerializer.write(rawData, bytes, 0);

    return bytes;

  }

  toRawData(): ITransactionData {

    return {
      type: this._type,
      time: this._time,
      remark: this._remark,
      txData: this._txData,
      coinData: CoinData.toRawData(this._coinData),
      scriptSign: this._signature
    };

  }

  toObject(): TransactionObject {

    const coinDataObj: CoinDataObject = this._coinData.toObject();

    return {
      hash: this.getHash(),
      type: this._type,
      blockHeight: this._blockHeight,
      time: this._time,
      remark: this._remark.toString('utf-8'),
      txData: this._txData, // TODO: Implement in each transaction kind
      inputs: coinDataObj.inputs,
      outputs: coinDataObj.outputs,
      signature: this._signature.toString('hex'),
    };

  }

  getType(): TransactionType {
    return this._type;
  }

  config(config?: TransactionConfig): this {

    if (config) {
      this._config = { ...this._config, ...config };
    }

    return this;

  }

  time(time: number): this {

    this._time = time;
    return this;

  }

  remark(remark: string | Buffer): this {

    this._remark = typeof remark === 'string'
      ? Buffer.from(remark, 'utf8')
      : remark;

    this.updateInputsAndOutputs();
    return this;

  }

  change(address: string): this {

    this._changeAddress = address;

    this.updateInputsAndOutputs();
    return this;

  }

  fee(amount: number): this {

    this._extraFee = amount;

    this.updateInputsAndOutputs();
    return this;

  }

  getFee(): number {

    return !this._system_tx
      ? this._coinData.getFee()
      : 0;

  }

  // TODO: Implement all kinds of signatures (P2PKH, P2PS, etc...)
  sign(privateKey: string): this {

    this.validate();

    const privateKeyBuffer: Buffer = getPrivateKeyBuffer(privateKey);
    this._signature = createTransactionSignature(this, privateKeyBuffer);
    return this;

  }

  serialize(): TransactionHex {

    this.validate();

    if (this._config.safeCheck) {

      if (this._coinData.getUnspent() < 0) {
        throw new Error('Not enough input balance to do the transaction');
      }

      if (this._coinData.getOutputs().length === 0) {
        throw new Error('There must be at least one output, something is missed');
      }

    }

    return this.toBytes().toString('hex');

  }

  send(config?: TransactionConfig, pe = new PromiEvent()): PromiEvent<TransactionReceipt> {

    if (this._signature.length === 0) {
      throw new Error('The transaction is not signed');
    }

    this.config(config);

    const txApi = new TransactionApi(this._config.api);
    const blockApi = new BlockApi(this._config.api);
    const txHex: TransactionHex = this.serialize();

    let firstHeight = -1;
    const subscription = blockApi.subscribe();

    txApi
      .broadcast(txHex)
      .then((txHash: TransactionHash) => {

        pe.emit('txHash', txHash);

        subscription
          .on('block', (block: ApiBlock) => {

            if (firstHeight === -1) {
              firstHeight = block.height;
            }

            block.transactions.forEach((tx) => {

              if (tx.hash === txHash) {

                subscription.close();
                pe.emit('txReceipt', tx);
                pe.resolve(tx);
                return;

              }

            });

            if (block.height - firstHeight >= this._config.blocksMinedTimeout) {

              subscription.close();
              const e = new Error(`The transaction was not included in the next ${this._config.blocksMinedTimeout} blocks`);
              pe.emit('error', e);
              pe.reject(e);
              return;

            }

          })
          .on('error', (e) => {

            e = new Error(`There was an error verifing the transaction status: ${e}`);
            subscription.close();
            pe.emit('error', e);
            pe.reject(e);

          });

      }).catch((e: Error) => {

        e = new Error(`There was an error sending the transaction to the network: ${e}`);
        subscription.close();
        pe.emit('error', e);
        pe.reject(e);

      });

    return pe;

  }

  // https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/model/Transaction.java#L213
  getDigest(): IDigestData {

    const transactionData: ITransactionData = this.toRawData();

    const transactionHashSize: number = TransactionSerializer.sizeHash(transactionData, this._blockVersion);
    let transactionHash: Buffer = Buffer.allocUnsafe(transactionHashSize);
    TransactionSerializer.writeHash(transactionData, transactionHash, 0, this._blockVersion);

    return NulsDigestData.digest(transactionHash);

  }

  getHash(): TransactionHash {

    const digestData: IDigestData = this.getDigest();
    const digestSize: number = NulsDigestDataSerializer.size(digestData);
    const hash: Buffer = Buffer.allocUnsafe(digestSize);

    NulsDigestDataSerializer.write(digestData, hash, 0);

    return hash.toString('hex');

  }

  protected validate(): boolean {

    if (this._config.safeCheck) {

      if (!this._txData) {
        throw new Error('Transaction data is not filled');
      }

      if (this._remark && this._remark.length > 600) {
        throw new Error('Remark can not be greater than 600 bytes');
      }

      if (!this._changeAddress && (
        this._type === TransactionType.Transfer || this._type === TransactionType.Alias ||
        this._type === TransactionType.Register || this._type === TransactionType.Deposit || this._type === TransactionType.Data ||
        this._type === TransactionType.ContractCreate || this._type === TransactionType.ContractCall ||
        this._type === TransactionType.ContractDelete || this._type === TransactionType.ContractTransfer)
      ) {

        throw new Error('Change address must be specified');

      }

    }

    return true;

  }

  protected addOutput(address: string, amount: number, lockTime?: number): number {

    const index: number = this._coinData.addOutput(address, amount, lockTime);

    this.updateInputsAndOutputs();
    return index;

  }

  protected coinData(coinData: CoinData): this {

    this._coinData = coinData;
    return this;

  }

  protected calculateFee(): number {

    const transactionSize: number = this.size();
    return getFee(transactionSize, this._fee_price);

  }

  protected size(): number {

    const transactionData: ITransactionData = this.toRawData();
    return TransactionSerializer.size(transactionData);

  }

  protected clearSignatures() {
    this._signature = Buffer.from([]);
  }

  protected resetInputs() {
    this._coinData.inputs([...this._utxos]);
  }

  // https://github.com/nuls-io/nuls/blob/6e22e5ba554fae9e690faaa3797cdddb49f90c44/account-ledger-module/account-ledger/src/main/java/io/nuls/account/ledger/util/CoinDataTool.java#L44
  // https://github.com/nuls-io/nuls/blob/041ddb94a856d41b5456e28a5a885bbce994cd03/account-ledger-module/base/account-ledger-base/src/main/java/io/nuls/account/ledger/base/service/impl/AccountLedgerServiceImpl.java#L782
  // TODO: Improve this method... 
  protected updateInputsAndOutputs(extraFee: number = 0): void {

    // Dont waste time calculating inputs and outputs when there are errors validating txData
    try {

      this.validate();

    } catch (e) {

      return;

    }

    this.removeChangeOutput();
    this.clearSignatures();

    const utxos: CoinInput[] = this._utxos;
    this._coinData.inputs([]);

    extraFee = extraFee + this._extraFee;
    
    const amount: number = this._coinData.getOutputs().reduce((prev: number, curr: CoinOutput) => prev + curr.na, 0) + extraFee;

    let totalAvailable = 0;
    let totalToSpent = 0;

    for (let input of utxos) {

      this._coinData.addInput(input);
      totalAvailable += input.na;

      // TODO: Not the more efficient way to calculate fee, but the easiest one. Optimize it getting the size from the Coin!
      let fee: number = this.calculateFee();
      totalToSpent = amount + fee;

      // In this case we should calculate a change output coin to send the remaining amount
      if (totalAvailable > totalToSpent) {

        const changeNa = totalAvailable - totalToSpent;

        // if the change coin was already added in the previous iteration, we just update the na
        if (this._changeOutput !== undefined) {

          this._changeOutput.na = changeNa;

        } else {

          // Some kind of transactions dont need change address, (prevent from burning nuls before send)
          if (!this._changeAddress) {
            return;
          }

          // Change output should be always at last position
          this._changeOutput = new CoinOutput(this._changeAddress, changeNa);
          this._coinData.addOutput(this._changeOutput);

          // Recalculating fee with the new size after adding the change output
          const oldTotalToSpent = totalToSpent;
          fee = this.calculateFee();
          totalToSpent = amount + fee;

          // if after adding the change output, the inputs are not enough to pay the new fee,
          // add one more input and do the calculation again
          if (totalAvailable < totalToSpent) {
            continue;
          }

          this._changeOutput.na = totalAvailable - totalToSpent;

          // if after adding the change output, the change amount is equal to the new fee, better to do not add the output
          if (this._changeOutput.na === 0) {
            this.removeChangeOutput();
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

  private removeChangeOutput() {
    this._coinData.removeOutput(this._changeOutput);
    this._changeOutput = undefined;
  }

}