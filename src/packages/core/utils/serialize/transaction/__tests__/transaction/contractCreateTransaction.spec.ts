import { contractCreateTxSerializedExample, contractCreateTxReadExample } from '../../__mocks__/examples/contractCreateTx';
import { ITransactionData, TransactionSerializer } from '../../transaction';
import { TransactionType } from '../../../../../common';
import { checkAssertsCoins } from '../../__mocks__/common';
import { ITxDataContractCreateData } from '../../txData/txDataContractCreate';

describe('TransactionSerializer integration tests', () => {

  describe('ContractCreate Transaction', () => {

    const rewardTxBytes = Buffer.from(contractCreateTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(rewardTxBytes, 0).data;

      expect(tx.type).toEqual(contractCreateTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.ContractCreate);
      expect(tx.time).toEqual(contractCreateTxReadExample.time);
      expect(tx.remark).toEqual(contractCreateTxReadExample.remark);
      expect(tx.scriptSign).toEqual(contractCreateTxReadExample.scriptSign);
      expect(tx.txData as ITxDataContractCreateData).toEqual(contractCreateTxReadExample.txData);

      expect(tx.coinData.inputs).toHaveLength(contractCreateTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs).toHaveLength(contractCreateTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, contractCreateTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, contractCreateTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      const buf = Buffer.alloc(10000);
      const offset = TransactionSerializer.write(contractCreateTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(contractCreateTxSerializedExample);

    });

  });

});
