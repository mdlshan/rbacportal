export default function Sidebar({ setPage }) {
    return (
        <aside>
            <button onClick={() => setPage("dashboard")}>dashboard</button>
            <button onClick={() => setPage("groundops")}>Ground operations</button>
            <button onClick={() => setPage("maintenance")}>Maintenance</button>
            <button onClick={() => setPage("user")}>Users</button>
        </aside>
    );
}
