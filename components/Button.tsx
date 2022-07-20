import styles from './Button.module.css'
import cn from 'classnames'
import { MouseEventHandler } from 'react'

export default function Button({ children, type, clickHandler }: {
  children: React.ReactNode,
  type: 'primary' | 'secondary' | 'tertiary'
  clickHandler?: MouseEventHandler
}) {
  return (
    <button className={`${styles.button} ${styles.lg} ${cn({
        [styles.primary]: type === 'primary',
        [styles.secondary]: type === 'secondary',
        [styles.tertiary]: type === 'tertiary'
    })}`} onClick={clickHandler ? clickHandler : () => {}} >{children}</button>
  )
}
