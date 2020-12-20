const helper = require("./helpers/truffleTestHelper");
const rSwap = artifacts.require("rSwap");
const rHEGIC = artifacts.require("rHEGIC");
const HEGIC = artifacts.require("HEGIC");

const increaseTime = time => web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_increaseTime",
    params: [time],
    id: 0
}).then(() => web3.currentProvider.send({
    jsonrpc: "2.0",
    method: "evm_mine",
    id: 123
}))


contract('rSwap: fallback', (accounts) => {
  it('should revert HEGIC tokens only from owner account', async () => {
    const rSwapInstance = await rSwap.deployed();
    const HEGICInstance = await HEGIC.deployed();
    await rSwapInstance.withdrawERC20(HEGIC.address, {from:accounts[1]}).then(
      () => assert.revert("tokens was withdrawn"),
      x => assert.equal(x.reason, 'Ownable: caller is not the owner1')
    );
  })

  it('should revert HEGIC tokens', async () => {
    const rSwapInstance = await rSwap.deployed();
    const HEGICInstance = await HEGIC.deployed();
    const startBalance = await HEGICInstance.balanceOf(accounts[0])
    await rSwapInstance.withdrawERC20(HEGIC.address);
    const balance = await HEGICInstance.balanceOf(accounts[0])

    assert.equal(
      balance.sub(startBalance).toString(),
      "100000000000000000000000",
      "10000 wasn't in the first account"
    );
  })
})

contract('rSwap', (accounts) => {
  it('should has 100 000 HEGIC', async () => {
    const rSwapInstance = await rSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();

    const balance = await HEGICInstance.balanceOf(rSwapInstance.address);

    assert.equal(balance.toString(), "100000000000000000000000");
  });

  it('should unlock all', async () => {
    const rSwapInstance = await rSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();

    await helper.advanceTimeAndBlock(7*24*3600 + 1);

    const totalUnlockedAmount = await rSwapInstance.totalUnlockedAmount();

    assert.equal(totalUnlockedAmount.toString(), "100000000000000000000000");
  });

  it("should unlock tokens gradually", async () => {

  })

});
