import { atom } from "recoil"

export const eoaStore = atom<string | undefined>({
  key: `eoa`,
  default: undefined,
})
