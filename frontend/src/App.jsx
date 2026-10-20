import { useEffect, useState } from "react";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import GroundOperations from "./pages/groundops";
import Maintenance from "./pages/maintenance";
import Users from "./pages/users";
import Profile from "./pages/profile";
import Page from "./components/page";
import { getMe, logout } from "./api";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access"));
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  useEffect(() => {
    const expired = () => { setUser(null); setLoggedIn(false); };
    window.addEventListener("auth:logout", expired);
    return () => window.removeEventListener("auth:logout", expired);
  }, []);
  useEffect(() => {
    if (!loggedIn) return;
    const loadUser = () => getMe().then(setUser).catch(() => {});
    loadUser();
    window.addEventListener("roles:updated", loadUser);
    return () => window.removeEventListener("roles:updated", loadUser);
  }, [loggedIn]);
  function handleLogout() { logout(); setUser(null); setLoggedIn(false); setPage("dashboard"); }
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  const pages = {
    dashboard: <Dashboard />, groundops: <GroundOperations />, maintenance: <Maintenance />,
    user: <Users />, profile: <Profile onLogout={handleLogout} />,
  };
  return <Page page={page} setPage={setPage} features={user?.features || []} onOpenProfile={() => setPage("profile")}>{pages[page] || <Dashboard />}</Page>;
}
