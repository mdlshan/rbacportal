import { useEffect, useState } from "react"
import { getPage } from "../api"
import AccessDenied from "./accessDenied"

function Maintenance() {
    const [status, setStatus] = useState(null)

    useEffect(() => {
        getPage("maintenance").then((result) => {
            setStatus(result.status)
        })
    }, [])

    if (status === 403) {
        return <AccessDenied />
    }

    if (status === 401) {
        return <h1>401 - Authentication required</h1>
    }

    if (status === 200) {
        return <section className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-[#eaf6ff] p-4">
      <h1 className="text-lg font-semibold">Maintenance</h1>
    </div>
        </section>
    }

    return <p>Loading...</p>
}

export default Maintenance
