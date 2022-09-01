import styles from './Main.module.css'
import cn from 'classnames'
import { ContainerView } from '../../types'
import Header from '../../components/common/Header'
import Footer from '../../components/common/Footer'
import Navigation from '../../components/common/Navigation'

export default function Main({
  children, containerView, position, headerButtons, navigateStages,
  firstButton, lastButton, lockedStage, stages, activeStage, customNavigation
}: {
  children: React.ReactNode
  containerView: ContainerView,
  headerButtons?: React.ReactNode[]
  customNavigation?: React.ReactNode
  position?: 'first' | 'mid' | 'last'
  navigateStages?: (way: 1 | -1) => void
  stages?: string[]
  activeStage?: number
  firstButton?: React.ReactNode
  lastButton?: React.ReactNode
  lockedStage?: boolean
}) {

  return (
    <>
      <div className={styles.screen}>
          <Header headerButtons={headerButtons} logo></Header>
          {stages && stages.length ? (
            <ul className={styles.stages}>
              {stages.map((stage, idx) => (
                <li key={idx} className={activeStage === idx ? styles.active : ''}>{stage}</li>
              ))}
            </ul>
          ) : ''}
          <div className={cn({
              [styles.home]: containerView === 'home',
              [styles.twoPanel]: containerView === 'twoPanel',
              [styles.threePanel]: containerView === 'threePanel'
          })}>
              {children}
          </div>
          {customNavigation ? (customNavigation) : (
            <Navigation
              navigateStages={navigateStages} position={position} firstButton={firstButton}
              lastButton={lastButton} lockedStage={lockedStage}
            />
          )}
      </div>
      <Footer/>
    </>
  )
}
