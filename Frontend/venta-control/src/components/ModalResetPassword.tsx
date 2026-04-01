import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useUiStore } from "@/hooks/useUiStore"
import { useUsersStore } from "@/hooks/useUsersStore";
import { useState } from "react";
import { toast } from "sonner";

export const ModalResetPassword = () => {
    const { modalOpen, _setModalOpen } = useUiStore();
    const { _patchResetPassword, userData } = useUsersStore();
    const [button, setButton] = useState(false);

    const onSubmit = async () => {
        setButton(true);
        const {data, status} = await _patchResetPassword(userData.id);
        console.log(data);
        if (status == 200) {
            _setModalOpen(false);
            toast.success(data.message, { position: "bottom-right" })
        }else{
            setButton(false);
            toast.error(data.message, { position: "bottom-right" })
        }

    }

    return (
        <Dialog open={modalOpen} onOpenChange={_setModalOpen}>
            <form>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Resetear Contraseña</DialogTitle>
                        <DialogDescription>
                            ¿Seguro que desea restablecer la contraseña del usuario {userData.first_name} {userData.last_name}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" disabled={button} onClick={onSubmit}>Resetear</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
