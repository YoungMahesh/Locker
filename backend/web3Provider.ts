import { ethers } from 'ethers'
import { messagesTable } from './utils'

declare global {
  interface Window {
    signer: ethers.Signer
    chainId: number
    wallet: string
  }
}

export const BNF = ethers.BigNumber.from
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' // '0x' + '0'.repeat(40)

export const handleAccountChanged = (
  accounts: string[],
  setAccount: Function,
  setAccountMsg: Function
) => {
  if (accounts.length > 0) {
    setAccount(accounts[0])
    setAccountMsg('')
  } else {
    setAccount('')
    setAccountMsg(messagesTable.METAMASK_LOCKED)
  }
}

export const getExplorerUrls = (_chainId: number) => {
  if (_chainId === 4002) return 'https://testnet.ftmscan.com/tx/'
  return ''
}
export const getTokenUrlPrefix = (_chainId: number) => {
  if (_chainId === 4002) return 'https://testnet.ftmscan.com/token/'
  return ''
}

export const convertEthToWei = (_amountInEth: string): ethers.BigNumber => {
  try {
    return ethers.utils.parseEther(_amountInEth)
  } catch (err) {
    console.log(err)
    return BNF('0')
  }
}
