import * as config from 'config';
import { APIServerClass, IAPIConfig } from './APIServer';

export class UtxoApi extends APIServerClass {

  constructor(conf: IAPIConfig = config.nuls.api.utxo) {
    super(conf);
  }

  async getUtxos(address: string): Promise<any> {

    const resource: string =this.getResource('utxos', address);
    return await this.api.get(resource);

  }

}
