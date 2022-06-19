import create from 'zustand'
import { PaletteMode } from '@mui/material'
import { ethers } from 'ethers'

export type Network1 = 'mainnet' | 'testnet'
export type Step1 = 1 | 2 | 3
export const defaultProvider = new ethers.providers.JsonRpcProvider(
  'https://rpc.testnet.fantom.network'
)
interface globalState {
  provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider
  setProvider: (_provider: globalState['provider']) => void

  chainId: number
  setChainId: (_id: number) => void

  account: string
  setAccount: (_wallet: string) => void

  isLoading: boolean
  setIsLoading: (val: boolean) => void

  mode: PaletteMode
  setMode: (_mode: PaletteMode) => void

  step: Step1
  setStep: (_step: Step1) => void
}

const storeCommon = create<globalState>((set) => ({
  provider: defaultProvider,
  setProvider: (_provider) => set((state) => ({ provider: _provider })),
  chainId: 0,
  setChainId: (_id) => set((state) => ({ chainId: _id })),

  account: '',
  setAccount: (_accouont) => set((state) => ({ account: _accouont })),

  isLoading: false,
  setIsLoading: (_isLoading) => set((state) => ({ isLoading: _isLoading })),

  mode: 'dark',
  setMode: (_mode) => set((state) => ({ mode: _mode })),

  step: 1,
  setStep: (_step) => set((s) => ({ step: _step })),
}))

export default storeCommon
