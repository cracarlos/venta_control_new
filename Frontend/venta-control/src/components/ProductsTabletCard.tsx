import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { ModalContent } from "./ModalContent"
import { useUiStore } from "@/hooks/useUiStore"
import { PackagePlus } from "lucide-react"
import { Button } from "./ui/button"

export const ProductsTabletCard = ({children}: any) => {
  const { modalName, _setModalName, _setModalOpen } = useUiStore();

  const handleModal = () => {
    _setModalName('product');
    _setModalOpen(true);
  }

  return (
    <Card>
      <CardHeader>
          <CardAction>
            <Button variant="outline" onClick={handleModal}>
              <PackagePlus />
            </Button>
              <ModalContent name = {modalName} />
          </CardAction>
      </CardHeader>
      <CardContent>
          {children}
      </CardContent>
    </Card>
  )
}
