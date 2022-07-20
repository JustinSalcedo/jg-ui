import { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';
import formatLabels from '../lib/formatLabels';
import styles from './Input.module.css';

export default function Input({ name, label, value, type, handler } : {
    name: string, label?: string, type?: HTMLInputTypeAttribute
    value?: string, handler?: ChangeEventHandler }) {
    return (
        <div className={styles.group}>
            <label htmlFor={name}>{formatLabels(label ? label : name)}</label>
            {handler ? (
                <input className={styles.input} name={name} type={type || "text"} value={value || ''} onChange={handler} />
            ): (
                <input className={styles.input} name={name} type={type || "text"} value={value || ''} />
            )}
        </div>
    )
}