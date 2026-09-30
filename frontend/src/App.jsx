import { useState } from "react"

import Login from "./pages/login"
import Page from "./components/page"

import Dashboard from "./pages/dashboard"
import GroundOperations from "./pages/groundops"
import Maintenance from "./pages/maintenance"
import Users from "./pages/users"
import { logout } from "./api"

function App() {
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("access")
    )

    const [page, setPage] = useState("dashboard")

    if (!loggedIn) {
        return <Login onLogin={() => setLoggedIn(true)} />
    }

    const pages = {
        dashboard: <Dashboard />,
        groundops: <GroundOperations />,
        maintenance: <Maintenance />,
        user: <Users />,
    }

    return (
        <Page setPage={setPage} onLogout={() => { logout(); setLoggedIn(false) }}>
            {pages[page]}
        </Page>
    )
}

export default App
