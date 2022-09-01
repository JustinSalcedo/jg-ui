import Head from "next/head"
import Link from "next/link"
import Button from "../components/common/Button/index"
import Layout from "../layout/Main/index"
import { SITE_TITLE } from "../constants/index"

export default function Home() {
    return (
        <Layout containerView="home">
            <Head>
                <title>{SITE_TITLE}</title>
            </Head>

            <Button type="secondary">Past applications</Button>
            <Link href="/new-application">
                <a>
                    <Button type="primary">New application</Button>
                </a>
            </Link>
            <Link href="/profile-info">
                <a>
                    <Button type="tertiary">Profile info</Button>
                </a>
            </Link>
        </Layout>
    )
}