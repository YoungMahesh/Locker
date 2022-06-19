import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import LinearProgress from '@mui/material/LinearProgress'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { btnTextTable, tokenTypeOf } from '../../backend/utils'
import { Send as SendIcon } from '@mui/icons-material'
import { useState } from 'react'
import TokenTypeSelector from './TokenTypeSelector'
import { TokenTypes1 } from '../../backend/utils'
import storeCommon from '../common/common.store'
import { getErc20Approval, getErc20Decimals } from '../../backend/erc20'
import { ethers } from 'ethers'
import {
  getLockerContractAddr,
  transferTokensToLocker,
} from '../../backend/locker'
import { getErc721Approval } from '../../backend/erc721'
import { getErc1155Approval } from '../../backend/erc1155'
import { BNF, ZERO_ADDRESS } from '../../backend/web3Provider'

export default function LockTokens() {
  const provider = storeCommon((s) => s.provider)
  const chainId = storeCommon((state) => state.chainId)
  const account = storeCommon((s) => s.account)

  const [tokenType, setTokenType] = useState<TokenTypes1>('ERC20')
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [lockAmount, setLockAmount] = useState('')
  const [unlockDate, setUnlockDate] = useState(new Date())

  const [btnText, setBtnText] = useState(btnTextTable.LOCK)

  const handleLocking = async () => {
    if (!account.length) return alert('Wallet is not connected')
    try {
      let decimals = 0
      if (tokenType === 'ETH') decimals = 18
      if (tokenType === 'ERC20') {
        decimals = await getErc20Decimals(provider.getSigner(), tokenAddress)
        if (decimals === -1) {
          setBtnText(btnTextTable.LOCK)
          return
        }
      }

      setBtnText(btnTextTable.APPROVING)
      const lockAmount1 = tokenType === 'ERC721' ? '1' : lockAmount
      const amountInWei = ethers.utils.parseUnits(lockAmount1, decimals)
      const lockerAddr = getLockerContractAddr(chainId)
      let isApproved = true
      if (tokenType === 'ERC20') {
        isApproved = await getErc20Approval(
          tokenAddress,
          lockerAddr,
          amountInWei,
          provider.getSigner()
        )
      } else if (tokenType === 'ERC721') {
        isApproved = await getErc721Approval(
          tokenAddress,
          lockerAddr,
          provider.getSigner()
        )
      } else if (tokenType === 'ERC1155') {
        console.log('before exe')
        isApproved = await getErc1155Approval(
          tokenAddress,
          lockerAddr,
          provider.getSigner()
        )
        console.log('after exe')
      }
      if (!isApproved) {
        setBtnText(btnTextTable.LOCK)
        return
      }

      setBtnText(btnTextTable.LOCKING)
      const tokenId1 =
        tokenType === 'ERC721' || tokenType === 'ERC1155'
          ? BNF(tokenId)
          : BNF('0')
      const tokenAddress1 = tokenType === 'ETH' ? ZERO_ADDRESS : tokenAddress
      const amountInWei1 = tokenType === 'ERC721' ? BNF('1') : amountInWei
      console.log({
        type: tokenTypeOf[tokenType],
        tokenAddress1,
        tokenId1,
        amountInWei1,
        unlockDate,
      })
      const { isLocked, hash } = await transferTokensToLocker(
        tokenTypeOf[tokenType],
        tokenAddress1,
        tokenId1,
        amountInWei1,
        unlockDate,
        provider.getSigner()
      )

      if (!isLocked) {
        setBtnText(btnTextTable.LOCK)
        return
      }
      window.location.reload()
    } catch (err) {
      console.log(err)
      alert('Got Problem while locking')
      setBtnText(btnTextTable.LOCK)
    }
  }

  return (
    <Stack spacing={3} maxWidth="400px">
      <TokenTypeSelector tokenType={tokenType} setTokenType={setTokenType} />
      {(tokenType === 'ERC20' ||
        tokenType === 'ERC721' ||
        tokenType === 'ERC1155') && (
        <TextField
          fullWidth
          id="standard-basic"
          label="Token Address"
          variant="standard"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      )}

      {(tokenType === 'ERC721' || tokenType === 'ERC1155') && (
        <TextField
          id="standard-basic"
          label="Token Id"
          variant="standard"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
      )}

      {(tokenType === 'ETH' ||
        tokenType === 'ERC20' ||
        tokenType === 'ERC1155') && (
        <TextField
          id="standard-basic"
          label="Lock Amount"
          variant="standard"
          value={lockAmount}
          onChange={(e) => setLockAmount(e.target.value)}
        />
      )}

      <FormControl component="fieldset">
        <FormLabel component="legend">Unlock Date: </FormLabel>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDateTimePicker
            renderInput={(params: any) => <TextField {...params} />}
            value={unlockDate}
            onChange={(e) => setUnlockDate}
          />
        </LocalizationProvider>
      </FormControl>

      <Button
        onClick={handleLocking}
        disabled={
          btnText === btnTextTable.APPROVING || btnText === btnTextTable.LOCKING
        }
        variant="contained"
        endIcon={<SendIcon />}
      >
        {btnText}
      </Button>
      {(btnText === btnTextTable.APPROVING ||
        btnText === btnTextTable.SENDING) && <LinearProgress />}
    </Stack>
  )
}
