/***
  * ### Fee calculation utils
  *
  * https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/utils/TransactionFeeCalculator.java
  *
 */

// TODO: Use BigNumber to handle nuls amounts
export const MIN_PRICE_PRE_1024_BYTES = 100000;
export const OTHER_PRECE_PRE_1024_BYTES = 1000000;
const KB = 1024;

/**
 * According to the transaction size calculate the handling fee
 * @param size size of the transaction
 */
export function getTransferFee(size: number) {

    let fee = (MIN_PRICE_PRE_1024_BYTES * (size / KB));

    if (size % KB > 0) {
        fee += MIN_PRICE_PRE_1024_BYTES;
    }

    return fee;

}

/**
 * According to the transaction size calculate the handling fee
 * @param size size of the transaction
 */
export function getMaxFee(size: number) {

    let fee = (OTHER_PRECE_PRE_1024_BYTES * (size / KB));

    if (size % KB > 0) {
        fee += OTHER_PRECE_PRE_1024_BYTES;
    }

    return fee;

}

/**
 * According to the transaction size calculate the handling fee
 * @param size size of the transaction
 */
export function getFee(size: number, price: number) {

    if (price < MIN_PRICE_PRE_1024_BYTES) {
        throw new Error('Incorrect fee');
    }
    if (price > OTHER_PRECE_PRE_1024_BYTES) {
        throw new Error('Incorrect fee');
    }

    let fee = (price * (size / KB));

    if (size % KB > 0) {
        fee += price;
    }

    return fee;

}
