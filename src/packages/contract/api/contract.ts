import * as config from 'config';
import { APIServerClass, IAPIConfig } from '../../core/api/APIServer';

export type ContractMethodsArgCustomType = string; // example: 'Lcom/gmail/amalcaraz89/lottery/model/Lottery;'
export type ContractMethodsArgType = 'String' | 'double' | 'long' | 'int' | 'boolean' | 'Address' | 'BigInteger';
export type ContractMethodsRetType = ContractMethodsArgType | ContractMethodsArgCustomType;

export interface IContractGetMethodsResponse {
  methods: Array<{
    name: string;
    desc: string;
    args: Array<{
      type: ContractMethodsArgType;
      name: string;
      required: boolean;
    }>;
    returnArg: ContractMethodsRetType; // or 'void'
    view: boolean;
    event: boolean;
    payable: boolean;
  }>
}

export interface IContractViewRequest {
  contractAddress: string;
  methodName: string;
  methodDesc?: string;
  args: string[];
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

  async view(contractAddress: string, methodName: string, methodDesc?: string, ...args: string[]): Promise<any> {

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

    return (await this.api.post(resource, body)).data.result;

  }

}
