import Header from "./header";
import Sidebar from "./sidebar";

function Page({ children, page, setPage, onLogout, onOpenProfile }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar page={page} setPage={setPage} />
            <div className="min-w-0 flex-1">
                <Header onLogout={onLogout} onOpenProfile={onOpenProfile} />
                <main className="mx-auto w-full max-w-screen-2xl p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Page;
