import { Heading, Box, RadioGroup, Stack, Radio, Input, Button } from "@chakra-ui/react"
import { useRef, useState } from "react"
import PlanIcon from "./PlanIcon"

const button1 = [0, 1, 2, 3, 4, 5, 6, 7]
const button2 = [8, 9, 10, 11, 12, 13, 14, 15]
const button3 = [16, 17, 18, 19, 20, 21, 22, 23]

interface TitleFormProps {
  buttonTittle: string
  onSubmit: (title: string, playType: number) => void
  defaultValues?: { radioValue?: string; title?: string }
}
const PlanForm = ({ buttonTittle, onSubmit, defaultValues }: TitleFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null!)
  const [radioValue, setRadioValue] = useState<string>(defaultValues?.radioValue ?? "0")
  return (
    <>
      <Box m={4}>
        <Heading size="sm" my={2}>
          Icon:
        </Heading>
        <RadioGroup defaultValue="0" onChange={setRadioValue} value={radioValue}>
          <Stack direction="row">
            {button1.map((i) => (
              <Radio name="icon" value={`${i}`} key={`icon-${i}`}>
                <PlanIcon id={i} />
              </Radio>
            ))}
          </Stack>
          <Stack direction="row">
            {button2.map((i) => (
              <Radio name="icon" value={`${i}`} key={`icon-${i}`}>
                <PlanIcon id={i} />
              </Radio>
            ))}
          </Stack>
          <Stack direction="row">
            {button3.map((i) => (
              <Radio name="icon" value={`${i}`} key={`icon-${i}`}>
                <PlanIcon id={i} />
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
      <Box m={4}>
        <Heading size="sm" my={2}>
          Title:
        </Heading>
        <Input
          name="title"
          placeholder="Title of this plan"
          ref={inputRef}
          defaultValue={defaultValues?.title ?? ""}
        />
      </Box>
      <Box m={4} textAlign="right">
        <Button
          onClick={async () => {
            console.log("createPlan", inputRef.current.value, radioValue)
            if (!inputRef.current.value || inputRef.current.value.length < 1) return
            onSubmit(inputRef.current.value, parseInt(radioValue))
          }}
        >
          {buttonTittle}
        </Button>
      </Box>
    </>
  )
}

export default PlanForm
