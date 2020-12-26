import web3 from 'web3'
export const BN = web3.utils.BN

BN.prototype.format = function(decimals, precision = 0) {
    const num = this.toString() / 10 ** decimals
    return num.toLocaleString(undefined, {
        maximumFractionDigits: precision
    })
}

BN.prototype.e = function(x) {
  return this.mul(new BN(10).pow(new BN(x)))
}

export function toBN(x) { return new BN(x) }
export default toBN
