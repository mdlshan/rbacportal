import { useEffect, useState } from "react";
import { getMe } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe()
      .then((profile) => setUser(profile))
      .catch(() => {});
  }, []);

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="rounded-lg border border-gray-100 bg-[#eaf6ff] p-4">
        <h1 className="text-lg font-semibold">Profile</h1>
      </div>

      <div className="flex items-center rounded-lg border border-gray-100 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <span className="material-symbols-outlined text-gray-500">
              account_circle
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-lg font-semibold">{user.username}</p>
            <p>{user.role || "No role"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
