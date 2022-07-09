import styles from './Button.module.css'
import cn from 'classnames'

export default function Button({ children, type }: { children: React.ReactNode, type: string }) {
  return (
    <button className={`${styles.button} ${styles.lg} ${cn({
        [styles.primary]: type === 'primary',
        [styles.secondary]: type === 'secondary',
        [styles.tertiary]: type === 'tertiary'
    })}`} >{children}</button>
  )
}
