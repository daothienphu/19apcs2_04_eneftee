require("@nomiclabs/hardhat-waffle");
const fs = require('fs');

const privateKey = fs.readFileSync(".secret").toString();
//const projectId = "3627400647b7489eb01f744ba5c82f47";
const projectId = "91f9724d70ba499f8fa8cef2737940e9";

module.exports = {
  networks :{
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url:`https://matic-mumbai.chainstacklabs.com`,
      accounts: [privateKey]
    },
    mainnet: {
      url:`https://mainnet.infura.io/ws/v3/${projectId}`,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.4",
};
