const API = "http://127.0.0.1:8000/api"

async function authorizedFetch(url) {
    const sendRequest = () => fetch(url, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
    })

    let response = await sendRequest()
    if (response.status !== 401) return response

    const refresh = localStorage.getItem("refresh")
    if (!refresh) return response

    const refreshResponse = await fetch(`${API}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    })

    if (!refreshResponse.ok) {
        logout()
        window.dispatchEvent(new Event("auth:logout"))
        return response
    }

    const tokens = await refreshResponse.json()
    localStorage.setItem("access", tokens.access)
    if (tokens.refresh) localStorage.setItem("refresh", tokens.refresh)
    response = await sendRequest()
    return response
}

export async function login(username, password) {
    const response = await fetch(`${API}/auth/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error("Invalid username or password")
    }

    localStorage.setItem("access", data.access)
    localStorage.setItem("refresh", data.refresh)

    return data
}

export async function getMe() {
    const response = await authorizedFetch(`${API}/me/`)

    if (!response.ok) {
        throw new Error("Authentication failed")
    }

    return response.json()
}

export async function getPage(endpoint) {
    const response = await authorizedFetch(`${API}/${endpoint}/`)

    return {
        status: response.status,
        data: await response.json(),
    }
}

export function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
}
