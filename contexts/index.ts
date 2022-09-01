import { createContext } from "react";
import { IUser } from "../types/index";

export const UserContext = createContext({
    userRecord: null as IUser,
    handleUserRecord: (inputUser: IUser) => {},
    login: async (options?: any) => {},
    isAuth: false,
    isLoading: false,
    logout: async (options?: any) => {},
    isLocallyAuth: false
})