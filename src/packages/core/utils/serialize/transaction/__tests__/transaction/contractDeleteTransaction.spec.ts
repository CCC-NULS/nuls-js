import { contractDeleteTxSerializedExample, contractDeleteTxReadExample } from '../../__mocks__/examples/contractDeleteTx';
import { ITransactionData, TransactionSerializer } from '../../transaction';
import { TransactionType } from '../../../../../common';
import { checkAssertsCoins } from '../../__mocks__/common';
import { ITxDataContractDeleteData } from '../../txData/txDataContractDelete';

describe('TransactionSerializer integration tests', () => {

  describe('ContractDelete Transaction', () => {

    const rewardTxBytes = Buffer.from(contractDeleteTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(rewardTxBytes, 0).data;

      expect(tx.type).toEqual(contractDeleteTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.ContractDelete);
      expect(tx.time).toEqual(contractDeleteTxReadExample.time);
      expect(tx.remark).toEqual(contractDeleteTxReadExample.remark);
      expect(tx.scriptSign).toEqual(contractDeleteTxReadExample.scriptSign);

      const txData: ITxDataContractDeleteData = tx.txData as ITxDataContractDeleteData;
      expect(txData).toEqual((contractDeleteTxReadExample.txData as ITxDataContractDeleteData));

      expect(tx.coinData.inputs.length).toBe(contractDeleteTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs.length).toBe(contractDeleteTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, contractDeleteTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, contractDeleteTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      let buf = Buffer.alloc(10000);
      const offset = TransactionSerializer.write(contractDeleteTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(contractDeleteTxSerializedExample);

    });

  });

});
