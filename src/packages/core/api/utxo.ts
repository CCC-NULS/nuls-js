import * as config from 'config';
import { APIServerClass, IAPIConfig } from './APIServer';
import { UTXO } from '../protocol';

export class UtxoApi extends APIServerClass {

  constructor(conf: IAPIConfig = config.nuls.api.utxo) {
    super(conf);
  }

  async getUtxos(address: string): Promise<UTXO[]> {

    const resource: string =this.getResource('address', address);
    return (await this.api.get(resource)).data.outputs;

  }

}
