import { IAPIConfig } from '..';
import { UtxoApi } from '../api/utxo';

export interface UTXO {
  fromHash: string;
  fromIndex: number;
  value: number;
  lockTime: number;
}

export class Utxo {

  static async getUtxos(address: string, config?: IAPIConfig): Promise<UTXO[]> {

    const api = new UtxoApi(config);
    return api.getUtxos(address);

  }

}