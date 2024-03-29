import Head from "next/head";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from "react";
import Form from "../components/common/Form/index";
import KwdsForm from "../components/KwdsForm/index";
import Layout from "../layout/Main/index";
import MatchCounter from "../components/MatchCounter/index";
import Panel from "../components/common/Panel/index";
import ResumePreview from "../components/ResumePreview/index";
import DraftTxtArea from "../components/DraftTxtArea";
import Textarea from "../components/Textarea";
import TextView from "../components/TextView/index";
import { UserContext } from "../contexts/index";
import { resumeToText, textToResume } from "../lib/resumeProcessor";
import { IApplication, ContainerView, Stage, IElementType, IElement } from "../types/index";
import IResume from "../types/IResume";
import { addLists, createApplication, createResume, editApplication, editResume } from "../api/Client";
import Button from "../components/common/Button/index";
import Resume from "../lib/Resume";
import Link from "next/link";
import { SITE_TITLE } from "../constants/index";

const stageValues: Stage[] = ['writeApplication', 'captureKeywords', 'writeResume', 'formatResume']
const typeToKey = {
    skill: "skills",
    education: "education",
    cert: "certificates",
    work: "work",
    project: "projects"
}

export default function NewApplication() {
    const { userBasics } = useContext(UserContext)

    const [jobDescription, setJobDescription] = useState('')
    const [containerView, setContainerView] = useState('twoPanel') as [ContainerView, Dispatch<SetStateAction<ContainerView>>]
    const [stage, setStage] = useState('writeApplication') as [Stage, Dispatch<SetStateAction<Stage>>]
    const [applicationMetadata, setApplicationMetadata] = useState({
        title: "",
        companyName: "",
        position: "",
        website: ""
    }) as [IApplication, Dispatch<SetStateAction<IApplication>>]
    const [inputTerm, setInputTerm] = useState("")
    const [skills, setSkills] = useState([])
    const [resps, setResps] = useState([])
    const [draft, setDraft] = useState(resumeToText(new Resume(true, userBasics).getResume()))
    // If resume is 'cold', we can post an update (in formatting resume stage)
    const [coldResume, setColdResume] = useState(true)
    // Set the cool-down interval before next update
    const [cooldown, setCooldown] = useState(null)
    const [newResume, setNewResume] = useState(new Resume(false, userBasics).getResume()) as [IResume, Dispatch<SetStateAction<IResume>>]
    // const [printAction, setPrintAction] = useState(null)
    let printAction = null

    function handleTextarea(e: ChangeEvent) {
        const { value } = e.target as HTMLTextAreaElement
        setJobDescription(value)
    }

    function handleInputChange(e: ChangeEvent) {
        const { name, value }  = e.target as HTMLInputElement
        setApplicationMetadata(application => ({
            ...application,
            [name]: value
        }))
    }

    function addKeyword(key: 'skills' | 'resps', value: string) {
        if (key === 'skills') {
            return setSkills(skills => ([...skills, value]))
        }
        if (key === 'resps') {
            return setResps(resps => ([...resps, value]))
        }
    }

    function deleteKeyword(key: 'skills' | 'resps', id: string | number) {
        if (key === 'skills') {
            return setSkills(skills => skills.filter((_, index) => index !== id))
        }
        if (key === 'resps') {
            return setResps(resps => resps.filter((_, index) => index !== id))
        }
    }

    function handleNewElement(type: IElementType, element: IElement) {
        setNewResume(resume => ({
            ...resume,
            [typeToKey[type]]: [ ...resume[typeToKey[type]], element ]
        }))
    }

    function handleDraft(e: ChangeEvent, newDraft?: string) {
        if (newDraft) {
            setDraft(newDraft)
        } else {
            const { value } = e.target as HTMLTextAreaElement
            setDraft(value)
        }
        if (stage === "formatResume") {
            saveDraft()
        }
    }

    function handleApplication(application: IApplication) {
        setJobDescription(application.jobDescription)
        setApplicationMetadata(data => {
            delete application.jobDescription
            delete application.skillKeywords
            delete application.responsibilities
            if (data._id) {
                delete application._id
            }
            return application
        })
        if (application.position) {
            setNewResume(resume => ({ ...resume, basics: { ...resume.basics, label: application.position } }))
        }
    }

    function saveDraft() {
        if (coldResume) {
            const updatedResume = textToResume(draft, newResume)
            const { _id } = newResume
            editResume(_id, updatedResume)
                .then(resume => {
                    setNewResume(resume)
                    setColdResume(false)
                    setCooldown(setInterval(() => {
                        setColdResume(true),
                        setCooldown(cooldown => clearInterval(cooldown))
                    }, 5000))
                })
                .catch(e => alert(e))
        }
    }

    function handlePrint(callback: () => void) {
        return callback()
    }

    function determineStagePosition(): 'first' | 'mid' | 'last' {
        const index = stageValues.findIndex(value => value === stage)
        if (!index) {
            return 'first'
        }
        if (index === stageValues.length - 1) {
            return 'last'
        }
        return 'mid'
    }

    function processData(way: 1 | -1) {
        if (way === 1) {
            if (stage === "writeApplication") {
                if (!applicationMetadata._id) {
                    console.log("Creating application")
                    createApplication({ ...applicationMetadata, jobDescription })
                        .then(application => {
                            handleApplication(application)
                            navigateStages(way)
                        })
                        .catch(e => alert(e))
                } else {
                    console.log("Editing application")
                    editApplication(applicationMetadata._id, { ...applicationMetadata, jobDescription })
                        .then(application => {
                            handleApplication(application)
                            navigateStages(way)
                        })
                        .catch(e => alert(e))
                }
            }
            if (stage === "captureKeywords") {
                if (skills.length || resps.length) {
                    console.log("Adding lists")
                    addLists(applicationMetadata._id, skills.map(skill => ({ keyword: skill })), resps)
                        .then(application => {
                            setSkills(application.skillKeywords.map(({ keyword }) => keyword))
                            setResps(application.responsibilities)
                            navigateStages(way)
                        })
                        .catch(e => alert(e))
                }
            }
            if (stage === "writeResume") {
                const parsedResume = textToResume(draft, newResume)
                console.log(parsedResume)
                if(!newResume._id) {
                    console.log("Creating resume")
                    createResume(applicationMetadata._id, parsedResume)
                        .then(resume => {
                            setNewResume(resume)
                            navigateStages(way)
                        })
                        .catch(e => alert(e))
                } else {
                    console.log("Updating resume")
                    editResume(newResume._id, parsedResume)
                        .then(resume => {
                            setNewResume(resume)
                            navigateStages(way)
                        })
                }
            }
        } else navigateStages(way)
    }

    function navigateStages(way: 1 | -1) {
        const index = stageValues.findIndex(value => value === stage)
        if (index + way === 2) {
            setContainerView('threePanel')
        } else {
            setContainerView('twoPanel')
        }
        setStage(stageValues[index + way])
    }

    return (
        <Layout
            containerView={containerView}
            navigation={determineStagePosition()}
            navigateStages={processData.bind(this)}
            firstButton={<Link href="/"><a><Button type="secondary">Home</Button></a></Link>}
            lastButton={<Button type="tertiary" clickHandler={() => handlePrint(printAction)} >Print</Button>}
        >
            <Head>
                <title>{SITE_TITLE}</title>
            </Head>

            {stage === "writeApplication" && (
                <>
                    <Panel place={1}>
                        <Form
                            formData={parseData(applicationMetadata)}
                            formHandler={handleInputChange.bind(this)}
                            action="/api/application"
                        />
                    </Panel>
                    <Panel place={2}>
                        <Textarea text={jobDescription} handler={handleTextarea.bind(this)}></Textarea>
                    </Panel>
                </>
            )}

            {stage === "captureKeywords" && (
                <>
                    <Panel place={1}>
                        <TextView
                            input={inputTerm} content={jobDescription}
                            skills={skills} resps={resps}
                        />
                    </Panel>
                    <Panel place={2}>
                        <KwdsForm
                            value={inputTerm} setValue={setInputTerm.bind(this)}
                            skills={skills} resps={resps}
                            addKeyword={addKeyword.bind(this)}
                            deleteKeyword={deleteKeyword.bind(this)}
                        />
                    </Panel>
                </>
            )}

            {stage === "writeResume" && (
                <>
                    <Panel place={1}>
                        <TextView
                            input={inputTerm} content={jobDescription}
                            skills={skills} resps={resps}
                        />
                    </Panel>
                    <Panel place={2}>
                        <MatchCounter skills={skills} resps={resps} resume={draft.toLowerCase()} ></MatchCounter>
                    </Panel>
                    <Panel place={3}>
                        <DraftTxtArea text={draft} handler={handleDraft} updateResume={handleNewElement} />
                    </Panel>
                </>
            )}

            {stage === "formatResume" && (
                <>
                    <Panel place={1}>
                        <DraftTxtArea text={draft} handler={handleDraft} updateResume={handleNewElement} />
                    </Panel>
                    <Panel place={2}>
                        <ResumePreview id={newResume._id} setPrintAction={callback => printAction = callback} />
                    </Panel>
                </>
            )}
        </Layout>
    )
}

function parseData(obj: IApplication | IResume) {
    delete obj._id
    delete obj.__v
    delete obj.createdAt
    delete obj.updatedAt
    return obj
}