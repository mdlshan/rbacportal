import { useEffect, useState } from "react"
import { getMe, getPage } from "../api"

const features = [
    ["Dashboard", "dashboard"],
    ["Ground operations", "groundops"],
    ["Maintenance", "maintenance"],
    ["Manage users / roles", "users"],
]

function Dashboard() {
    const [user, setUser] = useState(null)
    const [access, setAccess] = useState({})
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadDashboard() {
            try {
                const me = await getMe()
                setUser(me)
                const results = await Promise.all(features.map(([, endpoint]) => getPage(endpoint)))
                setAccess(Object.fromEntries(features.map(([name], index) => [name, results[index].status])))
            } catch {
                setError("log in again.")
            }
        }
        loadDashboard()
    }, [])

    if (error) return <p role="alert">{error}</p>
    if (!user) return <p>Loading dashboard...</p>

    return (
        <section>
            <h1>Dashboard</h1>
            


        </section>
    )
}

export default Dashboard
