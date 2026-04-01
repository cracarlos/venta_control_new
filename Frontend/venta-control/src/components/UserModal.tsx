import { useEffect, useState, useRef } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "./ui/checkbox"
import type { UserRegister } from "@/types/user"
import type { Groups } from "@/types/groups"
import { useUsersStore } from "@/hooks/useUsersStore"
import { Spinner } from "./ui/spinner"
import { toast } from "sonner"

import { postUsers } from "@/services/usersServices"
import { AlertPerson } from "./AlertPerson"
import { useUiStore } from "@/hooks/useUiStore"
import { setIsLoading } from "@/store/UI/uiSlices"

export const UserModal = () => {
    const {register, handleSubmit, setValue, getValues, reset, trigger, formState: {isValid}} = useForm<UserRegister>({
        mode: "onChange"
    });

    const { modalOpen, _setModalOpen } = useUiStore();

    const { userData } = useUsersStore();

    const inputRef = useRef<HTMLButtonElement>(null);

    const { _getGroups, _cleanUser, _editUser } = useUsersStore();
    const { isLoading, _setIsLoading } = useUiStore();

    const [groups, setGroups] = useState<Groups[]>([]);
    const [status, setStatus] = useState<boolean>(true);
    const [groupSelect, setGroupSelect] = useState<number[]>([1]);
    const [apiResp, setApiResp] = useState<any>(null)

    const handleGroups = (data:string) => {
        setGroupSelect([Number(data)]);
        trigger();
    };

    const handleCancel = () => {
        reset();
        setApiResp(null);
        setIsLoading(false);
        // setOpen(false);
        _cleanUser();

    };

    const onSubmit: SubmitHandler<UserRegister> = async () => {
        _setIsLoading(true);

        setValue("groups", groupSelect);
        setValue("is_active", status);

        if (userData.id == 0) {
            console.log('creted')
            setValue("password", getValues("cedula_rif"));
            const dataNew = getValues();
            console.log(dataNew)
            const resp =  await postUsers(dataNew);
            console.log(resp);
            setApiResp(resp)
        
            if (resp.status == 201) {
                toast.success("Usuario creado exitosamente.", { position: "bottom-right" })
                _setIsLoading(false);
                // setOpen(false);
                _setModalOpen(false);
                reset();
              
            } else {
                _setIsLoading(false);
            }
            
        }else {
            console.log('edit-guardado');
            setValue("id", userData.id);
            const dataNew = getValues();
            console.log(dataNew);
            const resp = await _editUser(dataNew);
            setApiResp(resp);

            if (resp.status == 200) {
                toast.success("Usuario editado exitosamente.", { position: "bottom-right" })
                _setIsLoading(false);
                // setOpen(false);
                _setModalOpen(false);
                reset();
              
            } else {
                _setIsLoading(false);
            }
        }

    }

    const getGroupsList = async () => {
        const resp =  await _getGroups();
        setGroups(resp);
        return resp;
    }

    useEffect(() => {
        getGroupsList();
    }, [])

    useEffect(() => {
        setValue("first_name", userData.first_name);
        setValue("middle_name", userData.middle_name);
        setValue("last_name", userData.last_name);
        setValue("second_last_name", userData.second_last_name);
        setValue("cedula_rif", userData.cedula_rif);
        setValue("email", userData.email);
        setGroupSelect(userData.groups[0]?.id ? [userData.groups[0].id] : []);
        setStatus(userData.is_active);
    }, [userData])

    useEffect(() => {
        handleCancel();
    }, [modalOpen])
    
    
    
  return (
    <Dialog open={modalOpen} onOpenChange={_setModalOpen}>
        {/* <DialogTrigger asChild>
            <Button variant="outline">
                <UserRoundPlus />
            </Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Agregar usuario</DialogTitle>
                <DialogDescription>
                    El password por defecto es su cedula/rif.
                    Al iniciar por primera vez, se le solicitara cambiarlo.
                </DialogDescription>
                <DialogDescription>
                    Campos con <span className="text-red-500">*</span> son obligatorios.
                </DialogDescription>
                {
                    apiResp?.status == 400 || apiResp?.status == 500 ?
                        <AlertPerson ok={false} message={apiResp?.data} title={apiResp?.statusText} />
                    : ''
                }
            </DialogHeader>
            <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto pr-2 py-4">
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="first_name"> <span className="text-red-500">*</span>Primer Nombre</Label>
                            <Input 
                                id="name-1" {... register("first_name", { required: true, minLength: 2, maxLength: 30 })} />
                        </Field>
                        <Field>
                            <Label htmlFor="middle_name">Segundo nombre</Label>
                            <Input id="middle_name" {... register("middle_name", { minLength: 2, maxLength: 30 })} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="last_name"> <span className="text-red-500">*</span>Primer apellido</Label>
                            <Input id="last_name" {... register("last_name", { required: true, minLength: 2, maxLength: 30 })}  />
                        </Field>
                        <Field>
                            <Label htmlFor="secondLastName">Segundo apellido</Label>
                            <Input id="secondLastName" {... register("second_last_name", { minLength: 2, maxLength: 30 })} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="email"> <span className="text-red-500">*</span>Email</Label>
                            <Input id="email" {... register("email", { required: true })} type="email" placeholder="m@gmail.com" />
                        </Field>
                        <Field>
                            <Label htmlFor="cedula_rif"> <span className="text-red-500">*</span>Cedula/Rif</Label>
                            <Input id="cedula_rif" {... register("cedula_rif", { required: true })} placeholder="V12345678" />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field>
                            <Label htmlFor="groups"> <span className="text-red-500">*</span>Grupo</Label>
                            <Select onValueChange={handleGroups} value={groupSelect[0]?.toString()} required>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Seleccione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {
                                            groups.map((group) => (
                                                <SelectItem key={group.id} value={group.id.toString()} >{group.name}</SelectItem>
                                            ))
                                        }
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <Field>
                            <FieldGroup className="mx-auto w-56">
                                <Field orientation="horizontal">
                                    <Label htmlFor="is_active"> <span className="text-red-500">*</span>Activo</Label>
                                    <Checkbox
                                        id="is_active"
                                        checked={status}
                                        onCheckedChange={(checked) => {
                                            setStatus(checked as boolean)
                                        }}
                                    />
                                </Field>
                            </FieldGroup>
                        </Field>
                    </div>

                </div>
            </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button ref={inputRef} variant="outline" onClick={handleCancel}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" form="user-form" disabled={isLoading || !isValid}>
                {isLoading ? <Spinner /> : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
