import { BlockHeader, BlockHex, BlockHash, BlockHeaderObject } from './blockHeader';
import { BlockSerializer, IBlockData } from '../../utils/serialize/block/block';
import { BaseTransaction, TransactionObject } from '../transaction';
import { Transaction } from '../transaction/transaction';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { TransactionType } from '../../common';

export interface BlockObject {
  hash: string;
  preHash: string;
  merkleHash: string;
  time: number;
  height: number;
  txCount: number;
  consensusMemberCount: number;
  currentVersion?: number;
  delay?: number;
  mainVersion?: number;
  packingIndexOfRound: number;
  percent?: number;
  roundIndex: number;
  roundStartTime: number;
  stateRoot?: string;
  signature: string;
  transactions: TransactionObject[];
}

export class Block {

  protected _header!: BlockHeader;
  protected _transactions!: BaseTransaction[];

  static fromBytes(bytes: string): Block;
  static fromBytes(bytes: Buffer): Block;
  static fromBytes(bytes: Buffer | string): Block {

    if (typeof bytes === 'string') {
      bytes = Buffer.from(bytes, 'base64');
    }

    const block = new Block();
    const rawData: IBlockData = BlockSerializer.read(bytes, 0).data;
    return this._fromRawData(rawData, block);

  }

  static toObject(block: Block): BlockObject {

    const blockHeader: BlockHeaderObject = block._header.toObject();

    return {
      ...blockHeader,
      transactions: block._transactions.map((tx: BaseTransaction) => tx.toObject()),
    };

  }

  static toBytes(block: Block): Buffer {

    const rawData: IBlockData = this.toRawData(block);
    const bytesLength: number = BlockSerializer.size(rawData);
    const bytes = Buffer.allocUnsafe(bytesLength);
    BlockSerializer.write(rawData, bytes, 0);

    return bytes;

  }

  static fromRawData(rawData: IBlockData): Block {

    const block = new Block();
    return this._fromRawData(rawData, block);

  }

  protected static _fromRawData<B extends Block>(rawData: IBlockData, block: B): B {

    block._header = BlockHeader.fromRawData(rawData.header);

    const transactions: BaseTransaction[] = [];

    for (let i = 0; i < rawData.header.txCount; i++) {

      const tx: BaseTransaction = Transaction.fromRawData(rawData.transactions[i], block._header.getHeight(), block._header.getMainVersion());
      transactions.push(tx);

    }

    block._transactions = transactions;

    const internalTxCount: number = transactions.reduce(
      (prev: number, curr: BaseTransaction) => prev + (curr.getType() === TransactionType.ContractTransfer ? 1 : 0), 0);

    block._header.setInternalTxCount(internalTxCount);

    return block;

  }

  protected static toRawData(block: Block): IBlockData {

    const rawTransactions: ITransactionData[] = [];

    for (let i = 0; i < block._header.getTxCount(); i++) {

      const rawTx: ITransactionData = Transaction.toRawData(block._transactions[i]);
      rawTransactions.push(rawTx);

    }

    return {
      header: BlockHeader.toRawData(block._header),
      transactions: rawTransactions
    };

  }

  getHash(): BlockHash {
    return this._header.getHash();
  }

  sign(privateKey: string): this {

    this._header.sign(privateKey);
    return this;

  }

  serialize(): BlockHex {

    return Block.toBytes(this).toString('hex');

  }

  toObject(): BlockObject {

    return Block.toObject(this);

  }

  protected size(): number {

    const transactionData: IBlockData = Block.toRawData(this);
    return BlockSerializer.size(transactionData);

  }

}