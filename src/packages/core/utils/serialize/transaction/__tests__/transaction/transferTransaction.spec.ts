import { ITransactionData, TransactionSerializer } from '../../transaction';
import { transferTxSerializedExample, transferTxReadExample } from '../../__mocks__/examples/transferTx';
import { TransactionType } from '../../../../../common';
import { ITxDataTransferData } from '../../txData/txDataTransfer';
import { checkAssertsCoins } from '../../__mocks__/common';

describe('TransactionSerializer integration tests', () => {

  describe('Transfer Transaction', () => {

    const aliasTxBytes = Buffer.from(transferTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(aliasTxBytes, 0).data;

      expect(tx.type).toEqual(transferTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.Transfer);
      expect(tx.time).toEqual(transferTxReadExample.time);
      expect(tx.remark).toEqual(transferTxReadExample.remark);
      expect(tx.scriptSign).toEqual(transferTxReadExample.scriptSign);
      expect((tx.txData as ITxDataTransferData)).toEqual(transferTxReadExample.txData);

      expect(tx.coinData.inputs).toHaveLength(transferTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs).toHaveLength(transferTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, transferTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, transferTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      const buf = Buffer.alloc(100000);
      const offset = TransactionSerializer.write(transferTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(transferTxSerializedExample);

    });

  });

});