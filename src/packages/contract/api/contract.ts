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

export class ContractApi extends APIServerClass {

  constructor(conf: IAPIConfig = config.nuls.api.explorer) {
    super({ ...config.nuls.api.explorer, ...conf });
  }

  async getMethods(contractAddress: string): Promise<IContractGetMethodsResponse> {

    const resource: string = this.getResource('contractMethods', contractAddress);
    return (await this.api.get(resource)).data.methods;

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

}
