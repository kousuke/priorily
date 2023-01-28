// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
require("dotenv").config({ path: __dirname + "/../.env" })
const contractJsonData = require("../artifacts/contracts/Priorily.sol/Priorily.json")

async function main() {
  console.log("OWNER_ADDRESS", process.env.OWNER_ADDRESS)
  console.log("TREASURY_ADDRESS", process.env.TREASURY_ADDRESS)

  const Priorily = await hre.ethers.getContractFactory("Priorily")
  const priorily = await Priorily.deploy(process.env.TREASURY_ADDRESS)

  await priorily.deployed()
  console.log(`Priorily deployed to ${priorily.address}`)
  //priorilyContract = new ethers.Contract(priorily.address,contractJsonData.abi)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
