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
        <main>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>

            {error && <p>{error}</p>}
        </main>
    )
}

export default Login