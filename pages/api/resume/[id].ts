import { NextApiRequest, NextApiResponse } from "next";
import Client from "../../../api/Client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = new Client('server')
        const { id } = req.query as { id: string }
        if (req.method === 'GET') {
            const { userid: userId, applicationid: applicationId } = req.headers
            const resume = await client.getResume(userId as string, applicationId as string, id)
            res.status(200).json(resume)
        }
        if (req.method === 'PATCH') {
            const { userId, applicationId, resume: inputResume } = req.body
            const updatedResume = await client.editResume(userId as string, applicationId as string, id, inputResume)
            res.status(200).json(updatedResume)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}