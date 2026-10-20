import { useEffect, useState } from "react";
import { getMe, updateMyProfile } from "../api";
import ProfileEdit from "./profileedit";
import Icon from "../components/icon";
import IconButton from "../components/iconButton";

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  const today = new Date();
  const birthday = new Date(year, month - 1, day);
  if (!year || birthday.getFullYear() !== year || birthday.getMonth() !== month - 1 || birthday.getDate() !== day || birthday > today) return null;
  const birthdayPassed = today.getMonth() > month - 1 || (today.getMonth() === month - 1 && today.getDate() >= day);
  return today.getFullYear() - year - (birthdayPassed ? 0 : 1);
}

export default function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { getMe().then(setUser).catch(() => setError("Could not load your profile.")); }, []);
  async function save(form) {
    try { setUser(await updateMyProfile(form)); setEditing(false); setError(""); } catch (e) { setError(e.message); }
  }
  if (!user) return <p>{error || "Loading profile..."}</p>;
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Not added";
  const age = calculateAge(user.date_of_birth);
  return <section className="page-stack">
    <div className="page-heading"><h1>Profile</h1></div>
    {editing ? <ProfileEdit profile={user} onSave={save} onCancel={() => setEditing(false)} /> : <>
      <article className="card profile-card"><span className="round-icon"><Icon name="profile" size={24} /></span><div className="grow"><h2>{name}</h2><p>@{user.username}</p><span className="badge">{user.role || "No role"}</span></div><IconButton icon="edit" label="Edit profile" variant="secondary" onClick={() => setEditing(true)} /><IconButton icon="logout" label="Log out" variant="danger" onClick={onLogout} /></article>
      <div className="profile-details-grid">
        <article className="card profile-info-card"><div className="section-intro"><div><h2>Personal information</h2></div></div><dl className="detail-grid profile-detail-grid"><dt>Full name</dt><dd>{fullName}</dd><dt>Date of birth</dt><dd>{user.date_of_birth || "Not added"}</dd><dt>Age</dt><dd>{age === null ? "Not available" : `${age} years`}</dd></dl></article>
        <article className="card profile-info-card"><div className="section-intro"><div><h2>Contact details</h2></div></div><dl className="detail-grid profile-detail-grid"><dt>Email</dt><dd>{user.email || "Not added"}</dd><dt>Phone</dt><dd>{user.phone_number || "Not added"}</dd><dt>Address</dt><dd>{user.address || "Not added"}</dd></dl></article>
        <article className="card profile-info-card profile-social-card"><div className="section-intro"><div><h2>Social links</h2></div></div>{user.social_links?.length ? <div className="profile-links">{user.social_links.map(link => <a className="profile-link-card" key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.title}</a>)}</div> : <p className="muted profile-empty">No social links added.</p>}</article>
      </div>
    </>}
    {error && <p className="error-message" role="alert">{error}</p>}
  </section>;
}
