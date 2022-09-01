import { useContext, useEffect, useState } from "react";
import Client from "../api/Client";
import { UserContext } from "../contexts/index";
import Dashboard from "../layout/Dashboard/Dashboard";
import { IApplication } from "../types/index";

const client = new Client('router')

export default function UserDashboard() {
    const { userRecord } = useContext(UserContext)

    const [applications, setApplications] = useState([] as IApplication[])

    useEffect(() => {
        client.getAllApplications(userRecord._id).then(applications => setApplications(applications))
    }, [])

    return (
        <Dashboard applications={applications} />
    )
}