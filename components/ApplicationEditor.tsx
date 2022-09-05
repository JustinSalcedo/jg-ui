import Head from "next/head";
import Link from "next/link";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Descendant } from "slate";
import { SITE_TITLE } from "../constants/index";
import Main from "../layout/Main/Main";
import { draftToString } from "../lib/resumeProcessor";
import { ContainerView, CustomElement, IApplication } from "../types/index";
import IResume from "../types/IResume";
import Button from "./common/Button/Button";
import Form from "./common/Form/Form";
import Panel from "./common/Panel/Panel";
import DraftEditor from "./DraftEditor";
import KwdsForm from "./KwdsForm/KwdsForm";
import MatchCounter from "./MatchCounter/MatchCounter";
import Textarea from "./Textarea";
import TextView from "./TextView/TextView";

const STAGES = ['Job Description', 'Capture keywords', 'Write your resume']

export default function ApplicationEditor({
    jobAppData, description, skills, resps, draft,
    userResume, masterResume, reset,
    processData, logout, handleJobAppData, handleDescription,
    addKeyword, deleteKeyword, handleDraft,
    submitResume, saveStage, loadStage
}: {
    jobAppData: Partial<IApplication>, description: string, skills: string[], resps: string[]
    draft: Descendant[], userResume: IResume, masterResume: IResume, reset: boolean
    processData: (newStage: 1 | 2) => Promise<void>, logout: () => void
    handleJobAppData: ChangeEventHandler<HTMLInputElement>, handleDescription: ChangeEventHandler<HTMLTextAreaElement>
    addKeyword: (key: 'skills' | 'resps', value: string) => void
    deleteKeyword: (key: 'skills' | 'resps', id: string | number) => void
    handleDraft: (draft: Descendant[]) => void, submitResume: () => void
    saveStage?: (stage: number) => void, loadStage?: () => number
}) {

    const [stageNumber, setStageNumber] = useState(0)
    const [containerView, setContainerView] = useState('twoPanel' as ContainerView)
    const [inputTerm, setInputTerm] = useState('')
    const [lockedStage, setLockedStage] = useState(true)

    useEffect(() => {
        if (loadStage) {
            setStageNumber(loadStage())
            defineContainerView(loadStage())
        }
        validateStage()
    }, [stageNumber, jobAppData, description, skills, resps])

    // Stages and view

    function defineContainerView(newStage: number) {
        // Job Description and Capture Keywords
        if (newStage === 0 || newStage === 1) setContainerView('twoPanel')
        // Write your Resume
        if (newStage === 2) setContainerView('threePanel')
    }

    async function navigateStages(way: 1 | -1) {
        try {
            const newStage = stageNumber + way
            if (way === 1) await processData(newStage as 1 | 2)
            defineContainerView(newStage)
            setStageNumber(newStage)
            if (saveStage) saveStage(newStage)
        } catch (error) {
            alert(error)
        }
    }

    // Process and validate

    function validateStage() {
        if (stageNumber === 0 && description && jobAppData && validateJobApp()
            || stageNumber === 1 && (skills.length || resps.length)
            || stageNumber === 2 && (draft.length === 1 && !(draft[0] as CustomElement).children[0].text)) {
            setLockedStage(false)
        } else {
            setLockedStage(true)
        }
    }

    function validateJobApp() {
        return Object.values(jobAppData).every(value => value)
    }

    function determineStagePosition(): 'first' | 'mid' | 'last' {
        if (stageNumber === 0) return 'first'
        if (stageNumber === 1) return 'mid'
        if (stageNumber === 2) return 'last' 
    }

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