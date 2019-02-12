import * as config from 'config';
import { APIServerClass, IAPIConfig } from '../../core/api/APIServer';

export type ContractMethodsArgCustomType = string; // example: 'Lcom/gmail/amalcaraz89/lottery/model/Lottery;'
export type ContractMethodsArgType = 'String' | 'double' | 'long' | 'int' | 'boolean' | 'Address' | 'BigInteger';
export type ContractMethodsRetType = ContractMethodsArgType | ContractMethodsArgCustomType | 'void';

export type ContractCallArg = string | string[];
export type ContractCallArgs = ContractCallArg[];

export interface IContractMethodArg {
  type: ContractMethodsArgType;
  name: string;
  required: boolean;
};

export interface IContractMethod {
  name: string;
  desc: string;
  args: IContractMethodArg[];
  returnArg: ContractMethodsRetType;
  view: boolean;
  event: boolean;
  payable: boolean;
}

export type IContractGetMethodsResponse = IContractMethod[];

export interface IContractViewRequest {
  contractAddress: string;
  methodName: string;
  methodDesc?: string;
  args: ContractCallArgs;
}

export type IContractViewResponse = string;

export interface IContractCallGasRequest extends IContractViewRequest {
  sender: string;
  value: number;
  price: number;
}

export type IContractCallGasResponse = number;

export interface IContractCallValidateRequest extends IContractCallGasRequest {
  gasLimit?: number;
}

export interface IContractCallValidateResponse {
  isValid: boolean;
  error?: string;
};


export class ContractApi extends APIServerClass {

  constructor(conf: IAPIConfig = config.nuls.api.explorer) {
    super({ ...config.nuls.api.explorer, ...conf });
  }

  async getMethods(contractAddress: string): Promise<IContractGetMethodsResponse> {

    const resource: string = this.getResource('contractMethods', contractAddress);
    return (await this.api.get(resource)).data;

  }

  async view(contractAddress: string, methodName: string, methodDesc?: string, ...args: ContractCallArgs): Promise<IContractViewResponse> {

    const resource: string = this.getResource('contractView', contractAddress);
    const body: IContractViewRequest = {
      contractAddress,
      methodName,
      methodDesc,
      args
    };

    if (methodDesc) {
      body.methodDesc = methodDesc;
    }

    // TODO: Improve error response codes
    return (await this.api.post(resource, body)).data.result;

  }

  async gas(body: IContractCallGasRequest): Promise<IContractCallGasResponse> {

    const resource: string = this.getResource('contractCallGas', body.contractAddress);

    // TODO: Improve error response codes
    return (await this.api.post(resource, body)).data.gasLimit;

  }

  async validate(body: IContractCallValidateRequest): Promise<IContractCallValidateResponse> {

    const resource: string = this.getResource('contractCallValidate', body.contractAddress);
    const response: IContractCallValidateResponse = {
      isValid: false,
    }

    try {
      
      response.isValid = (await this.api.post(resource, body)).data.isValid;

    } catch (e) {

      response.error = e.response.data.extendedMessage || e.response.data.message || e.response.data.internalError || e.error || `${e}`;

    }

    return response;

  }

}
