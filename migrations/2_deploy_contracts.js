const rSwap = artifacts.require("rSwap");
const rHEGIC = artifacts.require("rHEGIC");
const HEGIC = artifacts.require("HEGIC");
const fs = require('fs')
const path = require('path')
const writeTo = path.resolve(__dirname, '../build/contracts.json')

const web3Of = ({abi, address}) => ({abi, address})

module.exports = async deployer => {
  await deployer.deploy(HEGIC)
  await deployer.deploy(rHEGIC)
  const start = parseInt( Date.now() / 1000 )
  const duration = 7 * 24 * 3600
  await deployer.deploy(rSwap, start, duration, rHEGIC.address, HEGIC.address);
  await HEGIC.deployed().then(x => x.transfer(rSwap.address, "100000000000000000000000"));

  fs.writeFileSync(writeTo, JSON.stringify({
    rSwap: web3Of(rSwap),
    rHEGIC: web3Of(rHEGIC),
    HEGIC: web3Of(HEGIC),
  }))
};
