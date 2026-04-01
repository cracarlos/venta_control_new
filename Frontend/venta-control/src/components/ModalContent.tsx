import { ModalResetPassword } from "./ModalResetPassword"
import { ProductModal } from "./ProductModal"
import { UserModal } from "./UserModal"

export const ModalContent = ({ name }: { name: string }) => {
  return (
    <>
        { name == 'user' && <UserModal />}
        { name == 'product' && <ProductModal />}
        { name == 'resetPassword' && <ModalResetPassword />}
    </>
  )
}
