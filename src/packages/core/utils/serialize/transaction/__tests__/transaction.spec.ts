import { TransactionType } from '../../../../common';
import { ITransactionData, TransactionSerializer } from '../transaction';
import { ITxDataRewardData, TxDataRewardSerializer } from '../txData/txDataReward';
import { rewardTxSerializedExample, rewardTxReadExample, contractCallTxSerializedExample, contractCallTxReadExample } from '../__mocks__';
import { ITxDataContractCallData } from '../txData/txDataContractCall';
import { ICoinData } from '../coinData/coin';

fdescribe('TransactionSerializer', () => {

  describe('Integration tests', () => {

    describe('Reward Transaction', () => {

      const rewardTxBytes = Buffer.from(rewardTxSerializedExample, 'base64');

      it('should read a serialized transaction and return an ITransactionData object', () => {

        const tx: ITransactionData = TransactionSerializer.read(rewardTxBytes, 0).data;

        expect(tx.type).toEqual(rewardTxReadExample.type);
        expect(tx.type).toEqual(TransactionType.Reward);

        expect(tx.time).toEqual(rewardTxReadExample.time);

        expect(tx.remark).toEqual(rewardTxReadExample.remark);

        expect(tx.scriptSign).toEqual(rewardTxReadExample.scriptSign);

        expect((tx.txData as ITxDataRewardData).placeholder).toEqual(TxDataRewardSerializer.PLACE_HOLDER);

        expect(tx.coinData.inputs.length).toBe(rewardTxReadExample.coinData.inputs.length);
        expect(tx.coinData.outputs.length).toBe(rewardTxReadExample.coinData.outputs.length);

        checkCoins(tx.coinData.inputs, rewardTxReadExample.coinData.inputs);
        checkCoins(tx.coinData.outputs, rewardTxReadExample.coinData.outputs);

      });

      it('should serialize an example of read transaction', () => {

        let buf = Buffer.alloc(1000);
        const offset = TransactionSerializer.write(rewardTxReadExample, buf, 0);
        const tx: string = buf.slice(0, offset).toString('base64');

        expect(tx).toEqual(rewardTxSerializedExample);

      });

    });

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

        checkCoins(tx.coinData.inputs, contractCallTxReadExample.coinData.inputs);
        checkCoins(tx.coinData.outputs, contractCallTxReadExample.coinData.outputs);

      });

      it('should serialize an example of read transaction', () => {

        let buf = Buffer.alloc(1000);
        const offset = TransactionSerializer.write(contractCallTxReadExample, buf, 0);
        const tx: string = buf.slice(0, offset).toString('base64');

        expect(tx).toEqual(contractCallTxSerializedExample);

      });

    });

  });


})

function checkCoins(coinsData: ICoinData[], expectedCoinsData: ICoinData[]) {

  coinsData.forEach((output, i: number) => {

    expect(output.owner).toEqual(expectedCoinsData[i].owner);
    expect(output.na).toEqual(expectedCoinsData[i].na);
    expect(output.lockTime).toEqual(expectedCoinsData[i].lockTime);

  });

}