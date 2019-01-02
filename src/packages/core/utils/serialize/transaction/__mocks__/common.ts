import { ICoinData } from '../coinData/coin';

export function checkAssertsCoins(coinsData: ICoinData[], expectedCoinsData: ICoinData[]) {

  coinsData.forEach((output, i: number) => {

    expect(output.owner).toEqual(expectedCoinsData[i].owner);
    expect(output.na).toEqual(expectedCoinsData[i].na);
    expect(output.lockTime).toEqual(expectedCoinsData[i].lockTime);

  });

}