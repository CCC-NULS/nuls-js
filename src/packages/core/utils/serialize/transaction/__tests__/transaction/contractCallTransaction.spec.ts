import { contractCallTxSerializedExample, contractCallTxReadExample } from '../../__mocks__/examples/contractCallTx';
import { ITransactionData, TransactionSerializer } from '../../transaction';
import { TransactionType } from '../../../../../common';
import { checkAssertsCoins } from '../../__mocks__/common';
import { ITxDataContractCallData } from '../../txData/txDataContractCall';

describe('TransactionSerializer integration tests', () => {

  describe('ContractCall Transaction', () => {

    const rewardTxBytes = Buffer.from(contractCallTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(rewardTxBytes, 0).data;

      expect(tx.type).toEqual(contractCallTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.ContractCall);
      expect(tx.time).toEqual(contractCallTxReadExample.time);
      expect(tx.remark).toEqual(contractCallTxReadExample.remark);
      expect(tx.scriptSign).toEqual(contractCallTxReadExample.scriptSign);
      expect(tx.txData as ITxDataContractCallData).toEqual(contractCallTxReadExample.txData);

      expect(tx.coinData.inputs).toHaveLength(contractCallTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs).toHaveLength(contractCallTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, contractCallTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, contractCallTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      const buf = Buffer.alloc(10000);
      const offset = TransactionSerializer.write(contractCallTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(contractCallTxSerializedExample);

    });

  });

});
