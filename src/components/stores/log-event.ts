import { atom } from "recoil"

export const logEventStore = atom<any[]>({
  key: `logEvent`,
  default: [],
})
