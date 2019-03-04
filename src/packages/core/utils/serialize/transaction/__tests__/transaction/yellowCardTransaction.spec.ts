import { ITransactionData, TransactionSerializer } from '../../transaction';
import { yellowCardTxSerializedExample, yellowCardTxReadExample } from '../../__mocks__/examples/yellowCardTx';
import { TransactionType } from '../../../../../common';
import { ITxDataYellowCardData } from '../../txData/txDataYellowCard';

describe('TransactionSerializer integration tests', () => {

  describe('YellowCard Transaction', () => {

    const aliasTxBytes = Buffer.from(yellowCardTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(aliasTxBytes, 0).data;

      expect(tx.type).toEqual(yellowCardTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.YellowCard);
      expect(tx.time).toEqual(yellowCardTxReadExample.time);
      expect(tx.remark).toEqual(yellowCardTxReadExample.remark);
      expect(tx.scriptSign).toEqual(yellowCardTxReadExample.scriptSign);
      expect((tx.txData as ITxDataYellowCardData)).toEqual(yellowCardTxReadExample.txData);

      expect(tx.coinData).toBe(yellowCardTxReadExample.coinData);

    });

    it('should serialize an example of read transaction', () => {

      let buf = Buffer.alloc(100000);
      const offset = TransactionSerializer.write(yellowCardTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(yellowCardTxSerializedExample);

    });

  });

});