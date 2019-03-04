import { ContractConfig } from '../src';
import { Contract } from '../src';

// import { TransferTransaction, nulsToNa } from '../src/index';
// import { AliasTransaction } from '../src/index';
// import { UTXO, Utxo, ContractCallTransaction } from '../src/index';

// const this_is_secret: string = '002313549d166b9d6e4781504dfa8b4bd5a03056f226dca3c5d1e21783e4e0d1ee';

async function run() {

  const contractConfig: ContractConfig = {
    api: {
      host: 'https://explorer.nuls.services'
    }
  };
  
  const contractAddress = 'TTazCA6Azw13FxGeseUPuv1hiuyovKYD';
  const contract: any = await Contract.at(contractAddress, contractConfig);
  
  const result: any = await contract.viewLotteryList();
  
  console.log(result);

  // const a = Buffer.from('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', 'base64');
  // const b = Block.fromBytes(a);

  // console.log(JSON.stringify(b, undefined, 2));
  // console.log(b.toObject());

  // testContract2();
  // testContract();
  // testTransfer();
  // testAlias();

}

run();


// async function testContract2() {

//   const contractAddress = 'TTbB8VocYddVHeCwBvXsgRE11G6BSG5c';
//   const fromAddress: string = 'TTarN3iszzfkh2j4doWHsMw3LxJJrq25';
//   const privateKey: string = this_is_secret;

//   const contractConfig: NULS.ContractConfig = {
//     api: {
//       host: 'https://testnet.nuls.world'
//     }
//   };

//   const lotteryContract: any = await NULS.Contract.at(contractAddress, contractConfig);

//   // console.log(lotteryContract.info());

//   // const response: any = await lotteryContract
//   //   .account(fromAddress, privateKey)
//   //   .buyTickets('1', { value: NULS.nulsToNa(2.5) });

//   const response: any = await lotteryContract
//     .account(fromAddress, privateKey)
//     .viewLotteryDetails('1');

//   console.log(response);

// }

// async function testContract() {

//   const contractAddress = 'TTb3ASyCBbJ6KL1PUS4gh9jWjNi3RvTK';
//   const fromAddress: string = 'TTarN3iszzfkh2j4doWHsMw3LxJJrq25';
//   const privateKey: string = this_is_secret;

//   const transactionConfig: TransactionConfig = {
//     api: {
//       host: 'https://testnet.nuls.world'
//     }
//   };

//   const api = new ContractApi(transactionConfig.api);

//   // getMethods
//   const methods = await api.getMethods(contractAddress);

//   console.log(methods[0]);

//   // call
//   const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

//   const tx: ContractCallTransaction = ContractCallTransaction
//     .fromUtxos(utxos)
//     .config(transactionConfig)
//     .contractAddress(contractAddress)
//     .sender(fromAddress)
//     .call('buyTickets', '', '1')
//     .value(nulsToNa(2))
//     .remark('contract call :3')
//     .change(fromAddress)
//     .sign(privateKey);

//   const txHash: TransactionHash = await tx.send();
//   console.log(txHash);


//   // view
//   const result = await api.view(contractAddress, 'viewTicketListByOwner', '', '1', fromAddress);
//   console.log(result);

// }

// async function testTransfer() {

//   const fromAddress: string = 'TTarN3iszzfkh2j4doWHsMw3LxJJrq25';
//   const toAddress: string = 'TTattJmAz28RNH95VsRqnGNRhvKAV5Fj';
//   const privateKey: string = this_is_secret;

//   const transactionConfig: TransactionConfig = {
//     api: {
//       host: 'https://testnet.nuls.world'
//     }
//   };

//   const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

//   const tx: TransferTransaction = TransferTransaction
//     .fromUtxos(utxos)
//     .config(transactionConfig)
//     .to(toAddress, nulsToNa(1))
//     .remark('test transfer :)')
//     .change(fromAddress)
//     .sign(privateKey);

//   const txHash: TransactionHash = await tx.send();
//   console.log(txHash);

// }

// async function testAlias() {

//   const fromAddress: string = 'TTarN3iszzfkh2j4doWHsMw3LxJJrq25';
//   const privateKey: string = this_is_secret;

//   const transactionConfig: TransactionConfig = {
//     api: {
//       host: 'https://testnet.nuls.world'
//     }
//   };

//   const utxos: UTXO[] = await Utxo.getUtxos(fromAddress, transactionConfig.api);

//   const tx: AliasTransaction = AliasTransaction
//     .fromUtxos(utxos)
//     .config(transactionConfig)
//     .alias(fromAddress, 'testnet_account_1')
//     .remark('changing alias 0_o')
//     .sign(privateKey);

//   const txHash: TransactionHash = await tx.send();
//   console.log(txHash);

// }
