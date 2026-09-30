import Header from "./header"
import Sidebar from "./sidebar"

function Page({ children, setPage, onLogout }) {
    return (
        <>
            <Header onLogout={onLogout} />

            <div>
                <Sidebar setPage={setPage} />

                <main>
                    {children}
                </main>
            </div>
        </>
    )
}

export default Page
