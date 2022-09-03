import Head from "next/head";
import Link from "next/link";
import Button from "../../components/common/Button/Button";
import Footer from "../../components/common/Footer/Footer";
import Header from "../../components/common/Header";
import { SITE_TITLE } from "../../constants/index";
import { IApplication } from "../../types/index";
import styles from './Dashboard.module.css'
import utilStyles from '../../styles/utils.module.css'
import { dateToMonthDay } from "../../lib/formatDate";
import { shrinkTitle } from "../../lib/formatTitles";

export default function Dashboard({ applications }: { applications?: IApplication[] }) {
    return (
        <>
            <Head>
                <title>{SITE_TITLE}</title>
                <meta charSet="utf-8" />
            </Head>
            <div className={styles.screen}>
                <Header logo headerButtons={[
                    <Link href='/'><a><Button type="secondary" size="sm">Home</Button></a></Link>,
                    <Link href="/master-resume"><a><Button type='tertiary' size='sm' >Master Resume</Button></a></Link>
                ]} />
                <div className={styles.container}>
                    {applications && applications.length ? (
                        <ul className={styles.results + ' ' + utilStyles['hide-scrollbar']}>
                            {applications.map(application => ( <li key={application._id} className={styles.application}>
                                <Link href={"/application/" + application._id} ><a><h3>{shrinkTitle(application.title)}</h3></a></Link>
                                <span>{dateToMonthDay(application.createdAt)}</span>
                                <p>@ {application.companyName}</p>
                            </li> ))}
                        </ul>
                    ) : 'No applications yet'}
                </div>
            </div>
            <Footer />
        </>
    )
}