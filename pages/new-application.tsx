import Head from "next/head"
import Link from "next/link"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { Descendant } from "slate"
import Application from "../api/Application"
import Button from "../components/common/Button"
import Form from "../components/common/Form/Form"
import Panel from "../components/common/Panel"
import DraftEditor from "../components/DraftEditor"
import KwdsForm from "../components/KwdsForm"
import MatchCounter from "../components/MatchCounter"
import Textarea from "../components/Textarea"
import TextView from "../components/TextView"
import { SITE_TITLE } from "../constants/index"
import { UserContext } from "../contexts/index"
import Main from "../layout/Main"
import { draftToResume, draftToString } from "../lib/resumeProcessor"
import { ContainerView, CustomElement, IApplication } from "../types/index"
import IResume from "../types/IResume"

const STAGES = ['Job Description', 'Capture keywords', 'Write your resume']

export default function NewApplication() {
    const { userRecord, isLocallyAuth, logout } = useContext(UserContext)
    const application = new Application(true)

    const [stageNumber, setStageNumber] = useState(0)
    const [containerView, setContainerView] = useState('threePanel' as ContainerView)
    const [loaded, setLoaded] = useState(false)
    const [loadedRecords, setLoadedRecords] = useState(false)
    const [jobAppData, setJobAppData] = useState(null as Partial<IApplication>)
    const [description, setDescription] = useState('')
    const [applicationRecord, setApplicationRecord] = useState(null as IResume)
    const [inputTerm, setInputTerm] = useState('')
    const [skills, setSkills] = useState([])
    const [resps, setResps] = useState([])
    const [masterResume, setMasterResume] = useState(null as IResume)
    const [userResume, setUserResume] = useState(null as IResume)
    const [draft, setDraft] = useState([] as Descendant[])
    const [resumeRecord, setResumeRecord] = useState(null as IResume)
    const [lockedStage, setLockedStage] = useState(true)
    const [reset, setReset] = useState(false)

    useEffect(() => {
        if (!loaded) loadData()
        if (loaded && !loadedRecords && isLocallyAuth) loadRecords(stageNumber)
        validateStage()
    }, [isLocallyAuth, stageNumber, jobAppData, description, skills, resps])

    // Load data

    function loadData() {
        if (!jobAppData) {
            setJobAppData(application.loadJobApplication())
        }
        if (!description) {
            setDescription(application.loadJobDescription())
        }
        if (!skills.length && !resps.length) {
            const { skills, resps } = application.loadKeywords()
            setSkills(skills)
            setResps(resps)
        }
        if (!draft.length || (draft.length === 1 && !(draft[0] as CustomElement).children[0].text)) {
            const loadedDraft = application.loadDraft()
            setDraft(loadedDraft)
        }
        const loadedStage = application.loadStage()
        setStageNumber(loadedStage)
        defineContainerView(loadedStage)
        setLoaded(true)
    }

    async function loadRecords(stage: number) {
        try {
            if (stage > 0) {
                setApplicationRecord(await application.fetchApplication(userRecord._id))
            }
            if (stage > 1) {
                application.fetchResume(userRecord._id)
                    .then(resumePayload => {
                        setResumeRecord(resumePayload); setReset(true)
                        setUserResume(parseResume(resumePayload))
                    })
                application.fetchMasterResume(userRecord._id)
                    .then(masterRecord => {setMasterResume(parseResume(masterRecord)); setReset(true)})
                    .catch(() => alert('No master resume configured'))
            }
            setLoadedRecords(true)
        } catch (error) {
            alert(error)
        }
    }

    // Stages and view

    function defineContainerView(newStage: number) {
        // Job Description and Capture Keywords
        if (newStage === 0 || newStage === 1) setContainerView('twoPanel')
        // Write your Resume
        if (newStage === 2) setContainerView('threePanel')
    }

    async function navigateStages(way: 1 | -1) {
        const newStage = stageNumber + way
        if (way === 1) await processData(newStage as 1 | 2)
        defineContainerView(newStage)
        setStageNumber(newStage)
        application.saveStage(newStage)
    }

    // Process and validate

    async function processData(nextStage: 1 | 2) {
        try {
            if (nextStage === 1) {
                if (description && jobAppData) {
                    const applicationId = applicationRecord ? applicationRecord._id : null
                    const applicationPayload = await application.sendApplication(userRecord._id, {
                        ...jobAppData, jobDescription: description } as IApplication, applicationId)
                    setApplicationRecord(applicationPayload)
                }
            }
            if (nextStage === 2) {
                if (skills.length || resps.length) {
                    await application.sendKeywords(userRecord._id, applicationRecord._id, { skills, resps })
                    if (!masterResume) application.fetchMasterResume(userRecord._id)
                        .then(masterRecord => {setMasterResume(parseResume(masterRecord)); setReset(true)})
                        .catch(() => alert('No master resume configured'))
                }
            }
        } catch (error) {
            alert(error)
        }
    }

    function validateStage() {
        if (stageNumber === 0 && description && jobAppData && validateJobApp()
            || stageNumber === 1 && (skills.length || resps.length)
            || stageNumber === 2 && (draft.length === 1 && !(draft[0] as CustomElement).children[0].text)) {
            setLockedStage(false)
        } else {
            setLockedStage(true)
        }
    }

    function determineStagePosition(): 'first' | 'mid' | 'last' {
        if (stageNumber === 0) return 'first'
        if (stageNumber === 1) return 'mid'
        if (stageNumber === 2) return 'last' 
    }

    // Job description

    function handleJobAppData(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
        setJobAppData(oldData => {
            const newData = { ...oldData, [name]: value }
            application.saveJobApplication(newData)
            return newData
        })
    }

    function validateJobApp() {
        return Object.values(jobAppData).every(value => value)
    }

    function handleDescription(e: ChangeEvent<HTMLTextAreaElement>) {
        const { value } = e.target
        setDescription(value)
        application.saveJobDescription(value)
    }

    // Capture keywords

    function addKeyword(key: 'skills' | 'resps', value: string) {
        if (key === 'skills') {
            setSkills(skills => {
                application.saveKeywords({ skills, resps })
                return [...skills, value]
            })
        }
        if (key === 'resps') {
            setResps(resps => {
                application.saveKeywords({ skills, resps })
                return [...resps, value]
            })
        }
    }

    function deleteKeyword(key: 'skills' | 'resps', id: string | number) {
        if (key === 'skills') {
            setSkills(skills => {
                application.saveKeywords({ skills, resps })
                return skills.filter((_, index) => index !== id)
            })
        }
        if (key === 'resps') {
            setResps(resps => {
                application.saveKeywords({ skills, resps })
                return resps.filter((_, index) => index !== id)
            })
        }
    }

    // Write your resume

    function handleDraft(draft: Descendant[]) {
        try {
            setDraft(draft)
            application.saveDraft(draft)
            const parsedResume = draftToResume(draft, userResume)
            setUserResume(parsedResume)
            setReset(false)
        } catch (error) {
            
        }
    }

    async function submitResume() {
        try {
            const resumeId = resumeRecord ? resumeRecord._id : null
            setResumeRecord(await application.sendResume(userRecord._id, applicationRecord._id, userResume, draft, resumeId))
            alert('Saved!')
        } catch (error) {
            alert(error)
        }
    }

    // Reset user data
    ///////////////////

    return (
        <Main
            containerView={containerView} headerButtons={[
                <Link href="/"><a><Button type="secondary" size="sm">Home</Button></a></Link>,
                <Button type="primary" size="sm" clickHandler={() => logout()}>Sign Out</Button>
            ]}
            position={determineStagePosition()} navigateStages={navigateStages.bind(this)} lockedStage={lockedStage}
            stages={STAGES} activeStage={stageNumber} lastButton={ <Button type="primary" size="md" clickHandler={submitResume}>Save</Button> }
        >

            <Head>
                <title>{SITE_TITLE}</title>
                <meta charSet="utf-8" />
            </Head>

            {stageNumber === 0 ? (
                <>
                    <Panel place={1}>
                        <Form formData={jobAppData} formHandler={handleJobAppData} />
                    </Panel>
                    <Panel place={2}>
                        <Textarea text={description} handler={handleDescription} placeholder='Write or copy your target job description...' />
                    </Panel>
                </>
            ) : ''}
            {stageNumber === 1 ? (
                <>
                    <Panel place={1}>
                        <TextView content={description} input={inputTerm} skills={skills} resps={resps} />
                    </Panel>
                    <Panel place={2}>
                        <KwdsForm
                            value={inputTerm} setValue={setInputTerm.bind(this)} skills={skills} resps={resps}
                            addKeyword={addKeyword.bind(this)} deleteKeyword={deleteKeyword.bind(this)}
                        />
                    </Panel>
                </>
            ) : ''}
            {stageNumber === 2 ? (
                <>
                    <Panel place={1}>
                        <TextView content={description} input={inputTerm} skills={skills} resps={resps} />
                    </Panel>
                    <Panel place={2}>
                        <MatchCounter skills={skills} resps={resps} resume={draftToString(draft)} />
                    </Panel>
                    <Panel place={3}>
                        <DraftEditor resume={userResume || masterResume} draft={!reset ? draft : []} handleDraft={handleDraft} />
                    </Panel>
                </>
            ) : ''}
        </Main>
    )
}

function parseResume({ basics, skills, certificates, education, work, projects }: IResume) {
    return { basics, skills, certificates, education, work, projects } as IResume
}