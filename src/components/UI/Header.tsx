import { Badge, Box, Button, Center, Flex, HStack, useColorMode } from "@chakra-ui/react"
import useMetaMask from "../hooks/useMetaMask"
import { SunIcon, MoonIcon } from "@chakra-ui/icons"
import { ReactNode } from "react"

interface HeaderWrapperProps {
  children?: ReactNode
  showConnect?: boolean
}
const HeaderWrapper = ({ children, showConnect = false }: HeaderWrapperProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { connect } = useMetaMask()
  return (
    <Box
      width="100%"
      backgroundColor={colorMode === "light" ? "blackAlpha.100" : "blackAlpha.500"}
      borderBottomColor={colorMode === "light" ? "blackAlpha.50" : "whiteAlpha.50"}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      height={50}
    >
      <Flex>
        <Box flex="1"></Box>
        {children}
        {showConnect ? (
          <Box>
            <Button onClick={connect} colorScheme="gray" size="sm" m={2}>
              connect
            </Button>
          </Box>
        ) : null}
        <Box>
          <Button size="sm" onClick={toggleColorMode} colorScheme="gray" m={2}>
            {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </Box>
      </Flex>
    </Box>
  )
}
const Header = () => {
  const { hasMetaMask, connect, eoa } = useMetaMask()

  if (!hasMetaMask)
    return (
      <HeaderWrapper>
        <Box mt={1}>
          <Box m={2}>MetaMask not found.</Box>
        </Box>
      </HeaderWrapper>
    )

  if (eoa)
    return (
      <HeaderWrapper>
        <Box mt={2}>
          <Badge m={2}>{eoa}</Badge>
        </Box>
      </HeaderWrapper>
    )

  return <HeaderWrapper showConnect />
}
export default Header
