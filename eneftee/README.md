# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```



# How to run
first install the metamask chrome extension: `https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en`
sign up and make sure everything is ready.

click on the extension -> **Accounts** -> **Settings** -> **Advanced** -> **Show test networks** and **Customize transaction nonce**.

click on the networks -> choose **Localhost 8545**.

open 3 terminals.

to install, run `npm install`. To compile, delete the artifacts folder and run `npx hardhat compile`. To test, run `npx hardhat test`
after installing and compiling, in the first terminal, run `npx hardhat node` to create a local network
copy one of the private keys from the accounts list.
click on the meta mask extension -> **Accounts** -> **Import Account** -> paste the private key and click **Import**

in the second terminal, run `npx hardhat run .\scripts\deploy.js --network localhost` to deploy the contracts

in the third terminal, run `npm run dev` and open http://localhost:3000/ to see the website.