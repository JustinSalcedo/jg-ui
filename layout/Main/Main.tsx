import styles from './Main.module.css'
import utilStyles from '../../styles/utils.module.css'
import cn from 'classnames'
import { ContainerView } from '../../types'
import Button from '../../components/common/Button'

export default function Main({
  children, containerView, navigation, headerButtons, navigateStages, firstButton, lastButton, lockedStage, stages, activeStage
}: {
  children: React.ReactNode
  containerView: ContainerView,
  headerButtons?: React.ReactNode[]
  navigation?: 'first' | 'mid' | 'last'
  navigateStages?: (way: 1 | -1) => void
  stages?: string[]
  activeStage?: number
  firstButton?: React.ReactNode
  lastButton?: React.ReactNode
  lockedStage? : boolean
}) {

  return (
    <>
      <div className={styles.screen}>
          <header className={styles.header}>
            <h1 className={utilStyles.heading1}>Job Gatherer</h1>
            {headerButtons ? ( <div>{headerButtons}</div> ) : ''}
          </header>
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
          {navigation === 'first' && (
            <div className={styles.navigation}>
                {firstButton || ''}
                <Button type={lockedStage ? 'disabled' : 'primary'} clickHandler={() => !lockedStage && navigateStages(1)}>Next</Button>
            </div>
          )}
          {navigation === 'mid' && (
            <div className={styles.navigation}>
                <Button type='secondary' clickHandler={() => navigateStages(-1)}>Back</Button>
                <Button type={lockedStage ? 'disabled' : 'primary'} clickHandler={() => !lockedStage && navigateStages(1)}>Next</Button>
            </div>
          )}
          {navigation === 'last' && (
            <div className={styles.navigation}>
                <Button type='secondary' clickHandler={() => navigateStages(-1)}>Back</Button>
                {lastButton || ''}
            </div>
          )}
      </div>
      <Footer/>
    </>
  )
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        <span>
          &copy; 2022. Designed &amp; Developed By <a className={styles['author-url']} href="https://justinsalcedo.com">Justin Salcedo</a>
        </span>
        <span className={styles['author-links']}>
          <a href="https://github.com/JustinSalcedo"><img src="https://tiny-timezones.herokuapp.com/assets/github-white.svg" alt="My GitHub" /></a>
          <a href="https://twitter.com/imjustinsalcedo"><img src="https://tiny-timezones.herokuapp.com/assets/twitter-white.svg" alt="My Twitter" /></a>
          <a href="https://www.linkedin.com/in/justin-salcedo-370a9b158"><img src="https://tiny-timezones.herokuapp.com/assets/linkedin-white.svg" alt="My LinkedIn" /></a>
          <a href="https://github.com/users/JustinSalcedo/projects/4">Source</a>
        </span>
      </p>
    </footer>
  )
}
