import { rewardTxSerializedExample, rewardTxReadExample } from '../../__mocks__/examples/rewardTx';
import { ITransactionData, TransactionSerializer } from '../../transaction';
import { TransactionType } from '../../../../../common';
import { ITxDataRewardData, TxDataRewardSerializer } from '../../txData/txDataReward';
import { checkAssertsCoins } from '../../__mocks__/common';

describe('TransactionSerializer integration tests', () => {

  describe('Reward Transaction', () => {

    const rewardTxBytes = Buffer.from(rewardTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(rewardTxBytes, 0).data;

      expect(tx.type).toEqual(rewardTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.Reward);
      expect(tx.time).toEqual(rewardTxReadExample.time);
      expect(tx.remark).toEqual(rewardTxReadExample.remark);
      expect(tx.scriptSign).toEqual(rewardTxReadExample.scriptSign);
      expect(tx.txData as ITxDataRewardData).toEqual(TxDataRewardSerializer.PLACE_HOLDER);

      expect(tx.coinData.inputs.length).toBe(rewardTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs.length).toBe(rewardTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, rewardTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, rewardTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      let buf = Buffer.alloc(10000);
      const offset = TransactionSerializer.write(rewardTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(rewardTxSerializedExample);

    });

  });

});
