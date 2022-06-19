import { ethers, Signer } from 'ethers'
import { BNF } from './web3Provider'

const erc20Abi = [
  'function name() public view returns (string memory)',
  'function symbol() public view returns (string memory)',
  'function decimals() public view returns (uint8)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function approve(address spender, uint256 amount) external returns (bool)',
]

export const getErc20Contract = (signer: Signer, tokenAddr: string) => {
  return new ethers.Contract(tokenAddr, erc20Abi, signer)
}

export const getErc20Decimals = async (
  signer: Signer,
  tokenAddress: string
) => {
  try {
    const erc20Contract = getErc20Contract(signer, tokenAddress)
    const decimals = await erc20Contract.decimals()
    return decimals
  } catch (err) {
    return -1
  }
}

export const getTotalSumOfBignumbers = (array: ethers.BigNumber[]) => {
  let totalAmount = BNF('0')
  for (let i = 0; i < array.length; i++) {
    totalAmount = totalAmount.add(array[i])
  }
  return totalAmount
}

export const getErc20Approval = async (
  tokenAddr: string,
  operator: string,
  amountInWei: ethers.BigNumber,
  signer: Signer
) => {
  try {
    const currUser = await signer.getAddress()
    console.log(currUser, operator, tokenAddr)
    const erc20Contract = getErc20Contract(signer, tokenAddr)

    const allowance: ethers.BigNumber = await erc20Contract.allowance(
      currUser,
      operator
    )
    console.log(allowance.toString(), amountInWei.toString())
    if (allowance.gte(amountInWei)) return true

    const txn = await erc20Contract.approve(operator, amountInWei)
    await txn.wait(1)
    return true
  } catch (err) {
    console.log(err)
    return false
  }
}
