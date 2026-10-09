import { useEffect, useState } from "react"
import { getMe } from "../api"

function Header({ onLogout, onOpenProfile }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        getMe().then(setUser).catch(() => {})
    }, [])

    return (
        <header className="flex  justify-end px-6 py-4 border-b border-gray-200 bg-white">
            
            <div className="flex items-center gap-4">
                <div className="relative group">
    <button type="button" onClick={onOpenProfile} aria-label="Open profile" className="material-symbols-outlined cursor-pointer">account_circle</button>
</div>
                <div className="relative group">
                    <span onClick={onLogout}class="material-symbols-outlined">logout</span>
                </div>
                
            </div>
        </header>
    )
}

export default Header
