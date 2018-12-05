import { PLACE_HOLDER } from '../../../common';
import { ITransactionData } from '../../transaction';

export const contractCallTxSerializedExample: string = 'ZQD2a+khZwEABQEBg2SlB9vZkB9Eo9Y/QBoKAU+3f4MFAQKkj16g+uyHXyo6Yn/jmSqCuVaPEwAAAAAAAAAALssAAAAAAAAZAAAAAAAAAA1jcmVhdGVMb3R0ZXJ5rShTdHJpbmcgdGl0bGUsIFN0cmluZyBkZXNjLCBkb3VibGUgdGlja2V0UHJpY2UsIGxvbmcgc3RhcnRUaW1lLCBsb25nIGVuZFRpbWUsIGludCBtaW5QYXJ0aWNpcGFudHMsIGJvb2xlYW4gc2Vjb25kUHJpemVzKSByZXR1cm4gTGNvbS9nbWFpbC9hbWFsY2FyYXo4OS9sb3R0ZXJ5L21vZGVsL0xvdHRlcnk7BwEFVGl0bGUBBERlc2MBATEBDTE1NDI0NjIxNzg2NzYBDTk5NDI0NjIxNzg2NzYBAjEwAQVmYWxzZQEjACCNqhZlcO502hwYGwc+FPFRsLqRF7ApNW2DF6/KQBQy4gAB9J6cMBIAAAAAAAAAAAEXBQEBg2SlB9vZkB9Eo9Y/QBoKAU+3f4PjlYmcMBIAAAAAAAAAAGshAySUJVBSO9nLWF/MI8sCDJF7oT2AYjCF+g4+ZRSubyJyAEcwRQIhANfyKiNrA9umOt97x28CCXc4rXUDappD3UEo34ik9ZclAiBOopGIiP1+YrNuR6QL7RU6CpszHksx9boGcb0ttiivFg==';

export const contractCallTxReadedExample: ITransactionData = {
  type: 101,
  time: 1542462204918,
  remark: Buffer.from([]),
  txData: {
    sender: 'TTarN3iszzfkh2j4doWHsMw3LxJJrq25',
    contractAddress: 'TTbA9N6GHNz9fitD7a3HCWjh1KZJNueg',
    value: 0,
    gasLimit: 52014,
    price: 25,
    methodName: 'createLottery',
    methodDesc: '(String title, String desc, double ticketPrice, long startTime, long endTime, int minParticipants, boolean secondPrizes) return Lcom/gmail/amalcaraz89/lottery/model/Lottery;',
    args: [
      ['Title'],
      ['Desc'],
      ['1'],
      ['1542462178676'],
      ['9942462178676'],
      ['10'],
      ['false']
    ]
  },
  coinData: {
    inputs: [
      {
        owner: Buffer.from('00208daa166570ee74da1c181b073e14f151b0ba9117b029356d8317afca401432e200', 'hex'),
        na: 19999995393025,
        lockTime: 0
      }
    ],
    outputs: [
      {
        owner: Buffer.from('0501018364a507dbd9901f44a3d63f401a0a014fb77f83', 'hex'),
        na: 19999993992675,
        lockTime: 0
      }
    ]
  },
  scriptSign: Buffer.from('210324942550523bd9cb585fcc23cb020c917ba13d80623085fa0e3e6514ae6f227200473045022100d7f22a236b03dba63adf7bc76f02097738ad75036a9a43dd4128df88a4f5972502204ea2918888fd7e62b36e47a40bed153a0a9b331e4b31f5ba0671bd2db628af16', 'hex')
};

export const contractCallTxExample = {
  "hash": "002019ca5b240c0b1178ddbf352e0941bd670e7b22e43b44bcc46ee4f85ea15d3aac",
  "type": 101,
  "time": 1542462204918,
  "blockHeight": 153898,
  "fee": 1400350,
  "value": 0,
  "remark": null,
  "scriptSig": "210324942550523bd9cb585fcc23cb020c917ba13d80623085fa0e3e6514ae6f227200473045022100d7f22a236b03dba63adf7bc76f02097738ad75036a9a43dd4128df88a4f5972502204ea2918888fd7e62b36e47a40bed153a0a9b331e4b31f5ba0671bd2db628af16",
  "status": 1,
  "confirmCount": 30211,
  "size": 523,
  "inputs": [
    {
      "fromHash": "00208daa166570ee74da1c181b073e14f151b0ba9117b029356d8317afca401432e2",
      "fromIndex": 0,
      "address": "TTarN3iszzfkh2j4doWHsMw3LxJJrq25",
      "value": 19999995393025
    }
  ],
  "outputs": [
    {
      "txHash": "002019ca5b240c0b1178ddbf352e0941bd670e7b22e43b44bcc46ee4f85ea15d3aac",
      "index": 0,
      "address": "TTarN3iszzfkh2j4doWHsMw3LxJJrq25",
      "value": 19999993992675,
      "lockTime": 0,
      "status": 3
    }
  ]
};
