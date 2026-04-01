import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { ModalContent } from "./ModalContent"
import { useUiStore } from "@/hooks/useUiStore"
import { UserRoundPlus } from "lucide-react"
import { Button } from "./ui/button"

export const UserTabletCard = ({children}:any) => {
  const { modalName, _setModalName, _setModalOpen } = useUiStore();

  const handleModal = () => {
    _setModalName('user');
    _setModalOpen(true);
  }

  return (
    <Card>
      <CardHeader>
          <CardAction>
            <Button variant="outline" onClick={handleModal}>
              <UserRoundPlus />
            </Button>
              {/* <UserModal /> */}
              <ModalContent name = {modalName} />
          </CardAction>
      </CardHeader>
      <CardContent>
          {children}
      </CardContent>
    </Card>
  )
}
