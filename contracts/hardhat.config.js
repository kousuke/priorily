require("@nomicfoundation/hardhat-toolbox")
require("dotenv").config({ path: __dirname + "/.env" })

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `${process.env.ALCHEMY_API_URL}`,
      accconts: [`${process.env.ALCHEMY_API_TOKEN}`],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}
