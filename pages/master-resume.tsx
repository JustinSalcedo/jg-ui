import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import { Descendant } from 'slate'
import Client from '../api/Client'
import Navigation from '../components/common/Navigation'
import Panel from '../components/common/Panel/Panel'
import DraftEditor from '../components/DraftEditor'
import ResumeForm from '../components/ResumeForm'
import { SAMPLE_RESUME } from '../constants/index'
import { UserContext } from '../contexts/index'
import Main from '../layout/Main'
import { draftToResume } from '../lib/resumeProcessor'
import IResume from '../types/IResume'

export default function MasterResume() {
    const { userRecord, isLocallyAuth } = useContext(UserContext)
    const client = new Client('router')
    const router = useRouter()

    const [resume, setResume] = useState(SAMPLE_RESUME)
    const [draft, setDraft] = useState([] as Descendant[])
    const [reset, setReset] = useState(false)
    const [masterResume, setMasterResume] = useState(null as IResume)
    const [loaded, setLoaded] = useState(false)

    // If resume is 'cold', we can refresh the draft
    const [coldResume, setColdResume] = useState(true)
    // Set the cool-down interval before next update
    const [cooldown, setCooldown] = useState(null)
    // Delay auto-refresh by last letter typed
    const [delayRefresh, setDelayRefresh] = useState(null)

    useEffect(() => {
        if (!loaded && isLocallyAuth) loadData()
    }, [])

    function loadData() {
        client.getMasterResume(userRecord._id)
            .then(resumeRecord => {
                setMasterResume(resumeRecord); setResume(resumeRecord)
                setReset(true)
            })
            .catch((e: Error) => e.message !== 'Undefined response'
                && alert('Something bad happened'))
        setLoaded(true)
    }

    function cooldownSequence() {
        if (coldResume) {
            setReset(true)
            setColdResume(false)
            setCooldown(setInterval(() => {
                setColdResume(true),
                setCooldown((cooldown: NodeJS.Timeout) => clearInterval(cooldown))
            }, 2000))
            return
        }
        setDelayRefresh((delayRefresh: NodeJS.Timeout) => {
            if (delayRefresh) clearInterval(delayRefresh)
            return setInterval(() => {
                setReset(true)
                setDelayRefresh((delayRefresh: NodeJS.Timeout) => clearInterval(delayRefresh))
            }, 2000)
        })
    }

    function handleResume(resume: IResume) {
        setResume(resume)
        cooldownSequence()
    }

    function handleDraft(draft: Descendant[]) {
        try {
            setDraft(draft)
            const parsedResume = draftToResume(draft, resume)
            setResume(parsedResume)
            setReset(false)
        } catch (error) {
            // console.log('Empty draft')
        }
    }

    async function navigateStages(way: 1 | -1) {
        try {
            if (way === 1) {
                const savedResume = masterResume
                    ? await client.editMasterResume(userRecord._id, resume)
                    : await client.createMasterResume(userRecord._id, resume)
                setMasterResume(savedResume)
                alert('Saved!')
            }
            if (way === -1) return router.push('/')
        } catch (error) {
            alert(error)
        }
    }

    return (
        <Main containerView='twoPanel' customNavigation={
            <Navigation navigateStages={navigateStages} leftButton="Back Home" rightButton="Save Resume" />
        }>
            <Panel place={1}>
                <ResumeForm resume={resume} handleResume={handleResume}/>
            </Panel>
            <Panel place={2}>
                <DraftEditor resume={resume} draft={!reset ? draft : []} handleDraft={handleDraft} />
            </Panel>
        </Main>
    )
}