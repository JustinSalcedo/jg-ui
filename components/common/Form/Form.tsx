import { ChangeEventHandler, FocusEventHandler, ReactNode } from "react"
import { IApplication, IElement } from "../../../types"
import Input from "../Input"
import styles from './Form.module.css';
import IResume, { IBasics } from "../../../types/IResume";
import utilStyles from '../../../styles/utils.module.css'

export default function Form({ formData, formHandler, action, additionalInputs, registerFocus }: {
    /* Form only accepts resumes and applications,
        which are the only API entry points available
        for POST */
    formData: IResume | Partial<IApplication> | IElement | IBasics
    formHandler?: ChangeEventHandler<HTMLInputElement>
    action?: string, additionalInputs?: ReactNode
    registerFocus?: (isFocused: boolean) => void
}) {
    return (
        <form onFocus={registerFocus && (() => registerFocus(true))} onBlur={registerFocus && (() => registerFocus(false))} className={styles.form + ' ' + utilStyles['hide-scrollbar']} action={action || ''} method="POST">
            {formData ? Object.entries(formData).map(([key, value]) => (
                <Input key={key} name={key} value={value as string} handler={formHandler} />
            )) : ''}
            {additionalInputs || ''}
        </form>
    )
}