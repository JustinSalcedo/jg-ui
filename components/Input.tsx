import { ChangeEventHandler } from 'react';
import formatLabels from '../lib/formatLabels';
import styles from './Input.module.css';

export default function Input({ name, label, value, handler } : { name: string, label: string, value: string, handler: ChangeEventHandler }) {
    return (
        <div className={styles.group}>
            <label htmlFor={name}>{formatLabels(label)}</label>
            <input className={styles.input} name={name} type="text" value={value} onChange={handler} />
        </div>
    )
}