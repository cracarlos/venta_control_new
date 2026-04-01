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
      
      
      navigate("/dashboard");
    } else {
      setIsError(false);
      setMessageError(resp.message);
    }

  }

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          { messageError && <AlertPerson ok={false} message={messageError} title="Error login" /> }
          <CardTitle>Venta Control</CardTitle>
          <CardDescription>
            Sistema para control de ventas e inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">      
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="asd@example.com"
                  required
                  {...register("email", {required: true})}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required {...register("password", { required: true })}/>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button 
            type="submit"
            className="w-full"
            form="auth-form"
            disabled={ isError }
          >
            {isError ? <Spinner /> : "Login"}
          </Button>
          {/* <Link to={"/dashboard"} className="w-full">
            <Button 
              type="submit"
              className="w-full"
            >
                next
            </Button>
            </Link> */}
        </CardFooter>
      </Card>
    </>
  )
}
