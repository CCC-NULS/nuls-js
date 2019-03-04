import * as EventEmitter from 'eventemitter3';
import * as config from 'config';

// TODO: Change this to websocket interface when explorers support it
export class SocketEmitter extends EventEmitter {

  private nextTick!: NodeJS.Timeout;
  private active: boolean = false;
  private fn: any;

  constructor(executor: (this: SocketEmitter, emit: (event: string | symbol, ...args: any[]) => boolean, close: () => void) => void) {

    super();

    this.active = true;
    this.fn = executor.bind(this, this.emit.bind(this), this.close.bind(this));
    this.tick();

  }

  async tick(): Promise<void> {

    try {

      await this.fn();

      if (this.active) {

        this.nextTick = setTimeout(() => this.tick(), config.nuls.api.blockTime * 1000);

      }

    } catch (e) {

      this.emit('error', e);
      this.close();

    }

  }

  restart(): void {

    this.active = true;
    this.tick();

  }

  close(): void {

    this.active = false;
    clearTimeout(this.nextTick);
    this.removeAllListeners();

  }

}
