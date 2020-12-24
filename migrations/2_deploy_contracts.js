const {BN} = require('../test/helpers/BN')
const GradualTokenSwap = artifacts.require("GradualTokenSwap");
const HEGIC = artifacts.require("HEGIC");
const rHEGIC = artifacts.require("rHEGIC");
const fs = require('fs')
const path = require('path')
const writeTo = path.resolve(__dirname, '../build/contracts.json')
const web3Of = ({abi, address}) => ({abi, address})

module.exports = async deployer => {
  const start = 0 // block.timestamp
  const duration = 180 * 24 * 3600 // 180 days
  const supply = BN(1_000_000).e(18)

  await deployer.deploy(HEGIC, supply)
  await deployer.deploy(rHEGIC, supply)
  await deployer.deploy(GradualTokenSwap, start, duration, rHEGIC.address, HEGIC.address);

  await HEGIC.deployed().then(x => x.transfer(GradualTokenSwap.address, supply));

  fs.writeFileSync(writeTo, JSON.stringify({
    GradualTokenSwap: web3Of(GradualTokenSwap),
    rHEGIC: web3Of(rHEGIC),
    HEGIC: web3Of(HEGIC),
  }))
};
