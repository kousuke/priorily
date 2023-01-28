import { useEffect, useState } from "react"

interface WindowSize {
  width: number
  height: number
  responsiveContentWith?: number
}
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 800,
    height: 600,
    responsiveContentWith: 800,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
          responsiveContentWith: Math.max(Math.min(window.innerWidth, 1440), 420),
        })
      }
      window.addEventListener("resize", handleResize)
      handleResize()
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])
  return windowSize
}

export default useWindowSize
