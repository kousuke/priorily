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

interface SuggestPlanButtonProps extends ButtonProps {
  suggestPlan: (title: string, playType: number) => Promise<void>
  refetch: () => Promise<void>
}
const SuggestPlanButton = ({ suggestPlan, refetch, ...rest }: SuggestPlanButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = async (title: string, type: number) => {
    await suggestPlan(title, type)
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
        Suggest Plan
      </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader m={2}>Suggest plan</ModalHeader>
          {<ModalCloseButton />}
          <ModalBody pb={6}>
            <TitleForm onSubmit={onSubmit} buttonTittle="suggest" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SuggestPlanButton
