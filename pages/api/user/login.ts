import { NextApiRequest, NextApiResponse } from "next";
import Client from "../../../api/Client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const client = new Client('server')
            const { sub, name, email, email_verified } = req.body
            const user = await client.loginUser({ sub, name, email, email_verified })
            res.status(200).json(user)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}