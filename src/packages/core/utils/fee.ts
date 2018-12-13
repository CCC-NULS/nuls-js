/***
  * ### Fee calculation utils
  *
  * https://github.com/nuls-io/nuls/blob/d8227554ce35dfd7557ed489fb5949b528a738bf/core-module/kernel/src/main/java/io/nuls/kernel/utils/TransactionFeeCalculator.java
  *
 */

// TODO: Use BigNumber to handle nuls amounts
export const MIN_FEE_PRICE_1024_BYTES = 100000;
export const MAX_FEE_PRICE_1024_BYTES = 1000000;
const KB = 1024;

/**
 * Retrieves the minimum fee for the given transaction size
 * @param size size of the transaction
 */
export function getMinFee(size: number) {
  return getFee(size, MIN_FEE_PRICE_1024_BYTES);
}

/**
 * Retrieves the maximun fee for the given transaction size
 * @param size size of the transaction
 */
export function getMaxFee(size: number) {
  return getFee(size, MAX_FEE_PRICE_1024_BYTES);
}

/**
 * According to the transaction size calculate the handling fee
 * @param size size of the transaction
 * @param feePrice price of the fee per block (1MB)
 */
export function getFee(size: number, feePrice: number) {

  if (feePrice < MIN_FEE_PRICE_1024_BYTES) {
    throw new Error('Fee price per block too low');
  }

  if (feePrice > MAX_FEE_PRICE_1024_BYTES) {
    throw new Error('Fee price per block too high');
  }

  let fee = (feePrice * (size / KB));

  if (size % KB > 0) {
    fee += feePrice;
  }

  return fee;

}