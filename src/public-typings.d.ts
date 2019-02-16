
declare module 'web3-core-promievent' {
  import * as EventEmitter from 'eventemitter3';

  export class PromiEvent<T> implements Promise<T>, EventEmitter {
    [Symbol.toStringTag]: 'Promise';
    eventNames(): (string | symbol)[];
    listeners(event: string | symbol): EventEmitter.ListenerFn[];
    listenerCount(event: string | symbol): number;
    emit(event: string | symbol, ...args: any[]): boolean;
    on(event: string | symbol, fn: EventEmitter.ListenerFn, context?: any): any;
    addListener(event: string | symbol, fn: EventEmitter.ListenerFn, context?: any): any;
    once(event: string | symbol, fn: EventEmitter.ListenerFn, context?: any): any;
    removeListener(event: string | symbol, fn?: EventEmitter.ListenerFn | undefined, context?: any, once?: boolean | undefined): any;
    off(event: string | symbol, fn?: EventEmitter.ListenerFn | undefined, context?: any, once?: boolean | undefined): any;
    removeAllListeners(event?: string | symbol | undefined): any;
    then(...args: any[]): any;
    catch(...args: any[]): any;
    resolve(value?: T | PromiseLike<T>): void;
    reject(reason?: any): void;
    finally(...args: any[]): any;
  }
}

// declare module 'web3-core-promievent' {
//   import * as EventEmitter from 'eventemitter3';

//   export class PromiEvent<T> extends EventEmitter implements Promise<T> {
//     then<TResult1 = any, TResult2 = never>(onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
//     catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult>;
//     [Symbol.toStringTag]: string;
//     resolve(value?: T | PromiseLike<T>): void;
//     reject(reason?: any): void;
//     finally(): any;
//   }
// }