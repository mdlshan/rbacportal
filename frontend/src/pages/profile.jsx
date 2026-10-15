import { useEffect, useState } from "react";
import { getMe, updateMyProfile } from "../api";
import ProfileEdit from "./profileedit";

export default function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getMe().then(setUser).catch(() => setError("Could not load profile."));
  }, []);

  async function saveProfile(form) {
    try {
      const updatedProfile = await updateMyProfile(form);
      setUser({ ...user, ...updatedProfile });
      setEditing(false);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  }

  if (!user) return <p>{error || "Loading profile..."}</p>;

  const links = [
    ["Instagram", user.instagram_url],
    ["Facebook", user.facebook_url],
    ["LinkedIn", user.linkedin_url],
    ["X", user.reddit_url],
    ["Website", user.website_url],
  ].filter(([, url]) => url);

  
return (
  <section className="flex flex-col gap-5">
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-[#eaf6ff] p-4">
      <h1 className="text-lg font-semibold">Profile</h1>
    </div>

    {editing ? (
      <ProfileEdit
        profile={user}
        onSave={saveProfile}
        onCancel={() => setEditing(false)}
      />
    ) : (
      <>
        {/* Basic Profile */}
       
<div className="rounded-lg border border-gray-100 bg-white p-4">
 <div className="flex w-full items-center gap-5">

                <span className="material-symbols-outlined rounded-full bg-gray-100 p-3 text-gray-600">

                  account_circle

                </span>


    {/* User Information */}
    <div className="min-w-0 flex-1">
      <p className="truncate text-lg font-semibold">
        @{user.username}
      </p>

      <p className="mt-1 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
        {user.role || "No role"}
      </p>
    </div>

    {/* Logout */}
    <button
      type="button"
      onClick={onLogout}
      aria-label="Log out"
      className="flex shrink-0 items-center justify-center rounded-md p-2 text-red-600"
    >
      <span className="material-symbols-outlined" aria-hidden="true">
        logout
      </span>
    </button>
  




            
          </div>
        </div>

        <div className="flex items-center justify-between p-4">
          <p>Additional details</p>
          <button type="button" onClick={() => setEditing(true)} className="bg-[#5081fc] text-white flex  gap-3 rounded-md px-3 py-2">
            Edit
          </button>
        </div>

        {/* Contact Details */}
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-semibold">
                Full Name: {user.name || "Not provided"}
              </h2>
            <p>Email: {user.email || "Not provided"}</p>
            <p>Phone: {user.phone_number || "Not provided"}</p>
            <p>Address: {user.address || "Not provided"}</p>
          </div>
        </div>

        {/* Personal Details */}
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <p>
            Date of birth: {user.date_of_birth || "Not provided"}
          </p>
        </div>

        {/* Social Links */}
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <h3>Social links</h3>

          {links.map(([name, url]) => (
            <p key={name}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </a>
            </p>
          ))}
        </div>
      </>
    )}

    {error && <p role="alert">{error}</p>}
  </section>
);
}
