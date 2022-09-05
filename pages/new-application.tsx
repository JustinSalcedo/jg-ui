import { ChangeEvent, useContext, useEffect, useState } from "react"
import { Descendant } from "slate"
import Application from "../api/Application"
import ApplicationEditor from "../components/ApplicationEditor"
import { UserContext } from "../contexts/index"
import { draftToResume } from "../lib/resumeProcessor"
import { CustomElement, IApplication } from "../types/index"
import IResume from "../types/IResume"

export default function NewApplication() {
    const { userRecord, isLocallyAuth, logout } = useContext(UserContext)
    const application = new Application(true)

    const [loaded, setLoaded] = useState(false)
    const [loadedRecords, setLoadedRecords] = useState(false)
    const [jobAppData, setJobAppData] = useState(null as Partial<IApplication>)
    const [description, setDescription] = useState('')
    const [applicationRecord, setApplicationRecord] = useState(null as IResume)
    const [skills, setSkills] = useState([])
    const [resps, setResps] = useState([])
    const [masterResume, setMasterResume] = useState(null as IResume)
    const [userResume, setUserResume] = useState(null as IResume)
    const [draft, setDraft] = useState([] as Descendant[])
    const [resumeRecord, setResumeRecord] = useState(null as IResume)
    const [reset, setReset] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        if (saved) application.deleteLocalData()
        if (!loaded) loadData()
        if (loaded && !loadedRecords && isLocallyAuth) loadRecords(application.loadStage())
    }, [isLocallyAuth, jobAppData, description, skills, resps, saved])

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
            setUserResume(draftToResume(loadedDraft))
        }
        setLoaded(true)
    }

    async function loadRecords(stage: number) {
        // Loading application and master resume records implies the resume hasn't been saved
        try {
            if (stage > 0) {
                setApplicationRecord(await application.fetchApplication(userRecord._id))
            }
            if (stage > 1) {
                application.fetchMasterResume(userRecord._id)
                    .then(masterRecord => {setMasterResume(parseResume(masterRecord)); })
                    .catch(() => alert('No master resume configured'))
            }
            setLoadedRecords(true)
        } catch (error) {
            alert(error)
        }
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
            throw error
        }
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
            setSaved(true)
            alert('Saved!')
        } catch (error) {
            alert(error)
        }
    }

    // Reset user data
    ///////////////////

    const appEditorParams = { jobAppData, description, skills, resps, draft, userResume, masterResume, reset,
        processData, logout, handleJobAppData, handleDescription, addKeyword, deleteKeyword, handleDraft,
        submitResume, saveStage: application.saveStage.bind(application), loadStage: application.loadStage.bind(application) }

    return (
        <ApplicationEditor {...appEditorParams} />
    )
}

function parseResume({ basics, skills, certificates, education, work, projects }: IResume) {
    return { basics, skills, certificates, education, work, projects } as IResume
}