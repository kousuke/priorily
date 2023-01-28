import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { ChakraProvider } from "@chakra-ui/react"
import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { withBlitz } from "src/blitz-client"
import theme from "src/components/UI/theme"
import { RecoilRoot } from "recoil"
import "./styles.css"
import EthEventListener from "src/core/components/EthEventListener"

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <div>Error: You are not authenticated</div>
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  return (
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <RecoilRoot>
        <EthEventListener>
          <ChakraProvider theme={theme}>{getLayout(<Component {...pageProps} />)}</ChakraProvider>
        </EthEventListener>
      </RecoilRoot>
    </ErrorBoundary>
  )
}

export default withBlitz(MyApp)