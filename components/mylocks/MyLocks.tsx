import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { ethers } from 'ethers'
import {
  getUserLockers,
  LockerInfo2,
  getLockerContract,
} from '../../backend/locker'
import storeCommon from '../common/common.store'

export default function MyLocks() {
  const chainId = storeCommon((state) => state.chainId)
  const account = storeCommon((state) => state.account)
  const provider = storeCommon((s) => s.provider)
  const [isFetching, setIsFetching] = useState(false)
  const [tokenLocks, setTokenLocks] = useState<LockerInfo2[]>([])

  useEffect(() => {
    loadLockers()
    console.log('chainid', provider._network.chainId)
  }, [chainId, account, provider._network.chainId])

  const loadLockers = async () => {
    if (window.ethereum && provider) {
      setIsFetching(true)
      const { fetchedLockers, userLockersInfoArr } = await getUserLockers(
        provider.getSigner()
      )
      if (fetchedLockers) {
        setTokenLocks(userLockersInfoArr)
      }
      setIsFetching(false)
    }
  }

  const getDate = (timeInSeconds: ethers.BigNumber) => {
    const timeInMilliSeconds = timeInSeconds.toNumber() * 1000
    const date1 = new Date()
    date1.setTime(timeInMilliSeconds)
    return date1.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const withdrawTokens = async (_lockerId: ethers.BigNumber) => {
    try {
      const signer = provider.getSigner()
      const chainId = await signer.getChainId()
      const lockerContract = getLockerContract(signer, chainId)
      const txn = await lockerContract.destroyLocker(_lockerId)
      await txn.wait(1)
      loadLockers()
    } catch (err) {
      console.log(err)
      alert('Problem occurred while unlocking tokens.')
    }
  }

  const Lockers = () => {
    return (
      <>
        {tokenLocks.length > 0 ? (
          tokenLocks.map(
            (
              { lockTime, unlockTime, tokenSymbol, tokenAmount2, lockerId },
              idx
            ) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  margin: '10px 10px 0px 0',
                }}
              >
                <Box>
                  <Typography>{`Amount: ${tokenAmount2}  ${
                    tokenSymbol.length ? tokenSymbol : 'FTM'
                  }`}</Typography>

                  <Typography>{`Locked ${getDate(lockTime)}`}</Typography>
                  <Typography>{`Unlocks ${getDate(unlockTime)}`}</Typography>
                </Box>

                <Box sx={{ alignSelf: 'flex-end', margin: '7px' }}>
                  <Button
                    variant="contained"
                    onClick={() => withdrawTokens(lockerId)}
                    disabled={Date.now() < unlockTime.toNumber() * 1000}
                  >
                    Withdraw
                  </Button>
                </Box>
              </Box>
            )
          )
        ) : (
          <Typography>No Tokens Locked.</Typography>
        )}
      </>
    )
  }

  return (
    <>
      <Stack mb={4}>
        <Typography variant="h5" mt={4}>
          My Locks
        </Typography>

        {isFetching ? <CircularProgress /> : <Lockers />}
      </Stack>
    </>
  )
}
