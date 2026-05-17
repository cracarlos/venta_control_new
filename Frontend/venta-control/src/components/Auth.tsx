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

import type { AuthLogin } from "@/types/auth"
import { useAuthStore } from "@/hooks/useAuthStore"
import { useState } from "react";
import { AlertPerson } from "./AlertPerson";

export const Auth = () => {
  
  const {register, handleSubmit} = useForm<AuthLogin>({
    mode: "onChange"
  });

  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState('');

  const { Login } = useAuthStore();

  let navigate = useNavigate();
  
  const onSubmit: SubmitHandler<AuthLogin> = async (data) => {
    setIsError(true);

    const resp = await Login(data);
    console.log(resp)

    if (resp.ok == true) {
      if (resp.permissions.includes("superuser")) return navigate("/dashboard");
      if (resp.permissions.includes("dashboard")) return navigate("/dashboard");
      if (resp.permissions.includes("view_sale_products")) return navigate("/pos");
      if (resp.permissions.includes("view_sales")) return navigate("/sales");
      if (resp.permissions.includes("view_products")) return navigate("/products");
      if (resp.permissions.includes("view_user")) return navigate("/users");
      if (resp.permissions.includes("view_group")) return navigate("/roles");
    } else {
      setIsError(false);
      setMessageError(resp.message);
    }

  }

  return (
    <Card className="w-full max-w-sm shadow-xl border-0 bg-white/90 dark:bg-card/90 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm lg:hidden">
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <CardTitle className="text-xl">Iniciar Sesión</CardTitle>
        </div>
        { messageError && <AlertPerson ok={false} message={messageError} title="Error login" /> }
        <CardDescription>
          Ingresa tus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">      
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ejemplo.com"
                required
                {...register("email", {required: true})}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
              </div>
              <Input id="password" type="password" placeholder="••••••••" required {...register("password", { required: true })}/>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button 
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-800/20"
          form="auth-form"
          disabled={ isError }
        >
          {isError ? <Spinner /> : "Entrar"}
        </Button>
      </CardFooter>
    </Card>
  )
}
