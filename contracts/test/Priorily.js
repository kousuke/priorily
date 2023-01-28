// const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect, assert, assertThrows } = require("chai")

async function expectThrow(promise) {
  try {
    await promise
  } catch (err) {
    return
  }
  assert(false, "Expected the transaction to revert!")
}

describe("Priorily treasury check", function () {
  let treasury, superOwner, contract

  before(async () => {
    treasury = await ethers.provider.getSigner(1)
    superOwner = await ethers.provider.getSigner(2)

    const Priorily = await ethers.getContractFactory("Priorily", superOwner)
    contract = await Priorily.deploy(await treasury.getAddress())
    await contract.deployed()
  })

  describe("treasury check", () => {
    it("treasury is correct by initiation", async () => {
      let currrentTreasury = await contract.connect(treasury).treasury()
      assert.equal(currrentTreasury, await treasury.getAddress())
    })

    it("cant change treasury by someone", async () => {
      let currrentTreasury = await contract
        .connect(superOwner)
        .isTreasury(await treasury.getAddress())
      assert.isTrue(currrentTreasury)

      expectThrow(
        contract.connect(superOwner).setTreasury(await superOwner.getAddress()),
        "Expected transaction to revert!."
      )
    })

    describe("reset treasury by treasury", () => {
      before(async () => {
        let currrentTreasury = await contract.connect(treasury).treasury()
        assert.equal(currrentTreasury, await treasury.getAddress())
        await contract.connect(treasury).setTreasury(await superOwner.getAddress())
      })

      it("treasury changed", async () => {
        let isTreasuryResult = await contract
          .connect(superOwner)
          .isTreasury(await superOwner.getAddress())
        assert.isTrue(isTreasuryResult, "address is not treasuery address")
      })
    })
  })
})

// describe("Priorily Owner check", function () {
//   let treasury,
//     superOwner,
//     owners = [],
//     voters = [],
//     contract

//   before(async () => {
//     let s = 1
//     treasury = await ethers.provider.getSigner(s++)
//     superOwner = await ethers.provider.getSigner(s++)

//     for (let i = 0; i < 5; i++) {
//       owners[i] = await ethers.getSigners(s++)
//       voters[i] = await ethers.getSigners(s++)
//     }

//     const Priorily = await ethers.getContractFactory("Priorily", treasury)
//     contract = await Priorily.deploy(await superOwner.getAddress())
//     await contract.deployed()
//   })

//   describe("Owner initial", () => {
//     it("no owner", async () => {
//       for (let i = 0; i < owners.length; i++) {
//         let ownersResult = await contract.connect(superOwner).isOwner(await owners[i].getAddress())
//         assert.isFalse(ownersResult)
//       }
//     })
//   })
// })

describe("Priorily owner check ", function () {
  let treasury,
    superOwner,
    owners = [],
    voters = [],
    contract

  before(async () => {
    let s = 1
    treasury = await ethers.provider.getSigner(s++)
    superOwner = await ethers.provider.getSigner(s++)

    for (let i = 0; i < 5; i++) {
      owners[i] = await ethers.provider.getSigner(s++)
      voters[i] = await ethers.provider.getSigner(s++)
    }

    const Priorily = await ethers.getContractFactory("Priorily", superOwner)
    contract = await Priorily.deploy(await treasury.getAddress())
    await contract.deployed()
  })

  describe("superOwner can add owners", () => {
    before(async () => {
      for (let i = 0; i < owners.length; i++) {
        await contract.connect(superOwner).addOwner(owners[i].getAddress())
      }
    })

    it("owner added", async () => {
      for (let i = 0; i < owners.length; i++) {
        let ownersResult = await contract.connect(superOwner).isOwner(owners[i].getAddress())
        assert.isTrue(ownersResult)
      }
    })
  })

  describe("non owner can not add owners", () => {
    before(async () => {
      for (let i = 0; i < voters.length; i++) {
        expectThrow(
          contract.connect(voters[i]).addOwner(voters[i].getAddress()),
          "Expected transaction to revert!."
        )
      }
    })
  })
})

describe("Priorily Plan check ", function () {
  let treasury,
    superOwner,
    owners = [],
    voters = [],
    contract,
    treasuryBalance,
    beforeBalance = {},
    afterBalance = {}
  before(async () => {
    let s = 1
    treasury = await ethers.provider.getSigner(s++)
    superOwner = await ethers.provider.getSigner(s++)

    for (let i = 0; i < 5; i++) {
      owners[i] = await ethers.provider.getSigner(s++)
      voters[i] = await ethers.provider.getSigner(s++)
    }

    const Priorily = await ethers.getContractFactory("Priorily", superOwner)
    contract = await Priorily.deploy(await treasury.getAddress())
    await contract.deployed()

    for (let i = 0; i < owners.length; i++) {
      await contract.connect(superOwner).addOwner(await owners[i].getAddress())
    }
    treasuryBalance = await ethers.provider.getBalance(await treasury.getAddress())
  })

  describe("Owner can add Plan", () => {
    before(async () => {
      for (let i = 0; i < owners.length; i++) {
        beforeBalance[i] = await ethers.provider.getBalance(await treasury.getAddress())
        await contract
          .connect(owners[i])
          .createPlan(`plan ${i}`, i, { value: ethers.utils.parseEther("1") })
        afterBalance[i] = await ethers.provider.getBalance(await treasury.getAddress())
      }
    })

    it("plan added", async () => {
      for (let i = 0; i < owners.length; i++) {
        let plan = await contract.connect(voters[0]).getPlan(i)
        assert.equal(plan.planId, i)
        assert.equal(plan.title, `plan ${i}`)
        assert.equal(plan.status, 0)
        assert.equal(plan.voters.length, 0)
        assert.equal(plan.owner, await owners[i].getAddress())
      }
    })

    it("tresuary has earning", async () => {
      for (let i = 0; i < owners.length; i++) {
        assert.equal(
          afterBalance[i].sub(beforeBalance[i]).toString(),
          ethers.utils.parseEther("1").toString()
        )
      }
    })

    describe("Owner can change Plan status", () => {
      before(async () => {
        for (let i = 0; i < 3; i++) {
          await contract.connect(owners[i]).changePlanStatus(i, 2)
        }
      })

      it("plan status changed", async () => {
        for (let i = 0; i < 10; i++) {
          let plan = await contract.connect(voters[0]).getPlan(i)
          if (i < 3) {
            assert.equal(plan.status, 2)
          } else {
            assert.equal(plan.status, 0)
          }
        }
      })
    })

    describe("No-owner cannot change Plan status", () => {
      before(async () => {
        for (let i = 0; i < voters.length; i++) {
          expectThrow(
            contract.connect(voters[i]).changePlanStatus(i, 2),
            "Expected transaction to revert!."
          )
        }
      })
    })

    describe("Owner can change Plan title", () => {
      before(async () => {
        for (let i = 0; i < owners.length; i++) {
          await contract.connect(owners[0]).changePlanText(i, `plan ${i} edited`)
        }
      })

      it("plan title changed", async () => {
        for (let i = 0; i < owners.length; i++) {
          let plan = await contract.connect(voters[0]).getPlan(i)
          assert.equal(plan.title, `plan ${i} edited`)
        }
      })
    })

    describe("No-owner cannot change Plan title", () => {
      before(async () => {
        for (let i = 0; i < voters.length; i++) {
          expectThrow(
            contract.connect(voters[i]).changePlanTitle(i, ""),
            "Expected transaction to revert!."
          )
        }
      })
    })
  })
})
// async function deployOneYearLockFixture() {
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60
//   const ONE_GWEI = 1_000_000_000

//   const lockedAmount = ONE_GWEI
//   const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS

//   // Contracts are deployed using the first signer/account by default
//   const [owner, otherAccount] = await ethers.getSigners()

//   const Lock = await ethers.getContractFactory("Lock")
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount })

//   return { lock, unlockTime, lockedAmount, owner, otherAccount }
// }

// describe("Deployment", function () {
//   it("Should set the right unlockTime", async function () {
//     const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture)

//     expect(await lock.unlockTime()).to.equal(unlockTime)
//   })

//   it("Should set the right owner", async function () {
//     const { lock, owner } = await loadFixture(deployOneYearLockFixture)

//     expect(await lock.owner()).to.equal(owner.address)
//   })

//   it("Should receive and store the funds to lock", async function () {
//     const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture)

//     expect(await ethers.provider.getBalance(lock.address)).to.equal(lockedAmount)
//   })

//   it("Should fail if the unlockTime is not in the future", async function () {
//     // We don't use the fixture here because we want a different deployment
//     const latestTime = await time.latest()
//     const Lock = await ethers.getContractFactory("Lock")
//     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//       "Unlock time should be in the future"
//     )
//   })
//})

// describe("Withdrawals", function () {
//   describe("Validations", function () {
//     it("Should revert with the right error if called too soon", async function () {
//       const { lock } = await loadFixture(deployOneYearLockFixture)

//       await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet")
//     })

//     it("Should revert with the right error if called from another account", async function () {
//       const { lock, unlockTime, otherAccount } = await loadFixture(deployOneYearLockFixture)

//       // We can increase the time in Hardhat Network
//       await time.increaseTo(unlockTime)

//       // We use lock.connect() to send a transaction from another account
//       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//         "You aren't the owner"
//       )
//     })

//     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//       const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture)

//       // Transactions are sent using the first signer by default
//       await time.increaseTo(unlockTime)

//       await expect(lock.withdraw()).not.to.be.reverted
//     })
//   })

//   describe("Events", function () {
//     it("Should emit an event on withdrawals", async function () {
//       const { lock, unlockTime, lockedAmount } = await loadFixture(deployOneYearLockFixture)

//       await time.increaseTo(unlockTime)

//       await expect(lock.withdraw()).to.emit(lock, "Withdrawal").withArgs(lockedAmount, anyValue) // We accept any value as `when` arg
//     })
//   })

//   describe("Transfers", function () {
//     it("Should transfer the funds to the owner", async function () {
//       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//         deployOneYearLockFixture
//       )

//       await time.increaseTo(unlockTime)

//       await expect(lock.withdraw()).to.changeEtherBalances(
//         [owner, lock],
//         [lockedAmount, -lockedAmount]
//       )
//     })
//   })
// })
