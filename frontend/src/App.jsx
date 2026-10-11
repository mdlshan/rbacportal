import { useEffect, useState } from "react";

import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import GroundOperations from "./pages/groundops";
import Maintenance from "./pages/maintenance";
import Users from "./pages/users";
import Profile from "./pages/profile";
import Page from "./components/page";
import { logout } from "./api";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access")
  );
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const handleSessionExpired = () => setLoggedIn(false);
    window.addEventListener("auth:logout", handleSessionExpired);
    return () => window.removeEventListener("auth:logout", handleSessionExpired);
  }, []);

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  const pages = {
    dashboard: <Dashboard />,
    groundops: <GroundOperations />,
    maintenance: <Maintenance />,
    user: <Users />,
    profile: <Profile />,
  };

  return (
    <Page
      page={page}
      setPage={setPage}
      onOpenProfile={() => setPage("profile")}
      onLogout={() => {
        logout();
        setLoggedIn(false);
      }}
    >
      {pages[page]}
    </Page>
  );
}

export default App;
