const navigation = [
    ["dashboard", "donut_small", "Dashboard"],
    ["groundops", "construction", "Ground operations"],
    ["maintenance", "plumbing", "Maintenance"],
    ["user", "people", "Users"],
];

export default function Sidebar({ page, setPage }) {
    return (
        <aside className="min-h-screen w-60 shrink-0 border-r border-gray-200 bg-white p-3">
            <nav aria-label="Main navigation" className="space-y-1">
                {navigation.map(([id, icon, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setPage(id)}
                        aria-current={page === id ? "page" : undefined}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left ${
                            page === id ? "bg-[#5081fc] text-white" : ""
                        }`}
                    >
                        <span aria-hidden="true" className="material-symbols-outlined">
                            {icon}
                        </span>
                        {label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}
