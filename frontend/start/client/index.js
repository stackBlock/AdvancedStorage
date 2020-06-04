import Web3 from "web3";
import AdvancedStorage from "../build/contracts/AdvancedStorage.json";

let web3;
let advancedStorage;

const initWeb3 = () => {
  // new metamask integration
  if (typeof window.ethereum !== "undefined") {
    window.ethereum
      .enable()
      .then(() => {
        resolve(new Web3(window.ethereum));
      })
      .catch((e) => {
        reject(e);
      });
    return;
  }    
  // old metamask integration
  if (typeof window.web3 !== "undefined") {
    return resolve(new Web3(window.web3.currentProvider));
  }

  // no metamask, ganache instead
  resolve(new Web3("http://localhost:9545"));
};

const initContract = () => {
  const dK = Object.keys(AdvancedStorage.networks)[0];
  return new web3.eth.Contract(
    AdvancedStorage.abi,
    AdvancedStorage.networks[dK].address
  );
};

const initApp = () => {
    const $addData = document.getElementById('addData');
    const $data = document.getElementById('data');
    let accounts = [];

    web3.eth.getAccounts()
    .then(_accounts => {
        accounts = _accounts;
        return advancedStorage.methods
        .getAll()
        .call();
    })
    .then(result => {
        $data.innerHTML = result.join(', ');
    })

    $addData.addEventListener('submit', e => {
        e.preventDefault();
        const data = e.target.elements[0].value;
        advancedStorage.methods
        .add(date)
        .send({from: accounts[0]})
        .then(() => {
            return advancedStorage.methods
            .getAll()
            .call();
        })
        .then(result => {
            $data.innerHTML = result.join(', ');
        })
    })
};

document.addEventListener("DOMContentLoader", () => {
  initWeb3()
    .then((_web3) => {
      web3 = _web3;
      advancedStorage = initContract();
      initApp();
    })
    .catch((e) => console.log(e.message));
});
