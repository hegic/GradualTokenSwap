const {advanceTimeAndBlock} = require("./helpers/truffleTestHelper");
const { BN } = require('./helpers/BN')

const GradualTokenSwap = artifacts.require("GradualTokenSwap");
const rHEGIC = artifacts.require("rHEGIC");
const HEGIC = artifacts.require("HEGIC");


contract('ERC20Recovery', (accounts) => {
  it('should revert HEGIC tokens only from owner account', async () => {
    const GradualTokenSwapInstance = await GradualTokenSwap.deployed();
    const HEGICInstance = await HEGIC.deployed();
    await GradualTokenSwapInstance.recoverERC20(HEGIC.address, {from:accounts[1]}).then(
      () => assert.revert("tokens was withdrawn"),
      x => assert.equal(x.reason, 'Ownable: caller is not the owner')
    );
  })

  it('should revert HEGIC tokens', async () => {
    const GradualTokenSwapInstance = await GradualTokenSwap.deployed();
    const HEGICInstance = await HEGIC.deployed();
    const startBalance = await HEGICInstance.balanceOf(accounts[0])
    await GradualTokenSwapInstance.recoverERC20(HEGIC.address);
    const balance = await HEGICInstance.balanceOf(accounts[0])

    assert.equal(
      balance.sub(startBalance).toString(),
      "1000000000000000000000000",
      "10000 wasn't in the first account"
    );
  })
})

contract('GradualTokenSwap', (accounts) => {

  it('should has 1 000 000 HEGIC', async () => {
    const GradualTokenSwapInstance = await GradualTokenSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();

    const balance = await HEGICInstance.balanceOf(GradualTokenSwapInstance.address);

    assert.equal(balance.toString(), "1000000000000000000000000");
  });

  it('should receive rHEGIC tokens', async () => {
    const GTS = await GradualTokenSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();
    const amount = BN(250_000).e(18).toString()

    const startBalance = await rHEGICInstance.balanceOf(accounts[0])

    await rHEGICInstance.approve(GradualTokenSwap.address, amount)
    await GTS.provide(amount)

    await rHEGICInstance.balanceOf(accounts[0])
      .then(x => startBalance.sub(x).toString())
      .then(d => assert.equal(d, amount))

    await GTS.provided(accounts[0]).then(
      x => assert.equal(x.toString(), amount, "Provided amount is wrong")
    )
  })

  it('should receive rHEGIC tokens again', async () => {
    const GTS = await GradualTokenSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();
    const amount = BN(750_000).e(18).toString();
    const totalAmount = BN(1_000_000).e(18).toString()

    const startBalance = await rHEGICInstance.balanceOf(accounts[0])

    await rHEGICInstance.approve(GradualTokenSwap.address, amount)
    await GTS.provide(amount)

    await rHEGICInstance.balanceOf(accounts[0])
      .then(x => startBalance.sub(x).toString())
      .then(d => assert.equal(d, amount))

    await GTS.provided(accounts[0]).then(
      x => assert.equal(x.toString(), totalAmount, "Provided amount is wrong")
    )
  })

  it('should unlock funds gradually (20%)', async () => {
    const GTS = await GradualTokenSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();

    const expected = BN(200_000).e(18)

    await advanceTimeAndBlock(36*24*3600);
    const diff = await GTS.unlocked(accounts[0]).then(x => x.sub(expected))
    await GTS.withdraw()

    assert.isAbove(+diff, 0, "Too small amount was unlocked")
    assert.isBelow(+diff, 1e18, "Too large amount was unlocked")
  })

  it('should unlock funds gradually (40%)', async () => {
    const GTS = await GradualTokenSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();

    const expected = BN(400_000).e(18)

    await advanceTimeAndBlock(36*24*3600);
    const diff = await GTS.unlocked(accounts[0]).then(x => x.sub(expected))
    await GTS.withdraw()

    assert.isAbove(+diff, 0, "Too small amount was unlocked")
    assert.isBelow(+diff, 1e18, "Too large amount was unlocked")
  })

  it('should unlock funds gradually (60%)', async () => {
    const GTS = await GradualTokenSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();

    const expected = BN(600_000).e(18)

    await advanceTimeAndBlock(36*24*3600);
    const diff = await GTS.unlocked(accounts[0]).then(x => x.sub(expected))
    assert.isAbove(+diff, 0, "Too small amount was unlocked")
    assert.isBelow(+diff, 1e18, "Too large amount was unlocked")
  })

  it('should unlock funds gradually (80%)', async () => {
    const GTS = await GradualTokenSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();

    const expected = BN(800_000).e(18)

    await advanceTimeAndBlock(36*24*3600);
    const diff = await GTS.unlocked(accounts[0]).then(x => x.sub(expected))
    await GTS.withdraw()

    assert.isAbove(+diff, 0, "Too small amount was unlocked")
    assert.isBelow(+diff, 1e18, "Too large amount was unlocked")
  })

  it('should unlock funds gradually (100%)', async () => {
    const GTS = await GradualTokenSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();

    const expected = BN(1_000_000).e(18)

    await advanceTimeAndBlock(36*24*3600);
    const unlocked = await GTS.unlocked(accounts[0])
    await GTS.withdraw()
    assert.equal(unlocked, expected.toString(), "Wrong token amount unlocked")
  })

  it('should unlock 100% HEGIC tokens after GTS ended', async () => {
    const GTS = await GradualTokenSwap.deployed();
    const rHEGICInstance = await rHEGIC.deployed();
    const HEGICInstance = await HEGIC.deployed();
    const amount = BN(1_000_000).e(18)

    const userUnlockedAmount = await GTS.unlocked(accounts[0]);
    assert.equal(userUnlockedAmount.toString(), amount.toString());
    const balance = await HEGICInstance.balanceOf(accounts[0]);
    assert.equal(balance.toString(),amount.toString())
  });
});
