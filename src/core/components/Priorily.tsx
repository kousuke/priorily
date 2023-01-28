import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react"
import { Suspense, useCallback, useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import useMetaMask from "src/components/hooks/useMetaMask"
import usePriorily, { Plan } from "src/components/hooks/usePriorily"
import useWindowSize from "src/components/hooks/useWindowSize"
import { logEventStore } from "src/components/stores/log-event"
import CraeteNewPlanButton from "src/components/UI/CreateNewPlanButton"
import SuggestPlanButton from "src/components/UI/SuggestPlanButton"
import PlanTable from "./PlanTable"

const Priorily = () => {
  const { eoa } = useMetaMask()
  const { getPlans, createPlan, isOwner, suggestPlan } = usePriorily()
  const [plans, setPlans] = useState<Plan[]>([])
  const [admin, setAdmin] = useState(false)
  const [logEvent, setLogEvent] = useRecoilState(logEventStore)
  const windowSize = useWindowSize()

  const loadPlan = useCallback(async () => {
    setPlans(await getPlans())
  }, [getPlans])

  useEffect(() => {
    async function reload() {
      await loadPlan()
    }
    if (logEvent.length > 0) {
      void reload()
      setLogEvent([])
    }
  }, [loadPlan, logEvent.length, setLogEvent])

  useEffect(() => {
    async function init() {
      await loadPlan()
      if (eoa) {
        setAdmin(await isOwner(eoa))
      }
    }
    void init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box width={800}>
      <Box width="100%" height="100px">
        <Heading as="h1" size="3xl" m={2} color="orange">
          Roadmap
        </Heading>
        <Text m={2}>Our current roadmap is as follows.</Text>
      </Box>
      <Flex width="100%" direction="row" height={`${windowSize.height - 100 - 70}px`}>
        <Stack width={600} overflowY="scroll">
          <Box width="100%">
            <Heading as="h2" size="xl" m={2}>
              In Progress
            </Heading>
            <PlanTable plans={plans} admin={admin} refetch={loadPlan} status="inProgress" />
          </Box>
          <Box width="100%">
            <Heading as="h2" size="xl" m={2}>
              Planned
            </Heading>
            <PlanTable plans={plans} admin={admin} refetch={loadPlan} status="planned" />
          </Box>
          <Box width="100%">
            <Heading as="h2" size="xl" m={2}>
              Backlog
            </Heading>
            <PlanTable plans={plans} admin={admin} refetch={loadPlan} status="backlog" />
          </Box>
          <Box width="100%">
            <Heading as="h2" size="xl" m={2}>
              Done
            </Heading>
            <PlanTable plans={plans} admin={admin} refetch={loadPlan} status="done" />
          </Box>
          <Box width="100%" mb={12}>
            <Heading as="h2" size="xl" m={2}>
              Suggested
            </Heading>
            <PlanTable plans={plans} admin={admin} refetch={loadPlan} status="suggested" />
          </Box>
        </Stack>
        <Box width={200} height="100%">
          <Box>
            {admin ? (
              <CraeteNewPlanButton my={2} createPlan={createPlan} refetch={loadPlan} width="100%" />
            ) : (
              <SuggestPlanButton my={2} suggestPlan={suggestPlan} refetch={loadPlan} width="100%" />
            )}
            <Button my={2} onClick={loadPlan} width="100%">
              Reload data
            </Button>
          </Box>
          <Box width={200} height="100%" mt={4}>
            <Box m={2}>
              <Text>
                <b>Priority</b> management service which is block chain backend.
              </Text>
            </Box>
            <Box m={2}>Every one can vote item which you think it is important.</Box>
            <Box m={2}>Administrators can add task and can change status of tasks</Box>
            <Box m={2}>Smart contract emits event so you can get event if you want.</Box>
            <Box m={2}>Also small fee is sent to creator :)</Box>
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}

const PriorilyPane = () => {
  return (
    <Suspense fallback={<div>loading....</div>}>
      <Priorily />
    </Suspense>
  )
}

export default PriorilyPane
