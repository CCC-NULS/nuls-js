import { TransactionType } from '../../common';
import { TransactionSerializer, ITransactionData } from '../../utils/serialize/transaction/transaction';
import { TransferTransaction } from './transferTransaction';
import { CoinData } from '../coin/coinData';
import { NulsDigestData, IDigestData } from '../nulsDigestData';
import { NulsDigestDataSerializer } from '../../utils/serialize/nulsDigestData';
import { createTransactionSignature } from '../../utils/signature';

export abstract class Transaction {

  protected _type!: TransactionType;
  protected _time: number = new Date().getTime();
  protected _remark!: Buffer;
  protected _txData!: any;
  protected _coinData: CoinData = new CoinData();
  protected _signature!: Buffer;

  static fromBytes(bytes: string) {

    const bf = Buffer.from(bytes, 'base64');
    const transactionRawData: ITransactionData = TransactionSerializer.read(bf, 0).data;
    Transaction.fromRawData(transactionRawData);

  }

  static fromRawData(rawData: ITransactionData) {

    let tx: Transaction;

    switch (rawData.type) {

      case TransactionType.Transfer:
      default:
        tx = TransferTransaction.fromRawData(rawData);

    }

    tx.remark(rawData.remark);
    tx.time(rawData.time);
    tx.coinData(CoinData.fromRawData(rawData.coinData));

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

  // getFee() {
  //   const maxSize = this.get_max_size();
  //   let unitFee = UNIT_FEE;
  //   if ((this.type === 2) || (this.type === 101)) {
  //     unitFee = CHEAP_UNIT_FEE;
  //   }

  //   let fee = unitFee * Math.floor(maxSize / KB); // per kb

  //   if (maxSize % KB > 0) {
  //     // why is it needed, to be sure we have at least the fee ?
  //     // or am I doing a bad port from java, where they work with int and not mutable ?
  //     fee += unitFee;
  //   }

  //   return fee;
  // }

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

    const transactionData: ITransactionData = {
      type: this._type,
      time: this._time,
      remark: this._remark,
      txData: this._txData,
      coinData: CoinData.toRawData(this._coinData),
      scriptSign: this._signature
    };

    const transactionHashSize: number = TransactionSerializer.sizeHash(transactionData);
    const transactionHash: Buffer = Buffer.allocUnsafe(transactionHashSize);
    TransactionSerializer.writeHash(transactionData, transactionHash);

    return NulsDigestData.digest(transactionHash);

  }

}