import { ChangeEventHandler } from "react"
import { IApplication } from "../types/index"
import Input from "./Input"
import styles from './Form.module.css';
import IResume from "../types/IResume";

export default function Form({ formData, formHandler, action }: {
    formData: IResume | IApplication
    formHandler: ChangeEventHandler
    action: string
}) {
    return (
        <form className={styles.form} action={action} method="POST">
            {Object.entries(formData).map(([key, value]) => (
                <Input key={key} name={key} value={value as string} handler={formHandler} />
            ))}
        </form>
    )
}