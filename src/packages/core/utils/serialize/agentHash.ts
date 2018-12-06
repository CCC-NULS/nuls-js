import { HashSerializer, IHashOutput } from './hash';
import { AgentHash } from '../crypto';

/***
  * ### AgentHash
 */

export interface IAgentHashOutput extends IHashOutput {
  readBytes: number;
  data: AgentHash;
}

/**
 * Class to handle the protocol AgentHash type
 */
export class AgentHashSerializer extends HashSerializer {
}
