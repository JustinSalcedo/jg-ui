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
import { Application, ContainerView, Stage } from "../types/index";
import IResume from "../types/IResume";

const stageValues: Stage[] = ['writeApplication', 'captureKeywords', 'writeResume', 'formatResume']
const dummy = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

export default function NewApplication() {
    const [jobDescription, setJobDescription] = useState(dummy)
    const [containerView, setContainerView] = useState('twoPanel') as [ContainerView, Dispatch<SetStateAction<ContainerView>>]
    const [stage, setStage] = useState('writeApplication') as [Stage, Dispatch<SetStateAction<Stage>>]
    const [application, setApplication] = useState({
        title: "",
        companyName: "",
        position: "",
        website: ""
    }) as [Application, Dispatch<SetStateAction<Application>>]
    const [skills, setSkills] = useState([])
    const [resps, setResps] = useState([])
    const [draft, setDraft] = useState(resumeToText(dummyResume))
    // If resume is 'cold', we can post an update (in formatting resume stage)
    const [coldResume, setColdResume] = useState(true)
    // Set the cool-down interval before next update
    const [cooldown, setCooldown] = useState(null)
    const { newResume, handleNewResume } = useContext(NewResumeContext) as { newResume: IResume, handleNewResume: (resume: IResume) => void }

    function handleTextarea(e: ChangeEvent) {
        const { value } = e.target as HTMLTextAreaElement
        setJobDescription(value)
    }

    function handleInputChange(e: ChangeEvent) {
        const { name, value }  = e.target as HTMLInputElement
        setApplication(application => ({
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
            saveDraft(value)
        }
    }

    function saveDraft(plainText: string) {
        if (coldResume) {
            // updateResume(plainText, handleNewResume)
            console.log('updated')
            setColdResume(false)
            setCooldown(setInterval(() => {
                setColdResume(true),
                console.log(coldResume)
                setCooldown(cooldown => clearInterval(cooldown))
            }, 5000))
        }
    }

    function updateResume(plainText: string, handleNewResume: (newResume: IResume) => void) {
        const formattedResume = textToResume(plainText, newResume)
        fetch(`/api/resumes/${newResume._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formattedResume)
        })
            .then(res => res.json())
            .then(data => {
                handleNewResume(data)
            })
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
            navigateStates={navigateStages.bind(this)}
        >
            <Head>
                <title>{siteTitle}</title>
            </Head>

            {stage === "writeApplication" && (
                <>
                    <Panel place={1}>
                        <Form
                            formData={application}
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
                        <ResumePreview text={draft} resume={dummyResume} />
                    </Panel>
                </>
            )}
        </Layout>
    )
}
