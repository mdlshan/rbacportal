import { useState } from "react";
import IconButton from "../components/iconButton";
export default function ProfileEdit({ profile, onSave, onCancel }) {
  const [form, setForm] = useState({
    first_name: profile.first_name || "", last_name: profile.last_name || "", email: profile.email || "",
    address: profile.address || "", date_of_birth: profile.date_of_birth || "", phone_number: profile.phone_number || "",
    social_links: profile.social_links?.map(({ title, url }) => ({ title, url })) || [],
  });
  function change(field, value) { setForm({ ...form, [field]: value }); }
  function changeLink(index, field, value) {
    change("social_links", form.social_links.map((link, i) => i === index ? { ...link, [field]: value } : link));
  }
  function submit(event) {
    event.preventDefault();
    onSave({ ...form, social_links: form.social_links.filter(link => link.title.trim() && link.url.trim()) });
  }
  return <form className="card stack-form profile-edit-form" onSubmit={submit}>
    <div className="section-intro"><div><h2>Edit profile details</h2><p>Update your personal information, contact details, and links.</p></div></div>
    <section className="profile-edit-group"><div><h3>Personal information</h3><p className="muted">Your name and birthday.</p></div><div className="form-grid">
      <label>First name<input value={form.first_name} onChange={e => change("first_name", e.target.value)} /></label>
      <label>Last name<input value={form.last_name} onChange={e => change("last_name", e.target.value)} /></label>
      <label>Date of birth<input type="date" value={form.date_of_birth || ""} onChange={e => change("date_of_birth", e.target.value)} /></label>
    </div></section>
    <section className="profile-edit-group"><div><h3>Contact details</h3><p className="muted">How people can reach you.</p></div><div className="form-grid">
      <label>Email<input type="email" value={form.email} onChange={e => change("email", e.target.value)} /></label>
      <label>Phone number<input value={form.phone_number} onChange={e => change("phone_number", e.target.value)} /></label>
      <label>Address<input value={form.address} onChange={e => change("address", e.target.value)} /></label>
    </div></section>
    <section className="profile-edit-group"><div><h3>Social links</h3><p className="muted">Add websites or social profiles.</p></div><div className="social-editor">
      {form.social_links.map((link, i) => <div className="form-grid" key={i}>
        <label>Title<input placeholder="e.g. LinkedIn" value={link.title} onChange={e => changeLink(i, "title", e.target.value)} /></label>
        <label>URL<input type="url" placeholder="https://..." value={link.url} onChange={e => changeLink(i, "url", e.target.value)} /></label>
        <IconButton icon="delete" label={`Remove ${link.title || "social link"}`} variant="danger" onClick={() => change("social_links", form.social_links.filter((_, index) => index !== i))} />
      </div>)}
      <button type="button" className="button secondary" onClick={() => change("social_links", [...form.social_links, { title: "", url: "" }])}>Add social link</button>
    </div></section>
    <div className="button-row"><button className="button primary">Save changes</button><button type="button" className="button secondary" onClick={onCancel}>Cancel</button></div>
  </form>;
}
