import { contractTransferTxSerializedExample, contractTransferTxReadExample } from '../../__mocks__/examples/contractTransferTx';
import { ITransactionData, TransactionSerializer } from '../../transaction';
import { TransactionType } from '../../../../../common';
import { checkAssertsCoins } from '../../__mocks__/common';
import { ITxDataContractTransferData } from '../../txData/txDataContractTransfer';

describe('TransactionSerializer integration tests', () => {

  describe('ContractTransfer Transaction', () => {

    const rewardTxBytes = Buffer.from(contractTransferTxSerializedExample, 'base64');

    it('should read a serialized transaction and return an ITransactionData object', () => {

      const tx: ITransactionData = TransactionSerializer.read(rewardTxBytes, 0).data;

      expect(tx.type).toEqual(contractTransferTxReadExample.type);
      expect(tx.type).toEqual(TransactionType.ContractTransfer);
      expect(tx.time).toEqual(contractTransferTxReadExample.time);
      expect(tx.remark).toEqual(contractTransferTxReadExample.remark);
      expect(tx.scriptSign).toEqual(contractTransferTxReadExample.scriptSign);

      const txData: ITxDataContractTransferData = tx.txData as ITxDataContractTransferData;
      expect(txData).toEqual((contractTransferTxReadExample.txData as ITxDataContractTransferData));

      expect(tx.coinData.inputs.length).toBe(contractTransferTxReadExample.coinData.inputs.length);
      expect(tx.coinData.outputs.length).toBe(contractTransferTxReadExample.coinData.outputs.length);

      checkAssertsCoins(tx.coinData.inputs, contractTransferTxReadExample.coinData.inputs);
      checkAssertsCoins(tx.coinData.outputs, contractTransferTxReadExample.coinData.outputs);

    });

    it('should serialize an example of read transaction', () => {

      let buf = Buffer.alloc(10000);
      const offset = TransactionSerializer.write(contractTransferTxReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(contractTransferTxSerializedExample);

    });

  });

});
