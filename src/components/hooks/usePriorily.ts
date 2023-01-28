import { useMemo } from "react"
import useMetaMask from "./useMetaMask"
import Web3 from "web3"
import { ethers } from "ethers"
import { useRecoilValue } from "recoil"
import { contractAddressStore } from "../stores/contract-address-store"
const contractABI = require("../../../contracts/artifacts/contracts/Priorily.sol/Priorily.json")

if (!process.env.NEXT_PUBLIC_ALCHEMY_API) throw new Error("need ALCHEMY_API")
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_ALCHEMY_API))

export type PlanStatus = "planned" | "inProgress" | "backlog" | "done" | "suggested"
export interface Plan {
  planId: number
  title: string
  planType: number
  status: PlanStatus
  voters: string[]
  owner: string
}
const ToTsPlanStatus = (status: string) => {
  switch (status) {
    case "0":
      return "planned"
    case "1":
      return "inProgress"
    case "2":
      return "backlog"
    case "3":
      return "done"
    case "4":
      return "suggested"
    default:
      console.error("unknown plan status", status)
      return "done"
  }
}

const ToSolidityPlanStatus = (status: PlanStatus) => {
  switch (status) {
    case "planned":
      return 0
    case "inProgress":
      return 1
    case "backlog":
      return "2"
    case "done":
      return 3
    case "suggested":
      return 4
    default:
      console.error("unknown plan status", status)
      return 3
  }
}

const valueOfDeploy = "0x9184e72a"
const usePriorily = () => {
  const { eoa } = useMetaMask()
  const cotractAddress = useRecoilValue(contractAddressStore)
  const ethereum = useMemo(
    () => (typeof window === "undefined" ? {} : ((window as unknown as any).ethereum as any)),
    []
  )
  const priorilyContract = useMemo(() => new web3.eth.Contract(contractABI.abi, cotractAddress), [])

  const getPlans = async () => {
    const plans = await priorilyContract.methods.getPlans().call()
    console.log("getPlans", plans)

    const tsPlans = plans.map((p) => {
      return {
        planId: p[0],
        title: p[1],
        planType: parseInt(p[2]),
        status: ToTsPlanStatus(p[3]),
        voters: p[4],
        owner: p[5],
      } as Plan
    })
    console.log("getPlans", tsPlans)
    return tsPlans
  }

  const vote = async (planId: number) => {
    try {
      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: cotractAddress,
            from: eoa,
            data: priorilyContract.methods.vote(planId).encodeABI(),
            value: "0x9184e72a",
          },
        ],
      })
      console.log("vote", txHash)
    } catch (err) {
      console.log(err)
    }
  }
  const changePlanStatus = async (planId: number, status: PlanStatus) => {
    try {
      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: cotractAddress,
            from: eoa,
            data: priorilyContract.methods
              .changePlanStatus(planId, ToSolidityPlanStatus(status))
              .encodeABI(),
          },
        ],
      })
      console.log("changePlanStatus", txHash)
    } catch (err) {
      console.log(err)
    }
  }

  const savePlan = async (planId: number, title: string, planType: number) => {
    try {
      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: cotractAddress,
            from: eoa,
            data: priorilyContract.methods.savePlan(planId, title, planType).encodeABI(),
          },
        ],
      })
      console.log("savePlan", txHash)
    } catch (err) {
      console.log(err)
    }
  }
  const createPlan = async (title: string, playType: number) => {
    try {
      const chainId = await ethereum.request({ method: "eth_chainId" })
      console.log("chainId", chainId)

      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: cotractAddress,
            from: eoa,
            value: "0x9184e72a",
            data: priorilyContract.methods.createPlan(title, playType).encodeABI(),
            chainId,
          },
        ],
      })
      console.log("createPlan", txHash)
    } catch (err) {
      console.log(err)
    }
  }

  const suggestPlan = async (title: string, playType: number) => {
    try {
      const chainId = await ethereum.request({ method: "eth_chainId" })
      console.log("chainId", chainId)

      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            to: cotractAddress,
            from: eoa,
            value: "0x9184e72a",
            data: priorilyContract.methods.suggestPlan(title, playType).encodeABI(),
            chainId,
          },
        ],
      })
      console.log("suggestPlan", txHash)
    } catch (err) {
      console.log(err)
    }
  }

  const isOwner = async (address: string) => {
    const result = await priorilyContract.methods.isOwner(address).call()
    console.log("isOwner", result)
    return result
  }

  return useMemo(() => {
    return {
      getPlans,
      createPlan,
      isOwner,
      changePlanStatus,
      vote,
      suggestPlan,
      savePlan,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default usePriorily
