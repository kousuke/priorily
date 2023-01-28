import { atom } from "recoil"

if (!process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) throw Error("CONTRACT_ADDRESS not found")
export const contractAddressStore = atom<string>({
  key: `contractAddress`,
  default: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
})
