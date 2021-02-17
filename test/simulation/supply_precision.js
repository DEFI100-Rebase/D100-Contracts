/*
    In this buidler script,
    During every iteration:
    * We double the total BASE supply.
    * We test the following guarantee:
            - the difference in totalSupply() before and after the rebase(+1) should be exactly 1.

    USAGE:
    buidler run ./test/simulation/supply_precision.js
*/

const { ethers, web3, upgrades, expect, BigNumber, isEthException, awaitTx, waitForSomeTime, currentTime, toBASEDenomination } = require('../setup')

const endSupply = BigNumber.from(2).pow(128).sub(1)

let baseToken, preRebaseSupply, postRebaseSupply
preRebaseSupply = BigNumber.from(0)
postRebaseSupply = BigNumber.from(0)

async function exec() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
    const BaseToken = await ethers.getContractFactory('BaseToken')
    baseToken = await upgrades.deployProxy(BaseToken, [])
    await baseToken.deployed()
    baseToken = baseToken.connect(deployer)
    await awaitTx(baseToken.setMonetaryPolicy(await deployer.getAddress()))

    let i = 0
    do {
        console.log('Iteration', i + 1)

        preRebaseSupply = await baseToken.totalSupply()
        await awaitTx(baseToken.rebase(2 * i, 1))
        postRebaseSupply = await baseToken.totalSupply()
        console.log('Rebased by 1 BASE')
        console.log('Total supply is now', postRebaseSupply.toString(), 'BASE')

        console.log('Testing precision of supply')
        expect(postRebaseSupply.sub(preRebaseSupply).toNumber()).to.equal(1)

        console.log('Doubling supply')
        await awaitTx(baseToken.rebase(2 * i + 1, postRebaseSupply))
        i++
    } while ((await baseToken.totalSupply()).lt(endSupply))
}

exec()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

