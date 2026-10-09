import { useEffect, useState } from "react";
import { getMe } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  useEffect(() => { getMe().then(setUser).catch(() => {}); }, []);

  if (!user) return <p>Loading profile...</p>;
  return <section><h1>Profile</h1><p>{user.username}</p><p>{user.role || "No role"}</p></section>;
}
