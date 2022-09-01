import Head from "next/head";
import { ChangeEvent, useContext } from "react";
import Layout from "../layout/Main";
import Panel from "../components/common/Panel";
import { UserContext } from "../contexts/index";
import Input from "../components/common/Input";
import { useRouter } from "next/router";
import { SITE_TITLE } from "../constants/index";

export default function ProfileInfo() {
    const router = useRouter()
    const { userBasics, handleUserBasics } = useContext(UserContext)
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
                <title>{SITE_TITLE}</title>
            </Head>

            <Panel place={2}>
                {/* TODO: map input types for url, email, phone, and image */}
                <form>
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
                {/* @ts-ignore */}
                <style jsx>{`
                    form {
                        width: 100%;
                        height: 100%;
                        overflow-y: scroll;
                        font-size: .75rem;
                        padding: 1rem;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: min-content;
                        column-gap: 1rem;
                        row-gap: 1rem;
                        background-color: white;
                    }
                `}</style>
            </Panel>
        </Layout>
    )
}