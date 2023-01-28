import { Box, ChakraProps, Image } from "@chakra-ui/react"

const BigLogo = (props: ChakraProps) => {
  return (
    <Box {...props}>
      <Image marginTop="200px" src="/logo.png" alt="logo" />
    </Box>
  )
}

export default BigLogo
