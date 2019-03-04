import { ITransactionData, TransactionSerializer } from '../../transaction';
import { depositTxSerializedExample, depositTxReadExample } from '../../__mocks__/examples/depositTx';
import { TransactionType } from '../../../../../common';
import { ITxDataDepositData } from '../../txData/txDataDeposit';
import { checkAssertsCoins } from '../../__mocks__/common';

describe('TransactionSerializer integration tests', () => {

  describe('Deposit Transaction', () => {

    const aliasTxBytes = Buffer.from(depositTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(aliasTxBytes, 0).data;

      expect(tx.type).toEqual(depositTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.Deposit);
      expect(tx.time).toEqual(depositTxReadExample.time);
      expect(tx.remark).toEqual(depositTxReadExample.remark);
      expect(tx.scriptSign).toEqual(depositTxReadExample.scriptSign);
      expect((tx.txData as ITxDataDepositData)).toEqual(depositTxReadExample.txData);

      expect(tx.coinData.inputs).toHaveLength(depositTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs).toHaveLength(depositTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, depositTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, depositTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      const buf = Buffer.alloc(100000);
      const offset = TransactionSerializer.write(depositTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(depositTxSerializedExample);

    });

  });

});