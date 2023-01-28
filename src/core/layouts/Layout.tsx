import Head from "next/head"
import React from "react"
import { BlitzLayout } from "@blitzjs/next"
import useWindowSize from "src/components/hooks/useWindowSize"
import { Box, VStack } from "@chakra-ui/react"
import Header from "src/components/UI/Header"
import useMetaMask from "src/components/hooks/useMetaMask"
import BigLogo from "src/components/UI/BigLogo"

const Layout: BlitzLayout<{ title?: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  const windowSize = useWindowSize()
  const { eoa } = useMetaMask()
  return (
    <>
      <Head>
        <title>{title || "priorily"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box width={windowSize.width} height={windowSize.height} overflow="hidden">
        <VStack height={windowSize.height}>
          <Header />
          {!eoa ? <BigLogo height={windowSize.height} /> : <Box>{children}</Box>}
        </VStack>
      </Box>
    </>
  )
}

export default Layout
