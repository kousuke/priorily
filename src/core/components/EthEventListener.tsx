import { Network, Alchemy } from "alchemy-sdk"
import { ReactNode, useCallback, useEffect, useMemo } from "react"
import { RecoilState, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { contractAddressStore } from "src/components/stores/contract-address-store"
import { logEventStore } from "src/components/stores/log-event"

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  network: Network.ETH_GOERLI,
}

const alchemy = new Alchemy(settings)

interface EthEventListenerProps {
  children: ReactNode
}
const EthEventListener = ({ children }: EthEventListenerProps) => {
  const setLogEvent = useSetRecoilState(logEventStore)
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
