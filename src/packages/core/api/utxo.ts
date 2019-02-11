import * as config from 'config';
import { APIServerClass, IAPIConfig } from './APIServer';
import { UTXO } from '../protocol';

export class UtxoApi extends APIServerClass {

  constructor(conf: IAPIConfig = config.nuls.api.explorer) {
		super({ ...config.nuls.api.explorer, ...conf });
  }

  async getUtxos(address: string): Promise<UTXO[]> {

    const resource: string = this.getResource('utxos', address);

    return (await this.api.get(resource)).data;

  }

}
