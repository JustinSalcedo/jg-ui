import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../types/index";

export const API_URL = "http://localhost:3031/api/user"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === 'POST') {
            const { sub, name, email, email_verified } = req.body
            const user = await loginUser({ sub, name, email, email_verified })
            res.status(200).json(user)
        }
    } catch (error) {
        const { message }: Error = error
        res.status(500).json({ message })
    }
}

async function loginUser(inputUser: IUser): Promise<IUser> {
    try {
        const response = await fetch(API_URL + '/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputUser)
        })
        const user = await response.json()
        if (response.status !== 200) {
            const { message }: Error = user.errors
            throw new Error(message);
        }
        return user
    } catch (error) {
        throw error
    }
}