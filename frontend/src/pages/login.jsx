import { useState } from "react"
import { login as loginUser } from "../api"

function Login({ onLogin }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")

        try {
            await loginUser(username, password)
            onLogin()
        } catch {
            setError("Invalid username or password")
        }
    }




return (
        <main className="h-screen flex items-center justify-center">
    <div className="w-full max-w-sm">
        
        <h1 className="text-2xl font-bold ">
            Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">

            <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border p-3"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-3"
            />

            <button
                type="submit"
                className="bg-black text-white p-3"
            >
                Login
            </button>

        </form>

        {error && <p className="mt-4">{error}</p>}

    </div>
</main>
    )
}

export default Login