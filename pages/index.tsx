import Head from "next/head"
import { ReactElement } from "react"
import ConnectWallet from "../components/common/ConnectWallet"
import Box from "@mui/material/Box"
import Layout from "../components/common/Layout"
import LockTokens from "../components/LockTokens/LockTokens"
import MyLocks from "../components/mylocks/MyLocks"
import storeCommon from "../components/common/common.store"
import { Typography } from "@mui/material"

const Home = () => {
  const account = storeCommon(s => s.account)
  return (
    <>
      <Head>
        <title>Locker</title>
        <meta name="description" content="Lock ERC20, ERC721, ERC1155 Tokens" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ConnectWallet />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        <LockTokens />

        {account.length ? <MyLocks /> : null }
      </Box>

      <Typography sx={{margin: '30px'}} variant="h6" align='center'>Supported Networks: Fantom Testnet</Typography>
    </>
  )
}

export default Home
Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
