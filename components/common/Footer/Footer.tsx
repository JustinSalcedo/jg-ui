import styles from './Footer.module.css'

export default function Footer() {
    return (
        <>
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
        </>
    )
}