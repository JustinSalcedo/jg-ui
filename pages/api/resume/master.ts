import { NextApiRequest, NextApiResponse } from "next";
import Client from "../../../api/Client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = new Client('server')
        if (req.method === 'POST') {
            const { userId, resume: inputResume } = req.body
            const newResume = await client.createMasterResume(userId, inputResume)
            res.status(201).json(newResume)
        }
        if (req.method === 'GET') {
            const { userid: userId } = req.headers
            const resume = await client.getMasterResume(userId as string)
            res.status(200).json(resume)
        }
        if (req.method === 'PATCH') {
            const { userId, resume: inputResume } = req.body
            const updatedResume = await client.editMasterResume(userId, inputResume)
            res.status(200).json(updatedResume)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}