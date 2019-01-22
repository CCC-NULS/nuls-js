import { ITransactionData, TransactionSerializer } from '../../transaction';
import { redCardTxSerializedExample, redCardTxReadExample } from '../../__mocks__/examples/redCardTx';
import { TransactionType } from '../../../../../common';
import { ITxDataRedCardData } from '../../txData/txDataRedCard';
import { checkAssertsCoins } from '../../__mocks__/common';

describe('TransactionSerializer integration tests', () => {

  describe('RedCard Transaction', () => {

    const aliasTxBytes = Buffer.from(redCardTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(aliasTxBytes, 0).data;

      expect(tx.type).toEqual(redCardTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.RedCard);
      expect(tx.time).toEqual(redCardTxReadExample.time);
      expect(tx.remark).toEqual(redCardTxReadExample.remark);
      expect(tx.scriptSign).toEqual(redCardTxReadExample.scriptSign);
      expect((tx.txData as ITxDataRedCardData)).toEqual(redCardTxReadExample.txData);

      expect(tx.coinData.inputs.length).toBe(redCardTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs.length).toBe(redCardTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, redCardTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, redCardTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      let buf = Buffer.alloc(100000);
      const offset = TransactionSerializer.write(redCardTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(redCardTxSerializedExample);

    });

  });

});