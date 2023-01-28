import {
  AddIcon,
  ArrowUpIcon,
  AtSignIcon,
  AttachmentIcon,
  BellIcon,
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  DeleteIcon,
  InfoIcon,
  LinkIcon,
  LockIcon,
  MoonIcon,
  NotAllowedIcon,
  PhoneIcon,
  PlusSquareIcon,
  QuestionIcon,
  RepeatIcon,
  SearchIcon,
  SettingsIcon,
  SpinnerIcon,
  StarIcon,
  SunIcon,
  TimeIcon,
  UnlockIcon,
  ViewIcon,
  WarningIcon,
} from "@chakra-ui/icons"
import { useMemo } from "react"

export const ICON_NUM = 26

const PlanIcon = ({ id }) => {
  const color = "orange"
  const icon = useMemo(() => {
    switch (id) {
      case 1:
        return <AddIcon color={color} />
      case 2:
        return <ArrowUpIcon color={color} />
      case 3:
        return <AtSignIcon color={color} />
      case 4:
        return <AttachmentIcon color={color} />
      case 5:
        return <BellIcon color={color} />
      case 6:
        return <CalendarIcon color={color} />
      case 7:
        return <ChatIcon color={color} />
      case 8:
        return <CheckIcon color={color} />
      case 9:
        return <DeleteIcon color={color} />
      case 10:
        return <InfoIcon color={color} />
      case 11:
        return <LinkIcon color={color} />
      case 12:
        return <LockIcon color={color} />
      case 13:
        return <MoonIcon color={color} />
      case 14:
        return <NotAllowedIcon color={color} />
      case 15:
        return <PhoneIcon color={color} />
      case 16:
        return <PlusSquareIcon color={color} />
      case 17:
        return <QuestionIcon color={color} />
      case 18:
        return <RepeatIcon color={color} />
      case 19:
        return <SearchIcon color={color} />
      case 20:
        return <SettingsIcon color={color} />
      case 21:
        return <SpinnerIcon color={color} />
      case 22:
        return <StarIcon color={color} />
      case 23:
        return <SunIcon color={color} />
      case 24:
        return <TimeIcon color={color} />
      case 25:
        return <UnlockIcon color={color} />
      case 0:
        return <ViewIcon color={color} />
      default:
        return <WarningIcon color={color} />
    }
  }, [id])

  return icon
}
export default PlanIcon
