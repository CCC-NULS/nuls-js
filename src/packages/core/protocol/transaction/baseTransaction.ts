import { UTXO } from './../utxo';
import { TransactionType } from '../../common';
import { TransactionSerializer, ITransactionData } from '../../utils/serialize/transaction/transaction';
import { CoinData } from '../coin/coinData';
import { NulsDigestData, IDigestData } from '../nulsDigestData';
import { NulsDigestDataSerializer } from '../../utils/serialize/nulsDigestData';
import { createTransactionSignature } from '../../utils/signature';
import { MIN_FEE_PRICE_1024_BYTES, getFee } from '../../utils/fee';

export abstract class BaseTransaction {

  protected _type!: TransactionType;
  protected _time: number = new Date().getTime();
  protected _remark!: Buffer;
  protected _txData!: any;
  protected _coinData: CoinData = new CoinData();
  protected _signature!: Buffer | undefined;

  protected constructor() {}

  static fromBytes(bytes: string) {
    throw new Error('Not implemented');
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

      tx._coinData.addInput(utxo.hash, utxo.idx, utxo.value, utxo.lockTime);

    });

    return tx;

  }

  time(time: number) {

    this._time = time;

  }

  remark(remark: string | Buffer) {

    remark = typeof remark === 'string'
      ? Buffer.from(remark, 'utf8')
      : remark;

  }

  coinData(coinData: CoinData) {

    this._coinData = coinData;

  }

  getFee(feePrice: number = MIN_FEE_PRICE_1024_BYTES): number {

    const transactionData: ITransactionData = BaseTransaction.toRawData(this);
    const transactionSize: number = TransactionSerializer.size(transactionData);

    return getFee(transactionSize, feePrice);

  }

  // TODO: Implement all kinds of signatures (P2PKH, P2PS, etc...)
  sign(privateKey: string) {

    const privateKeyBuffer: Buffer = Buffer.from(privateKey, 'hex');
    this._signature = createTransactionSignature(this, privateKeyBuffer);

  }

  getHash(): string {

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

}