import { ChangeEventHandler } from "react"
import { Application } from "../types/index"
import Input from "./Input"
import styles from './Form.module.css';

export default function Form({ formData, formHandler, action }: {
    formData: {
        [key: string]: string | Date
    } | Application
    formHandler: ChangeEventHandler
    action: string
}) {
    return (
        <form className={styles.form} action={action} method="POST">
            {Object.entries(formData).map(([key, value]) => (
                <Input key={key} name={key} label={key} value={value as string} handler={formHandler} />
            ))}
        </form>
    )
}