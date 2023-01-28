// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("ethers")
const contractJsonData = require("../artifacts/contracts/Priorily.sol/Priorily.json")
require("dotenv").config({ path: __dirname + "/../.env" })

async function main() {
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_TOKEN,
  })
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  const contractFactory = new ethers.ContractFactory(
    contractJsonData.abi,
    contractJsonData.bytecode,
    wallet
  )

  const priorily = await contractFactory.deploy(process.env.GOERLI_TREASURY_ADDRESS)

  await priorily.deployTransaction.wait([(confirms = 1)])
  const contractAddress = priorily.address
  console.log(`Priorily deployed to ${contractAddress}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
