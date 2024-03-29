import Head from "next/head"
import Button from "../components/common/Button"
import Main from "../layout/Main"
import { SITE_TITLE } from "../constants"
import Panel from "../components/common/Panel/Panel"
import Textarea from "../components/Textarea"
import KwdsForm from "../components/KwdsForm/KwdsForm"
import { ChangeEvent, useContext, useEffect, useMemo, useState } from "react"
import { ContainerView, CustomElement } from "../types/index"
import TextView from "../components/TextView/TextView"
import MatchCounter from "../components/MatchCounter/MatchCounter"
import Application from "../api/Application"
import DraftEditor from "../components/DraftEditor"
import Resume from "../lib/Resume"
import { Descendant } from "slate"
import { DEFAULT_DRAFT } from "../constants"
import { UserContext } from "../contexts/index"
import Menu from "../layout/Menu/Menu"
import { draftToString } from "../lib/resumeProcessor"

const STAGES = ['Job Description', 'Capture keywords', 'Write your resume']

export default function Home() {
    const { isAuth, isLocallyAuth } = useContext(UserContext)
    if (!(isAuth || isLocallyAuth)) return (<GuestHome />)
    else return (<UserHome />)
}

function GuestHome() {
    const { login } = useContext(UserContext)
    const application = new Application()
    const resume = new Resume()

    const loadedResume = useMemo(() => resume.getSampleResume(), [])

    const [stageNumber, setStageNumber] = useState(0)
    const [containerView, setContainerView] = useState('threePanel' as ContainerView)
    const [loaded, setLoaded] = useState(false)
    const [description, setDescription] = useState('')
    const [inputTerm, setInputTerm] = useState('')
    const [skills, setSkills] = useState([])
    const [resps, setResps] = useState([])
    const [guestResume, setGuestResume] = useState(loadedResume)
    const [draft, setDraft] = useState([])
    const [lockedStage, setLockedStage] = useState(true)

    useEffect(() => {
        if (!loaded) {
            loadData()
        }
        validateStage()
    }, [stageNumber, description, skills, resps])

    function loadData() {
        if (!description) {
            setDescription(application.loadJobDescription())
        }
        if (!skills.length && !resps.length) {
            const { skills, resps } = application.loadKeywords()
            setSkills(skills)
            setResps(resps)
        }
        if (draft.length === 1 && !(draft[0] as CustomElement).children[0].text) {
            const loadedDraft = application.loadDraft()
            setDraft(loadedDraft)
        }
        const loadedStage = application.loadStage()
        setStageNumber(loadedStage)
        defineContainerView(loadedStage)
        setLoaded(true)
    }

    function defineContainerView(newStage: number) {
        // Job Description or Write your resume
        if (newStage === 0 || newStage === 2) {
            setContainerView('threePanel')
        }
        // Capture Keywords
        if (newStage === 1) {
            setContainerView('twoPanel')
        }
    }

    function navigateStages(way: 1 | -1) {
        const newStage = stageNumber + way
        // if (way === 1) processData(newStage as 1 | 2)
        defineContainerView(newStage)
        setStageNumber(newStage)
        application.saveStage(newStage)
    }

    // function processData(nextStage: 1 | 2) {
    //     try {
    //         if (nextStage === 1) {
    //             if (description) {
    //                 application.saveJobDescription(description)
    //             }
    //         }
    //         if (nextStage === 2) {
    //             if (skills.length || resps.length) {
    //                 application.saveKeywords({ skills, resps })
    //             }
    //         }
    //     } catch (error) {
    //         alert(error)
    //     }
    // }

    function validateStage() {
        if (stageNumber === 0 && description
            || stageNumber === 1 && (skills.length || resps.length)) {
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

    // Job description stage

    function handleDescription(e: ChangeEvent<HTMLTextAreaElement>) {
        const { value } = e.target
        setDescription(value)
        application.saveJobDescription(value)
    }

    // Capture keywords stage

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

    // Write your resume stage

    function handleDraft(draft: Descendant[]) {
        setDraft(draft)
        application.saveDraft(draft)
    }

    // Reset guest data

    function handleReset() {
        alert('You will start a new application')
        application.deleteLocalData()
        setDescription('')
        setInputTerm('')
        setSkills([])
        setResps([])
        setDraft(DEFAULT_DRAFT)
        setStageNumber(0)
        application.saveStage(0)
    }

    // User login

    function handleLogin() {
        login()
    }

    return (
        <Main
            containerView={containerView} headerButtons={[ <Button type="primary" size="sm" clickHandler={() => handleLogin()}>Sign In</Button> ]}
            position={determineStagePosition()} navigateStages={navigateStages.bind(this)} lockedStage={lockedStage}
            stages={STAGES} activeStage={stageNumber} lastButton={ <Button type="tertiary" size="md" clickHandler={() => handleReset()}>Reset</Button> }
        >

            <Head>
                <title>{SITE_TITLE}</title>
                <meta charSet="utf-8" />
            </Head>

            {stageNumber === 0 ? (
                <Panel place={2}>
                    <Textarea text={description} handler={handleDescription} placeholder='Write or copy your target job description...' />
                </Panel>
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
                        <DraftEditor resume={guestResume} draft={draft} handleDraft={handleDraft} />
                    </Panel>
                </>
            ) : ''}
        </Main>
    )
}

function UserHome() {
    const { userRecord, isLoading } = useContext(UserContext)

    return (
        <>
            {userRecord ? (<Menu />) : (isLoading ? 'loading...' : 'Error')}
        </>
    )
}