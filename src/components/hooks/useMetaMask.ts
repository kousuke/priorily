import { useCallback, useEffect, useMemo, useState } from "react"
import { useRecoilState } from "recoil"
import { eoaStore } from "../stores/eoa-store"

const useMetaMask = () => {
  const [eoa, setEoa] = useRecoilState(eoaStore)
  const hasMetaMask = useMemo(() => {
    if (typeof window === "undefined") return true
    if (typeof (window as unknown as any).ethereum === "undefined") return false
    return true
  }, [])

  const connect = useCallback(async () => {
    if (typeof window === "undefined") return
    const accounts = await (window as unknown as any).ethereum.request({
      method: "eth_requestAccounts",
    })
    console.log("eth_requestAccounts", accounts)
    setEoa(accounts[0])
  }, [setEoa])

  return { connect, hasMetaMask, eoa }
}

export default useMetaMask
