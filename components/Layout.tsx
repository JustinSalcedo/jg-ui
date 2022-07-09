import styles from './Layout.module.css'
import cn from 'classnames'

export const siteTitle = "Job Gatherer"

export default function Layout({ children, containerView }: { children: React.ReactNode, containerView: 'home' | 'threePanel' | 'twoPanel' }) {
  return (
    <div className={styles.screen}>
        <div className={cn({
            [styles.home]: containerView === 'home',
            [styles.threePanel]: containerView === 'threePanel'
        })}>
            {children}
        </div>
    </div>
  )
}
