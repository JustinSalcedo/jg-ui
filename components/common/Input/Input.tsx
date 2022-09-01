import { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';
import formatLabels from '../../../lib/formatLabels';
import styles from './Input.module.css';

export default function Input({ name, label, value, type, handler, long } : {
    name: string, label?: string, type?: HTMLInputTypeAttribute | 'textarea'
    value?: string, handler?: ChangeEventHandler, long?: boolean }) {
    return (
        <div className={styles.group + (long ? ' ' + styles.long : '')}>
            <label htmlFor={name}>{formatLabels(label ? label : name)}</label>
            {type === 'textarea' ? (
                <textarea className={styles.input} name={name} value={value || ''} onChange={handler ? handler : () => {}} disabled={!handler}></textarea>
            ): (
                <input draggable={false} className={styles.input} name={name} type={type || "text"} value={value || ''} onChange={handler ? handler : () => {}} disabled={!handler} />
            )}
        </div>
    )
}