import { contractCallTxSerializedExample, contractCallTxReadExample } from '../../__mocks__';
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

      const txData: ITxDataContractCallData = tx.txData as ITxDataContractCallData;

      expect(txData.contractAddress).toEqual((contractCallTxReadExample.txData as ITxDataContractCallData).contractAddress);
      expect(txData.gasLimit).toEqual((contractCallTxReadExample.txData as ITxDataContractCallData).gasLimit);
      expect(txData.methodName).toEqual((contractCallTxReadExample.txData as ITxDataContractCallData).methodName);
      expect(txData.methodDesc).toEqual((contractCallTxReadExample.txData as ITxDataContractCallData).methodDesc);
      expect(txData.price).toEqual((contractCallTxReadExample.txData as ITxDataContractCallData).price);
      expect(txData.sender).toEqual((contractCallTxReadExample.txData as ITxDataContractCallData).sender);
      expect(txData.price).toEqual((contractCallTxReadExample.txData as ITxDataContractCallData).price);
      expect(txData.args).toEqual((contractCallTxReadExample.txData as ITxDataContractCallData).args);

      expect(tx.coinData.inputs.length).toBe(contractCallTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs.length).toBe(contractCallTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, contractCallTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, contractCallTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      let buf = Buffer.alloc(10000);
      const offset = TransactionSerializer.write(contractCallTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(contractCallTxSerializedExample);

    });

  });

});
