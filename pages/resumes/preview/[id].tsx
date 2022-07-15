import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import NavyBlueByDv from "../../../components/resume-layouts/NavyBlueByDv"
import IResume from "../../../types/IResume"

const API_URL = "http://localhost:3031/api/resume"

export async function getServerSideProps({ params, query }: GetServerSidePropsContext) {
    const { id } = params
    const { scale } = query
    const resume = await getResume(id as string)
    if (!resume) {
        return {
            notFound: true
        }
    }

    return { props: { resume, scale: scale ? parseFloat(scale as string) : 1 } }
}

export default function RenderResume({ resume, scale }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <NavyBlueByDv resume={resume} scale={scale} />
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