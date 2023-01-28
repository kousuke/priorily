import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import TitleForm from "./PlanForm"

const button1 = [0, 1, 2, 3, 4, 5, 6, 7]
const button2 = [8, 9, 10, 11, 12, 13, 14, 15]
const button3 = [16, 17, 18, 19, 20, 21, 22, 23]

interface CraeteNewPlanButtonProps extends ButtonProps {
  createPlan: (title: string, playType: number) => Promise<void>
  refetch: () => Promise<void>
}
const CraeteNewPlanButton = ({ createPlan, refetch, ...rest }: CraeteNewPlanButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = async (title: string, type: number) => {
    await createPlan(title, type)
    await refetch()
    onClose()
  }
  return (
    <>
      <Button
        onClick={() => {
          onOpen()
        }}
        {...rest}
      >
        Create New Plan
      </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={2}>Creating new plan</ModalHeader>
          {<ModalCloseButton />}
          <ModalBody pb={6}>
            <TitleForm onSubmit={onSubmit} buttonTittle="create" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CraeteNewPlanButton
