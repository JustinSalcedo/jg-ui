import styles from './Button.module.css'
import cn from 'classnames'
import { MouseEventHandler } from 'react'

export default function Button({ children, type, size, clickHandler }: {
  children: React.ReactNode
  type: 'primary' | 'secondary' | 'tertiary' | 'disabled'
  size?: 'lg' | 'md' | 'sm'
  clickHandler?: MouseEventHandler
}) {
  return (
    <button className={`${styles.button} ${cn({
        [styles.lg]: size === 'lg',
        [styles.md]: !size || size === 'md',
        [styles.sm]: size === 'sm'
    })} ${cn({
        [styles.primary]: type === 'primary',
        [styles.secondary]: type === 'secondary',
        [styles.tertiary]: type === 'tertiary',
        [styles.disabled]: type === 'disabled'
    })}`} onClick={clickHandler ? clickHandler : () => {}} >{children}</button>
  )
}
