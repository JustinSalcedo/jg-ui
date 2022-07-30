import styles from './Main.module.css'
import cn from 'classnames'
import { ContainerView } from '../../types'
import Button from '../../components/common/Button'

export const siteTitle = "Job Gatherer"

export default function Layout({ children, containerView, navigation, navigateStages, firstButton, lastButton }: {
  children: React.ReactNode
  containerView: ContainerView
  navigation?: 'first' | 'mid' | 'last'
  navigateStages?: (way: 1 | -1) => void
  firstButton?: React.ReactNode,
  lastButton?: React.ReactNode
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
              {firstButton || ''}
              <Button type='primary' clickHandler={() => navigateStages(1)}>Next</Button>
          </div>
        )}
        {navigation === 'mid' && (
          <div className={styles.navigation}>
              <Button type='secondary' clickHandler={() => navigateStages(-1)}>Back</Button>
              <Button type='primary' clickHandler={() => navigateStages(1)}>Next</Button>
          </div>
        )}
        {navigation === 'last' && (
          <div className={styles.navigation}>
              <Button type='secondary' clickHandler={() => navigateStages(-1)}>Back</Button>
              {lastButton || ''}
          </div>
        )}
    </div>
  )
}
