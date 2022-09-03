import { useContext, useEffect, useState } from "react";
import Client from "../api/Client";
import { UserContext } from "../contexts/index";
import Dashboard from "../layout/Dashboard";
import { IApplication } from "../types/index";

const client = new Client('router')

export default function UserDashboard() {
    const { userRecord, isLocallyAuth } = useContext(UserContext)

    const [applications, setApplications] = useState([] as IApplication[])
    const [loadedRecords, setLoadedRecords] = useState(false)

    useEffect(() => {
        if (isLocallyAuth && !loadedRecords) loadRecords()
    }, [isLocallyAuth])

    function loadRecords() {
        client.getAllApplications(userRecord._id).then(applications => setApplications(applications))
        setLoadedRecords(true)
    }

    return (
        <Dashboard applications={applications} />
    )
}