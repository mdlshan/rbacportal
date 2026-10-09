import { useEffect, useState } from "react"
import { getMe } from "../api"

function Header({ onLogout }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        getMe().then(setUser).catch(() => {})
    }, [])

    return (
        <header style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <span>{user ? `${user.username} (${user.role || "No role"})` : "Loading profile..."}</span>
                <button onClick={onLogout}>Log out</button>
            </div>
        </header>
    )
}

export default Header
