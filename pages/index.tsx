import Head from "next/head"
import Link from "next/link"
import Button from "../components/Button"
import Layout from "../components/Layout"
import { siteTitle } from "../components/Layout"

export default function Home() {
    return (
        <Layout containerView="home">
            <Head>
                <title>{siteTitle}</title>
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