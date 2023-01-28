import Layout from "src/core/layouts/Layout"
import { BlitzPage } from "@blitzjs/next"
import Priorily from "src/core/components/Priorily"

const Home: BlitzPage = () => {
  return (
    <Layout title="Priorily">
      <Priorily />
    </Layout>
  )
}

export default Home
