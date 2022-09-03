import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Descendant } from "slate";
import Client from "../../api/Client";
import ApplicationEditor from "../../components/ApplicationEditor";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import Navigation from "../../components/common/Navigation";
import Panel from "../../components/common/Panel";
import DraftEditor from "../../components/DraftEditor";
import MatchCounter from "../../components/MatchCounter";
import TextView from "../../components/TextView/index";
import { SAMPLE_RESUME, SITE_TITLE } from "../../constants/index";
import { UserContext } from "../../contexts/index";
import Main from "../../layout/Main";
import { draftToResume, resumeToText } from "../../lib/resumeProcessor";
import { IApplication, IUser } from "../../types/index";
import IResume from "../../types/IResume";

const client = new Client('router')

export default function ApplicationPage() {
    const router = useRouter() 
    const { id } = router.query

    const { userRecord, isLocallyAuth, logout } = useContext(UserContext)

    const [edit, setEdit] = useState(false)

    const [application, setApplication] = useState(null as IApplication)
    const [loaded, setLoaded] = useState(false)

    // Edit mode
    const [jobAppData, setJobAppData] = useState(null as Partial<IApplication>)
    const [description, setDescription] = useState('')
    const [skills, setSkills] = useState([] as string[])
    const [resps, setResps] = useState([] as string[])
    const [draft, setDraft] = useState([] as Descendant[])
    // Resumes
    const [masterResume, setMasterResume] = useState(null as IResume)
    const [userResume, setUserResume] = useState(null as IResume)
    const [reset, setReset] = useState(false)

    useEffect(() => {
        if (isLocallyAuth && !application && !loaded) client.getApplication(userRecord._id, id as string)
            .then(application => { setApplication(application); loadData(application) })
            .catch(() => setLoaded(true))
    }, [isLocallyAuth])

    // Load data from application

    function loadData(application: IApplication) {
        // An application record has at least job data and description
        const { title, companyName, position, website } = application
        setJobAppData({ title, companyName, position, website })

        setDescription(application.jobDescription)

        if (application.skillKeywords) setSkills(application.skillKeywords.map(({keyword}) => keyword))
        if (application.responsibilities) setResps(application.responsibilities)

        setLoaded(true)
    }

    // Process

    async function processPreviewData(newStage: number) {
        try {
            if (newStage === 1 && !userResume) {
                const resume = await client.getResume(userRecord._id, application._id, application.resume)
                setUserResume(resume)
            }
        } catch (error) {
            throw error
        }
    }

    async function processEditData(nextStage: 1 | 2) {
        try {
            const { _id } = application
            if (nextStage === 1 && (description && jobAppData)) {
                const applicationPayload = await (client.editApplication(userRecord._id, _id, {
                    ...jobAppData, jobDescription: description } as IApplication
                ))
                setApplication(applicationPayload)
            }
            if (nextStage === 2 && (skills.length || resps.length)) {
                await client.addLists(userRecord._id, _id, skills.map(skill => ({ keyword: skill })), resps)
                if (!userResume && application.resume) {
                    const resumeRecord = await client.getResume(userRecord._id, _id, application.resume)
                    setUserResume(resumeRecord)
                }
                if (!masterResume && userRecord.masterResume) {
                    const masterRecord = await client.getMasterResume(userRecord._id)
                    setMasterResume(masterRecord)
                }
                if (!application.resume && !userRecord.masterResume) {
                    alert('No master resume configured to prefill this resume')
                    setMasterResume(SAMPLE_RESUME)
                }
                setReset(true)
            }
        } catch (error) {
            throw error
        }
    }

    // Toggle preview/edit mode

    function toggleEditMode() {
        setEdit(edit => !edit)
    }

    // Job description

    function handleJobAppData(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setJobAppData(oldData => ({ ...oldData, [name]: value }))
    }

    function handleDescription(e: ChangeEvent<HTMLTextAreaElement>) {
        const { value } = e.target
        setDescription(value)
    }

    // Capture keywords

    function addKeyword(key: 'skills' | 'resps', value: string) {
        if (key === 'skills') {
            setSkills(skills => [...skills, value])
        }
        if (key === 'resps') {
            setResps(resps => [...resps, value])
        }
    }

    function deleteKeyword(key: 'skills' | 'resps', id: string | number) {
        if (key === 'skills') {
            setSkills(skills => skills.filter((_, index) => index !== id))
        }
        if (key === 'resps') {
            setResps(resps => resps.filter((_, index) => index !== id))
        }
    }

    // Write your resume

    function handleDraft(draft: Descendant[]) {
        try {
            setDraft(draft)
            setUserResume(draftToResume(draft, userResume))
            setReset(false)
        } catch (error) {
            
        }
    }

    async function submitResume() {
        try {
            const { _id } = application
            const resumeId = application.resume || null
            const resumeRecord = await (resumeId
                ? client.editResume(userRecord._id, _id, resumeId, userResume)
                : client.createResume(userRecord._id, _id, userResume))
            setUserResume(resumeRecord)
            if (!application.resume) setApplication(application => ({ ...application, resume: resumeRecord._id }))
            alert('Saved!')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>
            {loaded ? (application ? (
                !edit
                    ? ( <ApplicationPreview
                            application={application} resume={userResume}
                            processData={processPreviewData}
                            switchMode={toggleEditMode}
                        /> )
                    : ( <ApplicationEditor
                            jobAppData={jobAppData} description={description}
                            skills={skills} resps={resps} draft={draft} reset={reset}
                            userResume={userResume} masterResume={masterResume}
                            processData={processEditData} logout={logout}
                            handleJobAppData={handleJobAppData} handleDescription={handleDescription}
                            addKeyword={addKeyword} deleteKeyword={deleteKeyword}
                            handleDraft={handleDraft} submitResume={submitResume}
                        /> )
            ) : 'Not Found') : 'Loading...'}
        </>
    )
}

export function ApplicationPreview({ switchMode, application, resume, processData }: {
    application: IApplication, resume: IResume
    processData: (newStage: number) => Promise<void>
    switchMode?: () => void
}) {

    const [stage, setStage] = useState(0)
    const [draft, setDraft] = useState([] as Descendant[])
    const [lockedStage, setLockedStage] = useState(true)

    useEffect(() => {
        validateStage()
    }, [])

    async function navigateStages(way: 1 | -1) {
        try {
            if (way === 1) {
                await processData(stage + way)
            }
            setStage(stage => stage + way)
        } catch (error) {
            alert(error)
        }
    }

    function parseApplication() {
        const { title, companyName, position, website } = application
        return { title, companyName, position, website }
    }

    function validateStage() {
        if ((stage === 0 && application.resume) || stage === 1) return setLockedStage(false)
        setLockedStage(true)
    }

    const editButton = <Button type="tertiary" clickHandler={switchMode}>Edit</Button>

    return (
        <Main containerView='twoPanel' headerButtons={[
            <Link href='/'><a><Button type="secondary" size="sm">Home</Button></a></Link>
        ]}
            customNavigation={ <Navigation
                navigateStages={navigateStages} position={stage ? 'last' : 'first'} lockedStage={lockedStage}
                rightButton='See Resume' leftButton="See Application" fixedButton={editButton}
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
    )
}