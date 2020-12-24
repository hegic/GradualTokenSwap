const web3 = require('web3')
const BN = web3.utils.BN

BN.prototype.e = function(x) {
  return this.mul(new BN(10).pow(new BN(x)))
}

module.exports = {
  BN(x){ return new BN(x) }
}
