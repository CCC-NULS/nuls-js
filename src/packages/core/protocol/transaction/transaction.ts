import { TransactionType } from '../../common';
import { TransactionSerializer, ITransactionData } from '../../utils/serialize/transaction/transaction';
import { TransferTransaction } from './transferTransaction';
import { CoinData } from '../coin/coinData';
import { NulsDigestData, IDigestData } from '../nulsDigestData';
import { NulsDigestDataSerializer } from '../../utils/serialize/nulsDigestData';

export abstract class Transaction {

  protected _type!: TransactionType;
  protected _time: number = new Date().getTime();
  protected _remark!: Buffer;
  protected _txData!: any;
  protected _coinData!: any;
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
      coinData: this._coinData,
      scriptSign: this._signature
    };

    const transactionHashSize: number = TransactionSerializer.sizeHash(transactionData);
    const transactionHash: Buffer = Buffer.allocUnsafe(transactionHashSize);
    TransactionSerializer.writeHash(transactionData, transactionHash);

    return NulsDigestData.digest(transactionHash);

  }

}