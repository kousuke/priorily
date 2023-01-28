import { Network, Alchemy } from "alchemy-sdk"
import { ReactNode, useCallback, useEffect, useMemo } from "react"
import { RecoilState, useRecoilState, useRecoilValue } from "recoil"
import { contractAddressStore } from "src/components/stores/contract-address-store"
import { logEventStore } from "src/components/stores/log-event"

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  network: Network.ETH_GOERLI,
}

const alchemy = new Alchemy(settings)

const priorilyEvents = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  // topics: [
  //   "0xee27ffb887702416f6146e145368449cfb9dacbeb36d0b2ea57d18a7a4ec64db",
  //   "0x14d0d038b1968c9d2e30b3bf8f753bacacfc951f61b1a7ede9c9606ff58ab699",
  //   "0xb63e8d8c96d4a28afdbc5a8503cfd7b7c8b78c5e6190a7dccb52db654c1f8cb4",
  // ],
}
interface EthEventListenerProps {
  children: ReactNode
}
const EthEventListener = ({ children }: EthEventListenerProps) => {
  const [, setLogEvent] = useRecoilState(logEventStore)
  const contractAddress = useRecoilValue(contractAddressStore)

  const priorilyEvents = useMemo(() => {
    return {
      address: contractAddress,
    }
  }, [contractAddress])

  const callback = useCallback(
    (txn) => {
      console.log("event", txn)
      setLogEvent([txn])
    },
    [setLogEvent]
  )

  useEffect(() => {
    if (typeof window === "undefined") return
    console.log("start linstening event")
    alchemy.ws.on(priorilyEvents, callback)
    return () => {
      alchemy.ws.off(priorilyEvents, callback)
    }
  }, [callback, priorilyEvents])

  return <>{children}</>
}

export default EthEventListener
function useSetRecoilValue(logEventStore: RecoilState<any[]>) {
  throw new Error("Function not implemented.")
}
