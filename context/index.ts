import { createContext } from "react";
import Resume from "../lib/Resume";
import { IBasics } from "../types/IResume";

export const NewResumeContext = createContext({})
export const UserBasicsContext = createContext({
    userBasics: new Resume().getBasics(),
    handleUserBasics: (inputBasics: IBasics) => {}
})