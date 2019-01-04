import * as config from 'config';
import { APIServerClass, IAPIConfig } from '../../core/api/APIServer';

export type ContractMethodArgCustomType = string; // example: 'Lcom/gmail/amalcaraz89/lottery/model/Lottery;'
export type ContractMethodArgType = 'String' | 'double' | 'long' | 'int' | 'boolean' | 'Address' | 'BigInteger';
export type ContractMethodRetType = ContractMethodArgType | ContractMethodArgCustomType;

export interface IContractGetMethodsResponse {
  methods: Array<{
    name: string;
    desc: string;
    args: Array<{
      type: ContractMethodArgType;
      name: string;
      required: boolean;
    }>;
    returnArg: ContractMethodRetType; // or 'void'
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

  async view(contractAddress: string, methodName: string, methodDesc: string, ...args: string[]): Promise<any> {

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
