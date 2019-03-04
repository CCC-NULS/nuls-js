import { ITransactionData, TransactionSerializer } from '../../transaction';
import { registerTxSerializedExample, registerTxReadExample } from '../../__mocks__/examples/registerTx';
import { TransactionType } from '../../../../../common';
import { ITxDataRegisterData } from '../../txData/txDataRegister';
import { checkAssertsCoins } from '../../__mocks__/common';

describe('TransactionSerializer integration tests', () => {

  describe('Register Transaction', () => {

    const aliasTxBytes = Buffer.from(registerTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(aliasTxBytes, 0).data;

      expect(tx.type).toEqual(registerTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.Register);
      expect(tx.time).toEqual(registerTxReadExample.time);
      expect(tx.remark).toEqual(registerTxReadExample.remark);
      expect(tx.scriptSign).toEqual(registerTxReadExample.scriptSign);
      expect((tx.txData as ITxDataRegisterData)).toEqual(registerTxReadExample.txData);

      expect(tx.coinData.inputs).toHaveLength(registerTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs).toHaveLength(registerTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, registerTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, registerTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      const buf = Buffer.alloc(100000);
      const offset = TransactionSerializer.write(registerTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(registerTxSerializedExample);

    });

  });

});