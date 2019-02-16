import * as config from 'config';
import { APIServerClass, IAPIConfig } from './APIServer';
import { SocketEmitter } from '../utils/socketEmitter';
import { ApiTransaction } from './transaction';

export interface ApiBlock {
	hash: string;
	preHash: string;
	merkleHash: string;
	time: number;
	height: number;
	txCount: number;
	consensusMemberCount: number;
	packingIndexOfRound: number;
	roundIndex: number;
	roundStartTime: number;
	extend: string;
	signature: string;
	transactions: ApiTransaction[];
}

export class BlockApi extends APIServerClass {

	constructor(conf: IAPIConfig = config.nuls.api.explorer) {
		super({ ...config.nuls.api.explorer, ...conf });
	}

	async lastHeight(): Promise<number> {

		const resource: string = this.getResource('lastHeight');
		return (await this.api.get(resource)).data[0];

	}

	async block(height: number): Promise<ApiBlock>;
	async block(hash: string): Promise<ApiBlock>;
	async block(heightOrhash: string | number): Promise<ApiBlock> {

		const resource: string = this.getResource('block', `${heightOrhash}`);
		return (await this.api.get(resource)).data;

	}

	// TODO: Change this to websocket interface when explorers support it
	subscribe(height: number = -1): SocketEmitter {

		return new SocketEmitter(async (emit) => {

			if (height < 0) {

				height = await this.lastHeight();

			}

			const block: ApiBlock = await this.block(height);
			emit('block', block);
			height++;

		});

	}

}
