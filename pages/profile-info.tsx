import Head from "next/head";
import { ChangeEvent, useContext } from "react";
import Layout, { siteTitle } from "../components/Layout";
import Panel from "../components/Panel";
import { UserBasicsContext } from "../context/index";
import styles from '../components/Form.module.css'
import Input from "../components/Input";
import { useRouter } from "next/router";

export default function ProfileInfo() {
    const router = useRouter()
    const { userBasics, handleUserBasics } = useContext(UserBasicsContext)
    function handleBasics(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        handleUserBasics({
            [name]: value
        })
    }

    function handleLocation(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        const { location } = userBasics
        handleUserBasics({
            location: {
                ...location,
                [name]: value
            }
        })
    }

    function handleProfile(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        const firstProfile = userBasics.profiles[0]
        handleUserBasics({
            profiles: [{ ...firstProfile, [name.replace('profile_', '')]: value }]
        })
    }

    function navigateStages(way: 1 | -1) {
        if (way === -1) {
            window.localStorage.setItem('userBasics', JSON.stringify(userBasics))
            router.push('/')
        }
    }

    return (
        <Layout
            containerView="threePanel"
            navigation="last"
            navigateStages={navigateStages.bind(this)}
        >
            <Head>
                <title>{siteTitle}</title>
            </Head>

            <Panel place={2}>
                {/* TODO: map input types for url, email, phone, and image */}
                <form className={styles.form}>
                    {Object.entries(userBasics).map(([key, value]) => !['location', 'profiles'].includes(key) ? (
                        <Input key={key} name={key} value={value as string} handler={handleBasics} />
                    ) : '')}
                    {Object.entries(userBasics.location).map(([key, value]) => (
                        <Input key={key} name={key} value={value as string} handler={handleLocation} />
                    ))}
                    {/* TODO: append new profile items */}
                    {Object.entries(userBasics.profiles[0]).map(([key, value]) => (
                        <Input key={'profile_' + key} name={'profile_' + key} value={value as string} handler={handleProfile} />
                    ))}
                </form>
            </Panel>
        </Layout>
    )
}