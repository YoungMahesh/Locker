import { createTheme, ThemeProvider } from '@mui/material/styles'
import { PaletteMode } from '@mui/material'
import { useMemo } from 'react'
import storeCommon from './common.store'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify'
import Backdrop1 from './Backdrop1'

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light' ? {} : {}),
  },
})

export default function Layout({ children }: { children: any }) {
  const mode = storeCommon((s) => s.mode)

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Backdrop1 />
        <ToastContainer />
      </ThemeProvider>
    </>
  )
}
