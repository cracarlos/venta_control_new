import { useForm, type SubmitHandler } from "react-hook-form"
import { useNavigate  } from "react-router";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "./ui/spinner"

import { useAuthStore } from "@/hooks/useAuthStore"
import { useState } from "react";
import { AlertPerson } from "./AlertPerson";
import type { PasswordUpdate } from "@/types/user";
import { toast } from "sonner";

export const UserPasswordUpdate = () => {
  
  const {register, handleSubmit, watch, formState: {errors, isValid}} = useForm<PasswordUpdate>({
    mode: "onChange"
  });
  
  const password = watch("password");

  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState('');

  const { _passwordUpdate, _passwordUpdateSlice } = useAuthStore();

  let navigate = useNavigate();
  
  const onSubmit: SubmitHandler<PasswordUpdate> = async (data) => {
    setIsError(true);

    const resp = await _passwordUpdate(data)

    if (resp.status == 200) {
      setTimeout(() => {
        _passwordUpdateSlice(resp.data.userPasswordChanged);
        toast.success("Contraseña actualizada", { position: "bottom-right" })
        navigate("/dashboard", { replace: true });
      }, 1000);
    } else {
      setIsError(false);
      setMessageError(resp.data.message);
      toast.error(resp.data.message, { position: "bottom-right" })
    }

  }

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          { messageError && <AlertPerson ok={false} message={messageError} title="Error al cambiar contraseña" /> }
          <CardTitle>Nueva contraseña</CardTitle>
          <CardDescription>
            Ingrese su nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">      
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password", {required: "La contraseña es obligatoria"})}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Confirmar Contraseña</Label>
                </div>
                <Input
                    id="passwordConfirm"
                    type="password"
                    required {...register("passwordConfirm", {
                            required: "Las contraseñas tienen que ser identicas" ,
                            validate:(value) => value === password || "Las contraseñas no coinciden"
                        })
                    }
                />
                {errors.passwordConfirm && <p>{errors.passwordConfirm.message}</p>}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button 
            type="submit"
            className="w-full"
            form="auth-form"
            disabled={ isError || !isValid }
          >
            { isError ? <Spinner /> : "Actualizar contraseña"}
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}



// export const UserPasswordUpdate = () => {
//   return (
//     <div>UserPasswordUpdate</div>
//   )
// }
