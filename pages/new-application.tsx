import Head from "next/head";
import { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from "react";
import Form from "../components/Form";
import KwdsForm from "../components/KwdsForm";
import Layout, { siteTitle } from "../components/Layout";
import MatchCounter from "../components/MatchCounter";
import Panel from "../components/Panel";
import ResumePreview from "../components/ResumePreview";
import DraftTxtArea from "../components/DraftTxtArea";
import Textarea from "../components/Textarea";
import TextView from "../components/TextView";
import { NewResumeContext } from "../context/index";
import dummyResume from "../lib/resume";
import { resumeToText, textToResume } from "../lib/resumeProcessor";
import { IApplication, ContainerView, Stage, ISkillKwd } from "../types/index";
import IResume from "../types/IResume";
import sampleResume from "../lib/sampleResume";
import { addLists, createApplication, createResume, editApplication, editResume } from "../lib/clientAPI";

const stageValues: Stage[] = ['writeApplication', 'captureKeywords', 'writeResume', 'formatResume']
const dummy = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

export default function NewApplication() {
    const [jobDescription, setJobDescription] = useState(dummy)
    const [containerView, setContainerView] = useState('twoPanel') as [ContainerView, Dispatch<SetStateAction<ContainerView>>]
    const [stage, setStage] = useState('writeApplication') as [Stage, Dispatch<SetStateAction<Stage>>]
    const [applicationMetadata, setApplicationMetadata] = useState({
        title: "Holy",
        companyName: "Molly",
        position: "Carpenter",
        website: "https://panini.com"
    }) as [IApplication, Dispatch<SetStateAction<IApplication>>]
    const [skills, setSkills] = useState([])
    const [resps, setResps] = useState([])
    const [draft, setDraft] = useState(resumeToText(dummyResume))
    // If resume is 'cold', we can post an update (in formatting resume stage)
    const [coldResume, setColdResume] = useState(true)
    // Set the cool-down interval before next update
    const [cooldown, setCooldown] = useState(null)
    // const { newResume, handleNewResume } = useContext(NewResumeContext) as { newResume: IResume, handleNewResume: (resume: IResume) => void }
    const [newResume, setNewResume] = useState(sampleResume) as [IResume, Dispatch<SetStateAction<IResume>>]

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

    function handleDraft(e: ChangeEvent) {
        const { value } = e.target as HTMLTextAreaElement
        setDraft(value)
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
    }

    function saveDraft() {
        if (coldResume) {
            console.log('Saving resume')
            const updatedResume = textToResume(draft, newResume)
            const { _id } = newResume
            // console.log(newResume)
            editResume(_id, updatedResume)
                .then(resume => {
                    setNewResume(resume)
                    setColdResume(false)
                    setCooldown(setInterval(() => {
                        setColdResume(true),
                        console.log(coldResume)
                        setCooldown(cooldown => clearInterval(cooldown))
                    }, 5000))
                })
                .catch(e => alert(e))
        }
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
                if(!newResume._id) {
                    console.log("Creating resume")
                    const parsedResume = textToResume(draft, newResume)
                    // console.log(parsedResume)
                    createResume(applicationMetadata._id, parsedResume)
                        .then(resume => {
                            console.log(resume)
                            setNewResume(resume)
                            navigateStages(way)
                        })
                        .catch(e => alert(e))
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
        >
            <Head>
                <title>{siteTitle}</title>
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
                        <TextView content={jobDescription}></TextView>
                    </Panel>
                    <Panel place={2}>
                        <KwdsForm
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
                        <TextView content={jobDescription + '\n' + jobDescription}></TextView>
                    </Panel>
                    <Panel place={2}>
                        <MatchCounter skills={skills} resps={resps} resume={draft.toLowerCase()} ></MatchCounter>
                    </Panel>
                    <Panel place={3}>
                        <DraftTxtArea text={draft} handler={handleDraft} />
                    </Panel>
                </>
            )}

            {stage === "formatResume" && (
                <>
                    <Panel place={1}>
                        <DraftTxtArea text={draft} handler={handleDraft} />
                    </Panel>
                    <Panel place={2}>
                        <ResumePreview id={newResume._id} />
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