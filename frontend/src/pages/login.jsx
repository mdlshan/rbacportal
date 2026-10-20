import { useState } from "react";
import { login as loginUser } from "../api";
export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); setError("");
    try { await loginUser(username, password); onLogin(); } catch (e) { setError(e.message); }
  }
  return <main className="login-shell"><div className="login-wrap"><section className="login-card">
    <h1 className="login-title">Login</h1>
    <form onSubmit={submit} className="stack-form">
      <label>Username<input required autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} /></label>
      <label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      <button className="button primary">Login</button>
    </form>
    {error && <p className="error-message" role="alert">{error}</p>}
  </section></div></main>;
}
