import { postLogin, postLogout } from "@/services/authService"
import type { AuthApi, AuthLogin } from "@/types/auth";
import { useAppDispatch, useAppSelector } from "./useStore";
import { loginSlice, logoutSlice, passwordUpdateSlice } from "@/store/Auth/authSlice";
import type { PasswordUpdate } from "@/types/user";
import { postPasswordUpdate } from "@/services/usersServices";

export const useAuthStore = () => {

    const { fullName, email, isAuthenticated, passwordUpdate } = useAppSelector((state) => state.auth); 
    
    const dispatch = useAppDispatch();
    
    const Login = async (data: AuthLogin) => {
        try {
            const resp: AuthApi = await postLogin(data);

            localStorage.setItem("token", resp.access);
            localStorage.setItem("refresh", resp.refresh);

            dispatch(
                loginSlice({
                    isAuthenticated: true,
                    email: resp.email,
                    userId: resp.user_id,
                    fullName: resp.full_name,
                    passwordUpdate: resp.password_update
                })
            )

            return resp;
            
        } catch (error: any) {

            console.log(error)
            
            return error;
        }
    }

    const Logout = async () => {
        try {
            const resp = await postLogout();
            
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            
            dispatch(logoutSlice());

            return resp;
            
        } catch (error: any) {

            console.log(error);
            // Revisar
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            dispatch(logoutSlice());
            
            return error;
        }
    }

    const _passwordUpdate = async (data:PasswordUpdate) => {
        try {
            const resp = await postPasswordUpdate(data);
            return resp;
        } catch (error) {
            console.log(error)
            return error;
        }
    }

    const _passwordUpdateSlice = (passwordUpdate: boolean) => {
        dispatch(passwordUpdateSlice(passwordUpdate));
    }

  return {
    // Methods
    Login,
    Logout,
    _passwordUpdate,
    _passwordUpdateSlice,

    // Properties
    email,
    fullName,
    isAuthenticated,
    passwordUpdate,
  }
}