import { useEffect, useState } from "react"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import { ethers } from "ethers"
import {
  getUserLockers,
  LockerInfo2,
  getLockerContractAddr,
  getLockerContract,
} from "../../backend/locker"
import storeCommon from "../common/common.store"

export default function MyLocks() {
  const chainId = storeCommon((state) => state.chainId)

  const account = storeCommon((state) => state.account)
  const provider = storeCommon((s) => s.provider)

  const [message1, setMessage1] = useState("")

  const [isFetching, setIsFetching] = useState(false)
  const [ethLocks, setEthLocks] = useState<LockerInfo2[]>([])
  const [erc20Locks, setErc20Locks] = useState<LockerInfo2[]>([])
  const [erc721Locks, setErc721Locks] = useState<LockerInfo2[]>([])
  const [erc1155Locks, setErc1155Locks] = useState<LockerInfo2[]>([])

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
        const ethLocks1 = userLockersInfoArr.filter(
          (obj) => obj.tokenType === "eth"
        )
        setEthLocks(ethLocks1)
        const erc20Locks1 = userLockersInfoArr.filter(
          (obj) => obj.tokenType === "erc20"
        )
        setErc20Locks(erc20Locks1)
        const erc721Locks1 = userLockersInfoArr.filter(
          (obj) => obj.tokenType === "erc721"
        )
        setErc721Locks(erc721Locks1)
        const erc1155Locks1 = userLockersInfoArr.filter(
          (obj) => obj.tokenType === "erc1155"
        )
        setErc1155Locks(erc1155Locks1)
      }
      setIsFetching(false)
    }
  }

  const getDate = (timeInSeconds: ethers.BigNumber) => {
    const timeInMilliSeconds = timeInSeconds.toNumber() * 1000
    const date1 = new Date()
    date1.setTime(timeInMilliSeconds)
    return date1.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const withdrawTokens = async (_lockerId: ethers.BigNumber) => {
    setMessage1("")
    try {
      const signer = provider.getSigner()
      const chainId = await signer.getChainId()
      const lockerContract = getLockerContract(signer, chainId)
      const txn = await lockerContract.destroyLocker(_lockerId)
      await txn.wait(1)
      loadLockers()
    } catch (err) {
      console.log(err)
      setMessage1("Problem occurred while unlocking tokens.")
    }
  }

  const ETHLocks = () => {
    return (
      <>
        {ethLocks.length > 0 ? (
          ethLocks.map(
            (
              {
                tokenOwner,
                tokenType,
                tokenAddress,
                tokenId,
                tokenAmount,
                lockTime,
                unlockTime,
                isWithdrawn,
                tokenName,
                tokenSymbol,
                tokenAmount2,
                lockerId,
              },
              idx
            ) => (
              <Box
                key={idx}
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Box>
                  <Typography>{`Amount: ${tokenAmount2} ether`}</Typography>

                  <Typography>
                    {`Locked ${getDate(lockTime)} . Unlocks ${getDate(
                      unlockTime
                    )}`}
                  </Typography>
                </Box>

                <Box>
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
          <Typography>No Ether Locked.</Typography>
        )}
      </>
    )
  }
  const ERC20Locks = () => {
    return (
      <>
        {erc20Locks.length > 0 ? (
          erc20Locks.map(
            (
              {
                tokenOwner,
                tokenType,
                tokenAddress,
                tokenId,
                tokenAmount,
                lockTime,
                unlockTime,
                isWithdrawn,
                tokenName,
                tokenSymbol,
                tokenAmount2,
                lockerId,
              },
              idx
            ) => (
              <Box
                key={idx}
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Box>
                  <Typography>
                    {`${tokenName} - ${tokenAmount2} ${tokenSymbol}`}
                  </Typography>
                  <Typography>
                    Locked {getDate(lockTime)} . Unlocks {getDate(unlockTime)}
                  </Typography>
                </Box>

                <Box>
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
          <Typography>No ERC20 Tokens Locked.</Typography>
        )}
      </>
    )
  }

  const ERC721Locks = () => {
    return (
      <>
        {erc721Locks.length > 0 ? (
          erc721Locks.map(
            (
              {
                tokenOwner,
                tokenType,
                tokenAddress,
                tokenId,
                tokenAmount,
                lockTime,
                unlockTime,
                isWithdrawn,
                tokenName,
                tokenSymbol,
                tokenAmount2,
                lockerId,
              },
              idx
            ) => (
              <Box
                key={idx}
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Box>
                  <p>
                    {tokenName} - Id: {tokenId.toString()} Symbol: {tokenSymbol}
                  </p>
                  <p>
                    Locked {getDate(lockTime)} . Unlocks {getDate(unlockTime)}
                  </p>
                </Box>

                <Box>
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
          <Typography>No ERC721 Tokens Locked.</Typography>
        )}
      </>
    )
  }

  const ERC1155Locks = () => {
    return (
      <>
        {erc1155Locks.length > 0 ? (
          erc1155Locks.map(
            (
              {
                tokenOwner,
                tokenType,
                tokenAddress,
                tokenId,
                tokenAmount,
                lockTime,
                unlockTime,
                isWithdrawn,
                tokenName,
                tokenSymbol,
                tokenAmount2,
                lockerId,
              },
              idx
            ) => (
              <Box
                key={idx}
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Box>
                  <p>
                    {tokenName} - Id: {tokenId.toString()} Amount:{" "}
                    {tokenAmount2.toString()}
                  </p>
                  <p>TokenAddress: {tokenAddress}</p>
                  <p>
                    Locked {getDate(lockTime)} . Unlocks {getDate(unlockTime)}
                  </p>
                </Box>

                <Box>
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
          <Typography>No ERC1155 Tokens Locked.</Typography>
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
        <Box>
          <Typography variant="h6">ETHER</Typography>
          {isFetching ? <CircularProgress /> : <ETHLocks />}
        </Box>
        <Box>
          <Typography variant="h6">ERC20 Tokens</Typography>
          {isFetching ? <CircularProgress /> : <ERC20Locks />}
        </Box>
        <Box>
          <Typography variant="h6">ERC721 Tokens</Typography>
          {isFetching ? <CircularProgress /> : <ERC721Locks />}
        </Box>
        <Box>
          <Typography variant="h6">ERC1155 Tokens</Typography>
          {isFetching ? <CircularProgress /> : <ERC1155Locks />}
        </Box>
      </Stack>
    </>
  )
}

