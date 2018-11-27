import * as config from 'config';
import { APIServerClass } from './APIServer';

export interface IGetMethodsResponse {
  success: boolean;
  data: {
    code: string;
    msg: string;
  };
}

export class ContractAPI extends APIServerClass {

  constructor() {
    super(config.nuls.api.contract);
  }

  public async getMethods(contractAddress: string): Promise<IGetMethodsResponse> {

    if (!contractAddress) {
      throw new Error('Contract address is mandatory');
    }

    const resource: string = this.resources.methods.replace('__ADDRESS__', contractAddress);
    const response = await this.api.get(resource);
    return response.data;

  }

}
