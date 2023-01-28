import { SettingsIcon, TriangleUpIcon } from "@chakra-ui/icons"
import {
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
  useToast,
} from "@chakra-ui/react"
import { useMemo } from "react"
import usePriorily, { Plan, PlanStatus } from "src/components/hooks/usePriorily"
import EditPlanMenuItem from "src/components/UI/EditPlanMenuItem"
import PlanIcon from "src/components/UI/PlanIcon"

interface PlanTableProps {
  plans: Plan[]
  admin: boolean
  status: PlanStatus
  refetch: () => Promise<void>
}
const PlanTable = ({ plans, refetch, status, admin = false }: PlanTableProps) => {
  const toast = useToast()
  const { changePlanStatus, vote, savePlan } = usePriorily()
  const targetPlans = useMemo(() => plans.filter((p) => p.status === status), [plans, status])
  return (
    <Table size="sm">
      <Tbody>
        {targetPlans.map((p) => (
          <Tr key={`plan-table-${p.planId}`}>
            <Td width="30px" p={2}>
              <PlanIcon id={p.planType} />
            </Td>
            <Td p={2}>{p.title}</Td>
            <Td width="80px" textAlign="right" p={2}>
              <Flex>
                <Spacer />
                <Button
                  rightIcon={<TriangleUpIcon />}
                  variant="solid"
                  size="sm"
                  mx={1}
                  width="50px"
                  onClick={async () => {
                    await vote(p.planId)
                    await refetch()
                  }}
                >
                  {p.voters.length}
                </Button>
                {admin ? (
                  <>
                    <Menu>
                      <MenuButton as={Button} size="sm" colorScheme="gray">
                        <SettingsIcon />
                      </MenuButton>
                      <MenuList>
                        <MenuGroup title="Status">
                          {p.status === "planned" ? null : (
                            <MenuItem
                              as="a"
                              href="#"
                              onClick={async () => {
                                await changePlanStatus(p.planId, "planned")
                                await refetch()
                              }}
                              pl={6}
                            >
                              change to planned
                            </MenuItem>
                          )}
                          {p.status === "inProgress" ? null : (
                            <MenuItem
                              as="a"
                              href="#"
                              onClick={async () => {
                                await changePlanStatus(p.planId, "inProgress")
                                await refetch()
                              }}
                              pl={6}
                            >
                              change to in progress
                            </MenuItem>
                          )}
                          {p.status === "backlog" ? null : (
                            <MenuItem
                              as="a"
                              href="#"
                              onClick={async () => {
                                await changePlanStatus(p.planId, "backlog")
                                await refetch()
                              }}
                              pl={6}
                            >
                              change to backlog
                            </MenuItem>
                          )}
                          <MenuItem
                            as="a"
                            href="#"
                            onClick={async () => {
                              await changePlanStatus(p.planId, "done")
                              await refetch()
                            }}
                            pl={6}
                          >
                            change to done
                          </MenuItem>
                        </MenuGroup>
                        <MenuGroup title="Edit">
                          <EditPlanMenuItem plan={p} savePlan={savePlan} refetch={refetch} />
                        </MenuGroup>
                        <MenuGroup title="Poster">
                          <MenuItem
                            as="a"
                            href="#"
                            pl={6}
                            onClick={async () => {
                              if (typeof navigator !== undefined) {
                                await navigator.clipboard.writeText(p.owner)
                                toast({ status: "success", title: "copied this address!!" })
                              }
                            }}
                          >
                            {p.owner}
                          </MenuItem>
                        </MenuGroup>
                      </MenuList>
                    </Menu>
                  </>
                ) : null}
              </Flex>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default PlanTable
