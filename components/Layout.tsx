import styles from './Layout.module.css'
import cn from 'classnames'
import { ContainerView } from '../types/index'
import Button from './Button'

export const siteTitle = "Job Gatherer"

export default function Layout({ children, containerView, navigation, navigateStates }: {
  children: React.ReactNode
  containerView: ContainerView
  navigation?: 'first' | 'mid' | 'last'
  navigateStates?: (way: 1 | -1) => void
}) {

  return (
    <div className={styles.screen}>
        <div className={cn({
            [styles.home]: containerView === 'home',
            [styles.twoPanel]: containerView === 'twoPanel',
            [styles.threePanel]: containerView === 'threePanel'
        })}>
            {children}
        </div>
        {navigation === 'first' && (
          <div className={styles.navigation}>
              <Button type='primary' clickHandler={() => navigateStates(1)}>Next</Button>
          </div>
        )}
        {navigation === 'mid' && (
          <div className={styles.navigation}>
              <Button type='secondary' clickHandler={() => navigateStates(-1)}>Back</Button>
              <Button type='primary' clickHandler={() => navigateStates(1)}>Next</Button>
          </div>
        )}
        {navigation === 'last' && (
          <div className={styles.navigation}>
              <Button type='secondary' clickHandler={() => navigateStates(-1)}>Back</Button>
          </div>
        )}
    </div>
  )
}
