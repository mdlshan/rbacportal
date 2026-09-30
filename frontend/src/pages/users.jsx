import { useEffect, useState } from "react"
import { getPage } from "../api"

function Users() {
    const [status, setStatus] = useState(null)

    useEffect(() => {
        getPage("users").then((result) => {
            setStatus(result.status)
        })
    }, [])

    if (status === 403) {
        return <h1>403 - Access denied</h1>
    }

    if (status === 401) {
        return <h1>401 - Authentication required</h1>
    }

    if (status === 200) {
        return <h1>Users</h1>
    }

    return <p>Loading...</p>
}

export default Users