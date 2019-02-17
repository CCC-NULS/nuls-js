import { PromiEvent } from 'web3-core-promievent';
import { Address } from './../../core/utils/crypto';
import { ContractApi, IContractGetMethodsResponse, IContractMethod, IContractViewResponse, IContractMethodArg, ContractCallArgs } from '../api/contract';
import { IAPIConfig, ContractCallTransaction, UTXO, Utxo, Account } from '../..';
import { TransactionReceipt } from '../../core/protocol';

export interface ContractConfig {
  api?: IAPIConfig;
  sender?: string;
  privateKey?: string;
};

export interface ContractMethodCallConfig {
  sender?: Address;
  value?: number;
  gasPrice?: number;
  gasLimit?: number;
  remark?: string;
  listener?: PromiEvent<any>;
};

export interface ContractInfo {
  name: Address;
  methods: Record<string, IContractMethod>;
};

export const CONSTRUCTOR_METHOD_NAME = '<init>';

export class Contract {

  protected _contractAddress!: Address;
  protected _config: ContractConfig = {};
  protected _api!: ContractApi;
  protected _methods!: IContractGetMethodsResponse;
  protected _info: ContractInfo = {
    name: 'Unknown',
    methods: {}
  };

  static async at(contractAddress: string, config?: ContractConfig): Promise<Contract> {

    const contract = new Contract();
    contract._contractAddress = contractAddress;
    contract.config(config);
    contract._api = new ContractApi(contract._config.api);

    try {

      contract._methods = await contract._api.getMethods(contractAddress);

    } catch (e) {

      throw new Error(`Contract at address: ${contractAddress} does not exists`);

    }

    try {

      contract._info.name = await contract._api.view(contractAddress, 'name');

    } catch (e) { }

    contract._methods
      .filter((method: IContractMethod) => !method.event && method.name !== CONSTRUCTOR_METHOD_NAME) // not events nor constructor
      .forEach((method: IContractMethod) => {

        const extMethodName: string = findNextMethodName(contract, contract._methods, method);

        contract._info.methods[extMethodName] = method;

        if (method.payable) {

          contract[extMethodName] = function (...args: ContractCallArgs): PromiEvent<any> {

            let callConfig: ContractMethodCallConfig = {};

            if (typeof args[args.length - 1] === 'object') {
              callConfig = (args.pop() as ContractMethodCallConfig | undefined) || {};
            }

            return Contract.call(this._contractAddress, method, args, { ...this._config, ...callConfig });

          }

        } else if (method.view) {

          contract[extMethodName] = async function (...args: ContractCallArgs): Promise<any> {

            return Contract.view(this._contractAddress, method, args, this._config, this._api);

          }

        }

      });

    return contract;

  }

  protected static call(contractAddress: string, method: IContractMethod, args: ContractCallArgs, config: ContractConfig & ContractMethodCallConfig): PromiEvent<TransactionReceipt> {

    // TODO: Find a better way to achieve this
    const pe = config.listener instanceof PromiEvent ? config.listener : new PromiEvent();

    Contract
      .prepareCall(contractAddress, method, args, config)
      .then((tx: ContractCallTransaction) => {

        tx.send(config, pe);

      })
      .catch((e: Error) => {

        pe.emit('error', e);
        pe.reject(e);

      });

    return pe;

  }

  protected static async prepareCall(contractAddress: string, method: IContractMethod, args: ContractCallArgs, config: ContractConfig & ContractMethodCallConfig): Promise<ContractCallTransaction> {

    if (!config.sender) {
      throw new Error('Sender address must be especified');
    }

    if (!config.privateKey) {
      throw new Error('A valid account / privateKey must be especified');
    }

    this.validateArgs(method, args);

    const utxos: UTXO[] = await Utxo.getUtxos(config.sender, config.api);

    const tx: ContractCallTransaction = ContractCallTransaction
      .fromUtxos(utxos)
      .contractAddress(contractAddress)
      .config(config)
      .sender(config.sender)
      .change(config.sender)
      .call(method.name, method.desc, ...args);

    if (config.value) {
      tx.value(config.value);
    }

    if (config.gasPrice) {
      tx.gasPrice(config.gasPrice);
    }

    if (config.remark) {
      tx.remark(config.remark);
    }

    if (config.gasLimit) {
      tx.gasLimit(config.gasLimit);
    } else {
      // TODO: This does not work for all accounts at the moment (will be supported soon), so use max gas instead
      // const gasLimit: number = await tx.estimateGas(config);
      // tx.gasLimit(gasLimit);
    }

    return tx.sign(config.privateKey);

  }

  protected static async view(contractAddress: string, method: IContractMethod, args: ContractCallArgs, config: ContractConfig = {}, api?: ContractApi): Promise<any> {

    if (!api) {
      api = new ContractApi(config.api);
    }

    this.validateArgs(method, args);

    const result: IContractViewResponse = await api.view(contractAddress, method.name, method.desc, ...args);

    switch (method.returnArg) {

      case 'String':
      case 'Address':
        return result;

      case 'double':
        return parseFloat(result);

      case 'long':
      case 'int':
      case 'BigInteger': // TODO: use bigNumber to handle BBigIntegers and Na
        return parseInt(result);

      case 'boolean':
        return result.toLowerCase() === 'true' ? true : false;

      case 'void':
        return null;

      default: // For any other type not known, try to parse it as JSON / Array

        try {

          return JSON.parse(result);

        } catch (e) {

          // If it is not a JSON / Array, return it as raw unparsed string wrapped with type (to be parsed by the dapp bussiness logic);
          return {
            type: method.returnArg,
            result
          };

        }

    }

  }

  protected static validateArgs(method: IContractMethod, args: ContractCallArgs): boolean {

    const totalArgsLength: number = method.args.length;
    const requiredArgsLength: number = method.args.filter((arg: IContractMethodArg) => arg.required).length;

    if (args.length < requiredArgsLength || args.length > totalArgsLength) {

      const expectedArgs: string = requiredArgsLength === totalArgsLength
        ? '' + requiredArgsLength
        : `${requiredArgsLength} to ${totalArgsLength}`;

      throw new Error(`Wrong number of arguments calling "${method.name}", ${args.length} passed, ${expectedArgs} expected`);

    }

    method.args.forEach((methodArg: IContractMethodArg, i: number) => {

      const currentArg: any = args[i];
      const typeValidationError = new Error(`Validation failed for argument "${methodArg.name}" dont match type "${methodArg.type}"`);

      if (methodArg.required && currentArg === undefined) {
        throw new Error(`Missed required argument "${methodArg.name}"`);
      }

      switch (methodArg.type) {

        case 'String':
        case 'Address':

          checkStringType(currentArg);
          break;

        case 'double':

          checkStringType(currentArg);
          if (isNaN(parseFloat(currentArg))) {
            throw typeValidationError;
          }
          break;

        case 'long':
        case 'int':
        case 'BigInteger': // TODO: use bigNumber to handle BBigIntegers and Na

          checkStringType(currentArg);
          if (isNaN(parseInt(currentArg))) {
            throw typeValidationError;
          }
          break;

        case 'boolean':

          checkStringType(currentArg);
          const lowerArg = currentArg.toLowerCase();
          if (lowerArg !== 'true' && lowerArg !== 'false') {
            throw typeValidationError;
          }
          break;

        default: // For any other type not known, try to parse it as JSON / Array

          try {

            if (!Array.isArray(currentArg)) {
              throw new Error(`Argument must be an Array, found: "${currentArg}: ${typeof currentArg}"`);
            }

            JSON.stringify(currentArg);

          } catch (e) {

            throw typeValidationError;

          }

      }

    });

    return true;

  }

  protected constructor() { }

  config(config?: ContractConfig): this {

    if (config) {
      this._config = { ...this._config, ...config };
    }

    return this;

  }

  account(account: Account): this;
  account(address: string, privateKey: string): this;
  account(arg: string | Account, arg2?: string): this {

    let sender: string;
    let privateKey: string;

    if (arg2) {

      sender = arg as string;
      privateKey = arg2;

    } else {

      const acc = (arg as Account).getAccount();

      sender = acc.address;
      privateKey = acc.prikey;

    }

    this.config({
      sender,
      privateKey
    })

    return this;

  }

  info(): ContractInfo {

    return this._info;

  }

}

function checkStringType(arg) {
  if (typeof arg !== 'string') {
    throw new Error(`Argument must be a string, found: "${arg}: ${typeof arg}"`);
  }
}

// Find next method in case of method overload with distinct args:
// methodName, methodName1, methodName2
function findNextMethodName(contract: Contract, methods: IContractGetMethodsResponse, currentMethod: IContractMethod): string {

  const initialName: string = currentMethod.name;

  return methods.reduce((prev: string, curr: IContractMethod, i: number) => {

    return typeof contract[prev] === 'function'
      ? `${initialName}${i + 1}`
      : prev;

  }, currentMethod.name);

}
