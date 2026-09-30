import { useEffect, useState } from "react"
import { getPage } from "../api"

function Maintenance() {
    const [status, setStatus] = useState(null)

    useEffect(() => {
        getPage("maintenance").then((result) => {
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
        return <h1>Maintenance</h1>
    }

    return <p>Loading...</p>
}

export default Maintenance