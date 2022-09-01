import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Descendant } from "slate";
import Client from "../../api/Client";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Navigation from "../../components/common/Navigation";
import Panel from "../../components/common/Panel";
import DraftEditor from "../../components/DraftEditor";
import MatchCounter from "../../components/MatchCounter";
import TextView from "../../components/TextView/index";
import { SITE_TITLE } from "../../constants/index";
import { UserContext } from "../../contexts/index";
import Main from "../../layout/Main";
import { resumeToText } from "../../lib/resumeProcessor";
import { IApplication } from "../../types/index";
import IResume from "../../types/IResume";

const client = new Client('router')

export default function ApplicationPreview() {
    const router = useRouter() 
    const { id } = router.query

    const { userRecord } = useContext(UserContext)

    const [application, setApplication] = useState(null as IApplication)
    const [loaded, setLoaded] = useState(false)
    const [stage, setStage] = useState(0)
    const [resume, setResume] = useState(null as IResume)
    const [draft, setDraft] = useState([] as Descendant[])

    useEffect(() => {
        if (!application && !loaded) client.getApplication(userRecord._id, id as string)
            .then(application => { setApplication(application); setLoaded(true) })
            .catch(() => setLoaded(true))
    }, [])

    function navigateStages(way: 1 | -1) {
        if (way === 1) {
            client.getResume(userRecord._id, application._id, application.resume)
                .then(resume => { setResume(resume); setStage(stage => stage + way) })
                .catch(e => alert(e))
        } else {
            setStage(stage => stage + way)
        }
    }

    function parseApplication() {
        const { title, companyName, position, website } = application
        return { title, companyName, position, website }
    }

    return (
        <>
            {loaded ? (application ? (
                <Main containerView='twoPanel' headerButtons={[
                    <Link href='/'><a><Button type="secondary" size="sm">Home</Button></a></Link>
                ]}
                    customNavigation={ <Navigation
                        navigateStages={navigateStages} position={stage ? 'last' : 'first'}
                        rightButton='See Resume' leftButton="See Application"
                    /> }
                >
                    <Head>
                        <title>{SITE_TITLE}</title>
                        <meta charSet="utf-8" />
                    </Head>
                    {stage === 0 ? (
                        <>
                            <Panel place={1}>
                                <Form formData={parseApplication()} ></Form>
                            </Panel>
                            <Panel place={2} >
                                <TextView
                                    content={application.jobDescription}
                                    skills={application.skillKeywords.map(({keyword}) => keyword)}
                                    resps={application.responsibilities}
                                />
                            </Panel>
                        </>
                    ) : ''}
                    {stage === 1 ? (
                        <>
                            <Panel place={1}>
                                <MatchCounter
                                    skills={application.skillKeywords.map(({keyword}) => keyword)}
                                    resps={application.responsibilities} resume={resumeToText(resume)}
                                />
                            </Panel>
                            <Panel place={2} >
                                <DraftEditor resume={resume} draft={draft} handleDraft={setDraft} readOnly />
                            </Panel>
                        </>
                    ) : ''}
                </Main>
            ) : 'Not found') : 'Loading...'}
        </>
    )
}