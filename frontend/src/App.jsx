import { useEffect, useState } from "react";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import GroundOperations from "./pages/groundops";
import Maintenance from "./pages/maintenance";
import Users from "./pages/users";
import Profile from "./pages/profile";
import Page from "./components/page";
import { getMe, logout } from "./api";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access")
  );
  const [page, setPage] = useState("dashboard");
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const handleSessionExpired = () => {
      setFeatures([]);
      setLoggedIn(false);
    };
    window.addEventListener("auth:logout", handleSessionExpired);
    return () => window.removeEventListener("auth:logout", handleSessionExpired);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const refreshFeatures = () => getMe().then((user) => setFeatures(user.features || [])).catch(() => {});
    refreshFeatures();
    window.addEventListener("roles:updated", refreshFeatures);
    return () => window.removeEventListener("roles:updated", refreshFeatures);
  }, [loggedIn]);

  if (!loggedIn) {
    return <Login onLogin={() => {
      setFeatures([]);
      setLoggedIn(true);
    }} />;
  }

  function handleLogout() {
    logout();
    setFeatures([]);
    setLoggedIn(false);
  }

  const pages = {
    dashboard: <Dashboard />,
    groundops: <GroundOperations />,
    maintenance: <Maintenance />,
    user: <Users />,
    profile: <Profile onLogout={handleLogout} />,
  };

  return (
    <Page
      page={page}
      setPage={setPage}
      features={features}
      onOpenProfile={() => setPage("profile")}
    >
      {pages[page]}
    </Page>
  );
}

export default App;
