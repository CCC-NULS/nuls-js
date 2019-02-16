import { Address } from '../../../core/utils/crypto';
import { CONTRACT_MIN_GAS_PRICE, CONTRACT_MAX_GAS_LIMIT } from '../../common';
import { BaseTransaction, TransactionConfig, TransactionReceipt } from '../../../core/protocol/transaction/baseTransaction';
import { TransactionType } from '../../../core/common';
import { CoinOutput } from '../../..';
import { ITxDataContractCallData } from '../../../core/utils/serialize/transaction/txData/txDataContractCall';
import { MIN_FEE_PRICE_1024_BYTES } from '../../../core/utils/fee';
import { ContractCallArgs, ContractCallArg, ContractApi, IContractCallValidateRequest, IContractCallValidateResponse } from '../../api';
import { PromiEvent } from 'web3-core-promievent';

// https://github.com/nuls-io/nuls/blob/305c56ca546407a74298a729f2588511781e624a/contract-module/base/contract-tx/src/main/java/io/nuls/contract/service/impl/ContractTxServiceImpl.java#L655
export class ContractCallTransaction extends BaseTransaction {

  protected _fee_price = MIN_FEE_PRICE_1024_BYTES;
  protected _type = TransactionType.ContractCall;
  protected _txData: ITxDataContractCallData = {
    methodDesc: '',
    value: 0,
    price: CONTRACT_MIN_GAS_PRICE,
    gasLimit: CONTRACT_MAX_GAS_LIMIT,
    args: []
  } as any;

  private _contractValueOutputIndex: number | undefined;

  sender(senderAddress: Address) {

    this._txData.sender = senderAddress;

    if (!this._changeAddress) {
      this.change(senderAddress);
    }

    this.updateInputsAndOutputs();
    return this;

  }

  contractAddress(contractAddress: Address) {

    this._txData.contractAddress = contractAddress;

    this.updateValueOutput();
    this.updateInputsAndOutputs();
    return this;

  }

  value(na: number) {

    if (this._txData.value < 0) {
      throw new Error('Value should be >= 0');
    }

    this._txData.value = na;

    this.updateValueOutput();
    this.updateInputsAndOutputs();
    return this;

  }

  gas(gasLimit: number = CONTRACT_MAX_GAS_LIMIT, gasPrice: number = CONTRACT_MIN_GAS_PRICE) {

    this._txData.gasLimit = gasLimit;
    this._txData.price = gasPrice;

    this.updateInputsAndOutputs();
    return this;

  }

  gasPrice(gasPrice: number = CONTRACT_MIN_GAS_PRICE) {

    this._txData.price = gasPrice;

    this.updateInputsAndOutputs();
    return this;

  }

  gasLimit(gasLimit: number = CONTRACT_MAX_GAS_LIMIT) {

    this._txData.gasLimit = gasLimit;

    this.updateInputsAndOutputs();
    return this;

  }

  call(methodName: string, methodDesc: string, ...args: ContractCallArgs): this {

    this._txData.methodName = methodName;
    this._txData.methodDesc = methodDesc;

    this._txData.args = args.map((arg: ContractCallArg) => Array.isArray(arg) ? arg : [arg]);

    this.updateInputsAndOutputs();
    return this;

  }

  send(config?: TransactionConfig, pe = new PromiEvent()): PromiEvent<TransactionReceipt> {

    this.validate();

    this.config(config);

    const api = new ContractApi(this._config.api);

    const callRequest: IContractCallValidateRequest = {
      contractAddress: this._txData.contractAddress,
      methodName: this._txData.methodName,
      methodDesc: this._txData.methodDesc,
      args: this._txData.args,
      sender: this._txData.sender,
      value: this._txData.value,
      price: this._txData.price,
      gasLimit: this._txData.gasLimit
    };

    api
      .validate(callRequest)
      .then((validateResponse: IContractCallValidateResponse) => {

        if (!validateResponse.isValid) {
          throw new Error(validateResponse.error);
        }

        super.send(config, pe);

      })
      .catch((e: Error) => {

        pe.emit('error', e);
        pe.reject(e);

      });

    return pe;

  }

  async estimateGas(config?: TransactionConfig): Promise<number> {

    this.validate();

    this.config(config);

    const api = new ContractApi(this._config.api);

    const callRequest: IContractCallValidateRequest = {
      contractAddress: this._txData.contractAddress,
      methodName: this._txData.methodName,
      methodDesc: this._txData.methodDesc,
      args: this._txData.args,
      sender: this._txData.sender,
      value: this._txData.value,
      price: this._txData.price
    };

    return await api.gas(callRequest);

  }

  protected updateInputsAndOutputs(): void {

    super.updateInputsAndOutputs(this._txData.price * this._txData.gasLimit);

  }

  // TODO: Improve params validation
  protected validate(): boolean {

    if (this._config.safeCheck) {

      if (!this._txData.methodName) {
        throw new Error('You must specify a contract method name');
      }

      if (!this._txData.sender) {
        throw new Error('You must specify the contract sender address');
      }

      if (!this._txData.contractAddress) {
        throw new Error('You must specify the contract address');
      }

      if (this._txData.value < 0) {
        throw new Error('Value should be >= 0');
      }

      if (this._txData.gasLimit < 0 || this._txData.gasLimit > CONTRACT_MAX_GAS_LIMIT) {
        throw new Error(`Gas limit should be >= 0 and <= ${CONTRACT_MAX_GAS_LIMIT}`);
      }

      if (this._txData.price < CONTRACT_MIN_GAS_PRICE) {
        throw new Error(`Gas price should be >= ${CONTRACT_MIN_GAS_PRICE}`);
      }

    }

    return super.validate();

  }

  private updateValueOutput() {

    if (this._txData.value > 0 && this._txData.contractAddress) {

      if (!this._contractValueOutputIndex) {

        this._contractValueOutputIndex = this.addOutput(this._txData.contractAddress, this._txData.value);

      } else {

        const output: CoinOutput = this._coinData.outputs[this._contractValueOutputIndex];
        output.na = this._txData.value;

      }

    }

  }

}