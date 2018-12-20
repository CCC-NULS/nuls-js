import { IAPIConfig } from '..';
import { UtxoApi } from '../api/utxo';

export interface UTXO {
  hash: string;
  idx: number;
  value: number;
  lockTime: number;
}

export class Utxo {

  static async getUtxos(address: string, config?: IAPIConfig) {

    const api = new UtxoApi(config);
    return api.getUtxos(address);

  }

}