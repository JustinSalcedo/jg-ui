import { NextApiRequest, NextApiResponse } from "next";
import IResume from "../../../types/IResume";
import { API_URL } from "./index";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query as { id: string }
        if (req.method === 'GET') {
            const resume = await getResume(id)
            res.status(200).json(resume)
        }
        if (req.method === 'PATCH') {
            const { resume: inputResume } = req.body
            const updatedResume = await editResume(id, inputResume)
            res.status(200).json(updatedResume)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
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

async function editResume(id: string, inputResume: IResume): Promise<IResume> {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ resume: inputResume })
        })
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