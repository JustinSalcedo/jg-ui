import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import { useEffect, useState } from "react"
import NavyBlueByDv from "../../../components/resume-layouts/NavyBlueByDv"
import IResume from "../../../types/IResume"
import { getResume as getFreshResume } from "../../../api/client"

const API_URL = "http://localhost:3031/api/resume"

export async function getServerSideProps({ params, query }: GetServerSidePropsContext) {
    const { id } = params
    const { scale, page, skillview } = query
    const resume = await getResume(id as string)
    if (!resume) {
        return {
            notFound: true
        }
    }

    return { props: {
        resume,
        scale: scale ? parseFloat(scale as string) : 1,
        page: page ? parseInt(page as string) : 1,
        skillview: skillview ? parseInt(skillview as string) : 0,
    } }
}

export default function RenderResume({ resume, scale, page, skillview }: { resume: IResume, scale: number, page: number, skillview: number } /*InferGetServerSidePropsType<typeof getServerSideProps>*/ ) {
    // const refresh = useRefreshRoot()
    const [freshResume, setFreshResume] = useState(resume)
    // let refresh = null

    useEffect(() => {
        const interval = setInterval(() => {
            getFreshResume(freshResume._id)
                .then(resume => setFreshResume(resume))
        }, 5000)

        return () => clearInterval(interval)
    }, [freshResume])

    return (
        <NavyBlueByDv resume={freshResume} scale={scale} page={page} skillview={skillview} />
    )
}

async function getResume(id: string): Promise<IResume> {
    try {
        const response = await fetch(`${API_URL}/${id}`)
        const resume = await response.json()
        if (response.status !== 200) {
            const { message }: Error = resume.errors
            throw new Error(message);
        }
        return resume
    } catch (error) {
        throw error
    }
}