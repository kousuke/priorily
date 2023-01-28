import { extendTheme, theme as baseTheme } from "@chakra-ui/react"

const theme = extendTheme({
  initialColorMode: "dark",
  fonts: {
    heading: `Montserrat, ${baseTheme.fonts.heading}`,
    body: `Poppins,Inter, ${baseTheme.fonts.body}`,
  },
  defaultProps: {
    colorScheme: "orange",
  },
  components: {
    Tabs: {
      defaultProps: {
        colorScheme: "orange",
      },
    },
    Table: {
      defaultProps: {
        colorScheme: "orange",
      },
    },

    Button: {
      defaultProps: {
        colorScheme: "orange",
      },
    },
    Toast: {
      defaultProps: {
        colorScheme: "orange",
      },
    },
  },
  colors: {
    backgroundColor: "#000",
    color: "#fff",
    workgroup: {
      backgroundColor: "#111",
    },
    workgroupMenu: {
      backgroundColor: "#222",
    },
    workgroupMain: {
      backgroundColor: "#333",
    },
  },
})

export default theme
