import {
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import PlanForm from "./PlanForm"
import { Plan } from "../hooks/usePriorily"

interface EditPlanMenuItemProps {
  plan: Plan
  savePlan: (planId: number, title: string, playType: number) => Promise<void>
  refetch: () => Promise<void>
}
const EditPlanMenuItem = ({ plan, savePlan, refetch }: EditPlanMenuItemProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = async (title: string, type: number) => {
    await savePlan(plan.planId, title, type)
    await refetch()
    onClose()
  }
  return (
    <>
      <MenuItem
        as="a"
        href="#"
        onClick={() => {
          onOpen()
        }}
        pl={6}
      >
        Edit plan
      </MenuItem>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={2}>Edit plan</ModalHeader>
          {<ModalCloseButton />}
          <ModalBody pb={6}>
            <PlanForm
              onSubmit={onSubmit}
              buttonTittle="save"
              defaultValues={{ radioValue: `${plan.planType}`, title: plan.title }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditPlanMenuItem
