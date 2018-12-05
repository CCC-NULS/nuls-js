import { PLACE_HOLDER } from '../../../../../../packages/core/common';
import { TransactionType } from '../../../../common';
import { ITransactionData, TransactionSerializer } from '../transaction';
import { ITxDataRewardData } from '../txData/txDataReward';
import { rewardTxSerializedExample, rewardTxReadedExample, contractCallTxSerializedExample, contractCallTxReadedExample } from '../__mocks__';
import { ITxDataContractCallData } from '../txData/txDataContractCall';
import { ICoinData } from '../coin';

fdescribe('TransactionSerializer', () => {

  describe('Integration tests', () => {

    describe('Reward Transaction', () => {

      const rewardTxBytes = Buffer.from(rewardTxSerializedExample, 'base64');

      it('should read a serialized transaction and return an ITransactionData object', () => {

        const tx: ITransactionData = TransactionSerializer.read(rewardTxBytes, 0).data;

        expect(tx.type).toEqual(rewardTxReadedExample.type);
        expect(tx.type).toEqual(TransactionType.Reward);

        expect(tx.time).toEqual(rewardTxReadedExample.time);

        expect(tx.remark).toEqual(rewardTxReadedExample.remark);

        expect(tx.scriptSign).toEqual(rewardTxReadedExample.scriptSign);

        expect((tx.txData as ITxDataRewardData).placeholder).toEqual(PLACE_HOLDER);

        expect(tx.coinData.inputs.length).toBe(rewardTxReadedExample.coinData.inputs.length);
        expect(tx.coinData.outputs.length).toBe(rewardTxReadedExample.coinData.outputs.length);

        checkCoins(tx.coinData.inputs, rewardTxReadedExample.coinData.inputs);
        checkCoins(tx.coinData.outputs, rewardTxReadedExample.coinData.outputs);

      });

      it('should serialize an example of readed transaction', () => {

        let buf = Buffer.alloc(1000);
        const offset = TransactionSerializer.write(rewardTxReadedExample, buf, 0);
        const tx: string = buf.slice(0, offset).toString('base64');

        expect(tx).toEqual(rewardTxSerializedExample);

      });

    });

    describe('ContractCall Transaction', () => {

      const rewardTxBytes = Buffer.from(contractCallTxSerializedExample, 'base64');

      it('should read a serialized transaction and return an ITransactionData object', () => {

        const tx: ITransactionData = TransactionSerializer.read(rewardTxBytes, 0).data;

        expect(tx.type).toEqual(contractCallTxReadedExample.type);
        expect(tx.type).toEqual(TransactionType.ContractCall);

        expect(tx.time).toEqual(contractCallTxReadedExample.time);

        expect(tx.remark).toEqual(contractCallTxReadedExample.remark);

        expect(tx.scriptSign).toEqual(contractCallTxReadedExample.scriptSign);

        const txData: ITxDataContractCallData = tx.txData as ITxDataContractCallData;

        expect(txData.contractAddress).toEqual((contractCallTxReadedExample.txData as ITxDataContractCallData).contractAddress);
        expect(txData.gasLimit).toEqual((contractCallTxReadedExample.txData as ITxDataContractCallData).gasLimit);
        expect(txData.methodName).toEqual((contractCallTxReadedExample.txData as ITxDataContractCallData).methodName);
        expect(txData.methodDesc).toEqual((contractCallTxReadedExample.txData as ITxDataContractCallData).methodDesc);
        expect(txData.price).toEqual((contractCallTxReadedExample.txData as ITxDataContractCallData).price);
        expect(txData.sender).toEqual((contractCallTxReadedExample.txData as ITxDataContractCallData).sender);
        expect(txData.price).toEqual((contractCallTxReadedExample.txData as ITxDataContractCallData).price);
        expect(txData.args).toEqual((contractCallTxReadedExample.txData as ITxDataContractCallData).args);

        expect(tx.coinData.inputs.length).toBe(contractCallTxReadedExample.coinData.inputs.length);
        expect(tx.coinData.outputs.length).toBe(contractCallTxReadedExample.coinData.outputs.length);

        checkCoins(tx.coinData.inputs, contractCallTxReadedExample.coinData.inputs);
        checkCoins(tx.coinData.outputs, contractCallTxReadedExample.coinData.outputs);

      });

      it('should serialize an example of readed transaction', () => {

        let buf = Buffer.alloc(1000);
        const offset = TransactionSerializer.write(contractCallTxReadedExample, buf, 0);
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