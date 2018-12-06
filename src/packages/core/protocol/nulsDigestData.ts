import { sha256Twice, sha256, ripemd160 } from '../utils/crypto';

/***
 * ### NulsDigestData
 * 
 * https://github.com/nuls-io/nuls/blob/274204b748ed72fdac150637ee758037d64c7ce5/core-module/kernel/src/main/java/io/nuls/kernel/model/NulsDigestData.java#L135
 * 
 */

export enum NulsDigestDataAlgType {
  DIGEST_ALG_SHA256 = 0,
  DIGEST_ALG_SHA160 = 1
}

export class NulsDigestData {

  public static HASH_LENGTH: number = 34;

  protected static digestAlgType: number = NulsDigestDataAlgType.DIGEST_ALG_SHA256;

  static digest(data: Buffer, digestAlgType: NulsDigestDataAlgType) {

    switch(digestAlgType) {

      case NulsDigestDataAlgType.DIGEST_ALG_SHA256:
        return sha256Twice(data);

      case NulsDigestDataAlgType.DIGEST_ALG_SHA160:
        return ripemd160(sha256(data));

    }
  
  }

}