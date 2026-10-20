import Icon from "./icon";
const navigation = [
  ["dashboard", "dashboard", "Dashboard", ""],
  ["groundops", "ground", "Ground operations", "ground"],
  ["maintenance", "maintenance", "Maintenance", "maintenance"],
  ["user", "users", "Users", "users"],
];
export default function Sidebar({ page, setPage, features = [] }) {
  return <aside className="sidebar"><nav aria-label="Main navigation">
    {navigation.filter(([, , , feature]) => feature !== "users" || features.includes("users")).map(([id, icon, label]) =>
      <button key={id} title={label} aria-label={label} onClick={() => setPage(id)} aria-current={page === id ? "page" : undefined} className={page === id ? "nav-button selected" : "nav-button"}><Icon name={icon} />{label}</button>
    )}
  </nav></aside>;
}
