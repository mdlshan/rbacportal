import { useEffect, useMemo, useRef, useState } from "react";
import { createNotice } from "../api";
import Icon from "./icon";
import IconButton from "./iconButton";

const blankNotice = { title: "", message: "", audience: "everyone", role_ids: [], user_ids: [] };

export default function NoticeComposer({ roles, users }) {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankNotice);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const activeUsers = useMemo(() => users.filter(user => user.active), [users]);
  const searchTerm = search.trim().toLowerCase();
  const filteredUsers = useMemo(() => activeUsers.filter(user =>
    [user.username, user.first_name, user.last_name, user.email].join(" ").toLowerCase().includes(searchTerm),
  ), [activeUsers, searchTerm]);
  const filteredRoles = useMemo(() => roles.filter(role => role.name.toLowerCase().includes(searchTerm)), [roles, searchTerm]);
  const selectedCount = form.audience === "roles" ? form.role_ids.length : form.audience === "users" ? form.user_ids.length : 0;
  const hasRecipients = form.audience === "everyone" || selectedCount > 0;

  useEffect(() => {
    if (open && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [open]);

  async function publish(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setPublished(false);
    try {
      await createNotice(form);
      setForm(blankNotice);
      setSearch("");
      setPublished(true);
      dialogRef.current?.close();
    } catch (reason) {
      setError(reason.message);
    } finally {
      setSaving(false);
    }
  }

  function chooseAudience(audience) {
    setForm(current => ({ ...current, audience, role_ids: audience === "roles" ? current.role_ids : [], user_ids: audience === "users" ? current.user_ids : [] }));
    setSearch("");
  }

  function toggleSelection(key, id) {
    setForm(current => ({
      ...current,
      [key]: current[key].includes(id) ? current[key].filter(item => item !== id) : [...current[key], id],
    }));
  }

  return <>
    <section className="card notice-launcher" aria-label="Notice management">
      <div><h2>Notices</h2><p>{published ? "Notice published." : ""}</p></div>
      <IconButton icon="add" label="Compose notice" variant="primary" onClick={() => { setError(""); setOpen(true); }} />
    </section>
    {open && <dialog className="notice-dialog" ref={dialogRef} onClose={() => setOpen(false)} aria-labelledby="notice-dialog-title">
      <form className="stack-form notice-dialog-form" onSubmit={publish}>
        <div className="notice-dialog-header"><div><h2 id="notice-dialog-title">Publish a notice</h2></div><IconButton icon="close" label="Close" onClick={() => dialogRef.current?.close()} /></div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <label>Title<input required maxLength={120} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="A clear, short heading" /></label>
        <label>Message<textarea required rows={3} value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} placeholder="Write the information staff need to know" /></label>
        <fieldset className="notice-audience">
          <legend>Audience</legend>
          <label className="permission-option"><input type="radio" name="notice-audience" checked={form.audience === "everyone"} onChange={() => chooseAudience("everyone")} /><span>Everyone</span></label>
          <label className="permission-option"><input type="radio" name="notice-audience" checked={form.audience === "roles"} onChange={() => chooseAudience("roles")} /><span>Selected roles</span></label>
          <label className="permission-option"><input type="radio" name="notice-audience" checked={form.audience === "users"} onChange={() => chooseAudience("users")} /><span>Selected users</span></label>
        </fieldset>
        {form.audience !== "everyone" && <>
          <label className="notice-search"><span className="notice-search-icon"><Icon name="search" size={17} /></span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={form.audience === "roles" ? "Search roles" : "Search users"} aria-label={form.audience === "roles" ? "Search roles" : "Search users"} /></label>
          <fieldset className="notice-recipient-group"><legend>{form.audience === "roles" ? "Roles" : "Active users"} <span>{selectedCount || ""}</span></legend><div className="notice-recipient-list">
            {form.audience === "roles" ? filteredRoles.map(role => <label className="notice-recipient-option" key={role.id}><input type="checkbox" checked={form.role_ids.includes(role.id)} onChange={() => toggleSelection("role_ids", role.id)} /><span><strong>{role.name}</strong><small>{role.user_count} {role.user_count === 1 ? "member" : "members"}</small></span></label>) : filteredUsers.map(user => <label className="notice-recipient-option" key={user.id}><input type="checkbox" checked={form.user_ids.includes(user.id)} onChange={() => toggleSelection("user_ids", user.id)} /><span><strong>{user.username}</strong><small>{[user.first_name, user.last_name].filter(Boolean).join(" ") || user.email || "Active user"}</small></span></label>)}
            {form.audience === "roles" && !filteredRoles.length && <p className="notice-no-results">No matching roles.</p>}
            {form.audience === "users" && !filteredUsers.length && <p className="notice-no-results">No matching active users.</p>}
          </div></fieldset>
        </>}
        <div className="notice-dialog-actions"><span className="notice-selection-count">{form.audience === "everyone" ? "" : `${selectedCount} ${form.audience === "roles" ? "roles" : "users"} selected`}</span><IconButton icon="send" label="Publish notice" variant="primary" type="submit" disabled={saving || !hasRecipients} /></div>
      </form>
    </dialog>}
  </>;
}
