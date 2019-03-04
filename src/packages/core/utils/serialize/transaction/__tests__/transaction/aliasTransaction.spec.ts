import { ITransactionData, TransactionSerializer } from '../../transaction';
import { aliasTxSerializedExample, aliasTxReadExample } from '../../__mocks__/examples/aliasTx';
import { TransactionType } from '../../../../../common';
import { ITxDataAliasData } from '../../txData/txDataAlias';
import { checkAssertsCoins } from '../../__mocks__/common';

describe('TransactionSerializer integration tests', () => {

  describe('Alias Transaction', () => {

    const aliasTxBytes = Buffer.from(aliasTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(aliasTxBytes, 0).data;

      expect(tx.type).toEqual(aliasTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.Alias);
      expect(tx.time).toEqual(aliasTxReadExample.time);
      expect(tx.remark).toEqual(aliasTxReadExample.remark);
      expect(tx.scriptSign).toEqual(aliasTxReadExample.scriptSign);
      expect((tx.txData as ITxDataAliasData)).toEqual(aliasTxReadExample.txData);

      expect(tx.coinData.inputs.length).toBe(aliasTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs.length).toBe(aliasTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, aliasTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, aliasTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      let buf = Buffer.alloc(10000);
      const offset = TransactionSerializer.write(aliasTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(aliasTxSerializedExample);

    });

  });

});