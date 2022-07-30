import styles from './Panel.module.css'
import cn from 'classnames'

export default function Panel({ children, place }: { children: React.ReactNode, place: 1 | 2 | 3 }) {
  return (
    <section className={`${styles.panel} ${cn({
      [styles['panel-1']]: place === 1,
      [styles['panel-2']]: place === 2,
      [styles['panel-3']]: place === 3
    })}`}>
        {children}
    </section>
  )
}
