import { ITransactionData, TransactionSerializer } from '../../transaction';
import { withdrawTxSerializedExample, withdrawTxReadExample } from '../../__mocks__/examples/withdrawTx';
import { TransactionType } from '../../../../../common';
import { ITxDataWithdrawData } from '../../txData/txDataWithdraw';
import { checkAssertsCoins } from '../../__mocks__/common';

describe('TransactionSerializer integration tests', () => {

  describe('Withdraw Transaction', () => {

    const aliasTxBytes = Buffer.from(withdrawTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(aliasTxBytes, 0).data;

      expect(tx.type).toEqual(withdrawTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.Withdraw);
      expect(tx.time).toEqual(withdrawTxReadExample.time);
      expect(tx.remark).toEqual(withdrawTxReadExample.remark);
      expect(tx.scriptSign).toEqual(withdrawTxReadExample.scriptSign);
      expect((tx.txData as ITxDataWithdrawData)).toEqual(withdrawTxReadExample.txData);

      expect(tx.coinData.inputs.length).toBe(withdrawTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs.length).toBe(withdrawTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, withdrawTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, withdrawTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      let buf = Buffer.alloc(100000);
      const offset = TransactionSerializer.write(withdrawTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(withdrawTxSerializedExample);

    });

  });

});