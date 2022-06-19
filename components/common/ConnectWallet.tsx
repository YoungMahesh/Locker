import Box from '@mui/material/Box'
import React, { useEffect, useMemo } from 'react'
import Button1 from './Button1'
import storeCommon from './common.store'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { Typography } from '@mui/material'

declare global {
  interface Window {
    provider1: any
  }
}

export default function ConnectWallet() {
  const provider = storeCommon((s) => s.provider)
  const setProvider = storeCommon((s) => s.setProvider)
  const setAccount = storeCommon((s) => s.setAccount)
  const account = storeCommon((s) => s.account)
  const setChainId = storeCommon((s) => s.setChainId)

  const web3Modal: any = useMemo(() => {
    if (typeof window === 'undefined') return
    return new Web3Modal({
      cacheProvider: true,
      providerOptions: {},
    })
  }, [])

  const connectWallet = async () => {
    try {
      const _instance = await web3Modal.connect()
      const _provider = new ethers.providers.Web3Provider(_instance)
      const accounts = await _provider.listAccounts()
      const network = await _provider.getNetwork()
      setProvider(_provider)
      if (accounts) setAccount(accounts[0])
      setChainId(network.chainId)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (web3Modal.cachedProvider) connectWallet()
  }, [])

  const disconnect = async () => {
    await web3Modal.clearCachedProvider()
    setAccount('')
  }

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts) setAccount(accounts[0])
      }

      const handleChainChanged = (_hexChainId: number) => {
        setChainId(_hexChainId)
      }

      provider.on('accountsChanged', handleAccountsChanged)
      provider.on('chainChanged', handleChainChanged)
      provider.on('disconnect', disconnect)

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged)
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('disconnect', disconnect)
        }
      }
    }
  }, [provider])

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: { xs: 'center', md: 'space-between' },
        alignItems: 'center',
        margin: '10px 10px 40px 10px',
      }}
    >
      <Typography variant="h4">Blockchain Locker</Typography>
      <Box>
        {account.length > 0 ? (
          <Button1
            onClick={disconnect}
            colorType="pink"
            sizeType={2}
            title={`${account.slice(0, 6)}...${account.slice(38, 42)}`}
          />
        ) : (
          <Button1
            onClick={connectWallet}
            colorType="pink"
            sizeType={2}
            title={'Connect Wallet'}
          />
        )}
      </Box>
    </Box>
  )
}
