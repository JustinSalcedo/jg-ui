import Head from "next/head";
import Link from "next/link";
import Button from "../../components/common/Button/Button";
import Footer from "../../components/common/Footer/Footer";
import Header from "../../components/common/Header";
import { SITE_TITLE } from "../../constants/index";
import styles from './Menu.module.css'

export default function Menu() {
    return (
        <>
            <Head>
                <title>{SITE_TITLE}</title>
                <meta charSet="utf-8" />
            </Head>
            <div className={styles.screen}>
                <Header headerButtons={[ <Link href="/master-resume" key={0} ><a><Button type='tertiary' size='sm' >Master Resume</Button></a></Link> ]} ></Header>
                <main className={styles.container}>
                    <h1>Job Gatherer</h1>
                    <h2 className={styles.subheading} >A minimal keyword tracker and resume editor</h2>
                    <div className={styles.buttons}>
                        <Link href="/dashboard"><a><Button type='secondary' size='md' >Applications</Button></a></Link>
                        <Link href="/new-application"><a><Button type='primary' size='md' >New Resume</Button></a></Link>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    )
}