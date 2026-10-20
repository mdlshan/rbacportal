import { useEffect, useState } from "react";
import { createRole, createUser, deleteRole, deleteUser, getPage, updateRole, updateUser } from "../api";
import AccessDenied from "./accessDenied";
import Icon from "../components/icon";
import IconButton from "../components/iconButton";

const emptyRole = { name: "", features: [] };
export default function Users() {
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("users");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", password: "", role: "" });
  const [editing, setEditing] = useState(null);
  const [roleForm, setRoleForm] = useState(emptyRole);
  const [editingRole, setEditingRole] = useState(null);
  async function refresh() { setResult(await getPage("users")); }
  useEffect(() => { refresh().catch(() => setError("Could not load users.")); }, []);
  async function run(action) { setError(""); try { await action(); await refresh(); } catch (e) { setError(e.message); } }
  async function addUser(e) { e.preventDefault(); await run(async () => { await createUser(form); setForm({ username: "", password: "", role: "" }); }); }
  async function saveUser(e) { e.preventDefault(); await run(async () => { await updateUser(editing.id, editing); setEditing(null); window.dispatchEvent(new Event("roles:updated")); }); }
  async function saveRole(e) { e.preventDefault(); await run(async () => { if (editingRole) await updateRole(editingRole.id, roleForm); else await createRole(roleForm); setRoleForm(emptyRole); setEditingRole(null); window.dispatchEvent(new Event("roles:updated")); }); }
  async function remove(action, message) { if (window.confirm(message)) await run(action); }
  if (!result) return <p>{error || "Loading users..."}</p>;
  if (result.status === 403) return <AccessDenied />;
  if (result.status === 401) return <p>Please log in again.</p>;
  const { users, roles, permission_options: permissionOptions } = result.data;
  return <section className="page-stack">
    <div className="page-heading management-heading"><div><h1>User management</h1></div><div className="management-counts"><span><strong>{users.length}</strong> users</span><span><strong>{roles.length}</strong> roles</span></div></div>
    <div className="tabs" role="tablist" aria-label="User management sections">{[["users", "Users"], ["roles", "Roles"]].map(([id, label]) => <button type="button" role="tab" aria-selected={tab === id} key={id} className={tab === id ? "tab active" : "tab"} onClick={() => { setTab(id); setError(""); }}>{label}</button>)}</div>
    {error && <p className="error-message" role="alert">{error}</p>}
    {tab === "users" && <>
      {result.data.can_create_users && <form className="card stack-form management-card" onSubmit={addUser}><div className="section-intro"><div><h2>Add user</h2></div></div><div className="form-grid"><label>Username<input required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></label><label>Password<input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label><label>Role<select required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="">Choose role</option>{roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label><IconButton icon="add" label="Add user" variant="primary" type="submit" /></div></form>}
      <div className="card list-card management-card"><div className="section-intro list-intro"><div><h2>Users</h2></div></div>{users.length === 0 && <p className="empty-state">No users to show yet.</p>}{users.map(user => <article className="user-row" key={user.id}>
        {editing?.id === user.id ? <form className="form-grid" onSubmit={saveUser}><label>Username<input required value={editing.username} onChange={e => setEditing({ ...editing, username: e.target.value })} /></label><label>Role<select value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })}>{roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label><label className="check-label"><input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} />Active</label><button className="button secondary">Save</button><button type="button" className="button quiet" onClick={() => setEditing(null)}>Cancel</button></form> : <>
          <div className="user-main"><div className="user-identity"><span className="user-avatar" aria-hidden="true">{user.username.charAt(0).toUpperCase()}</span><div><strong>{user.username}</strong><span className="badge">{user.role}</span>{!user.active && <span className="inactive">Inactive</span>}</div></div><div className="button-row"><IconButton icon="edit" label={`Edit ${user.username}`} onClick={() => setEditing({ ...user, role: String(user.role_id) })} /><IconButton icon="delete" label={`Delete ${user.username}`} variant="danger" onClick={() => remove(() => deleteUser(user.id), "Delete this user?")} /></div></div>
          <details className="user-details"><summary>Additional details <Icon name="down" size={16} /></summary><div className="detail-grid"><span>Name</span><span>{[user.first_name, user.last_name].filter(Boolean).join(" ") || "Not added"}</span><span>Email</span><span>{user.email || "Not added"}</span><span>Address</span><span>{user.profile.address || "Not added"}</span><span>Date of birth</span><span>{user.profile.date_of_birth || "Not added"}</span><span>Phone</span><span>{user.profile.phone_number || "Not added"}</span></div>{user.profile.social_links.length ? <div className="user-social-links">{user.profile.social_links.map(link => <a key={link.id} href={link.url} target="_blank" rel="noreferrer">{link.title}</a>)}</div> : <p className="muted">No social links added.</p>}</details>
        </>}
      </article>)}</div>
    </>}
    {tab === "roles" && <>
      <form className="card stack-form management-card" onSubmit={saveRole}><div className="section-intro"><div><h2>{editingRole ? "Edit role" : "Add role"}</h2></div></div><div className="role-name-row"><label>Role name<input required value={roleForm.name} onChange={e => setRoleForm({ ...roleForm, name: e.target.value })} /></label>{!editingRole && <IconButton icon="add" label="Add role" variant="primary" type="submit" />}</div><fieldset className="permission-list"><legend>Allowed pages</legend>{permissionOptions.map(option => <label className="permission-option" key={option.id}><input type="checkbox" checked={roleForm.features.includes(option.id)} onChange={e => setRoleForm({ ...roleForm, features: e.target.checked ? [...roleForm.features, option.id] : roleForm.features.filter(feature => feature !== option.id) })} /><span>{option.label}</span></label>)}</fieldset>{editingRole && <div className="button-row"><button className="button primary">Save role</button><button type="button" className="button secondary" onClick={() => { setEditingRole(null); setRoleForm(emptyRole); }}>Cancel</button></div>}</form>
      <div className="card list-card management-card"><div className="section-intro list-intro"><div><h2>Roles</h2></div></div>{roles.length === 0 && <p className="empty-state">No roles created yet.</p>}{roles.map(role => <article className="role-row" key={role.id}><div className="role-information"><div className="role-title"><strong>{role.name}</strong><span className="badge">{role.user_count} {role.user_count === 1 ? "user" : "users"}</span></div><div className="role-permissions">{role.features.length ? role.features.map(feature => <span className="permission-chip" key={feature}>{permissionOptions.find(option => option.id === feature)?.label || feature}</span>) : <span className="muted">No app pages</span>}</div></div><div className="button-row"><IconButton icon="edit" label={`Edit ${role.name}`} onClick={() => { setEditingRole(role); setRoleForm({ name: role.name, features: role.features }); }} /><IconButton icon="delete" label={`Delete ${role.name}`} variant="danger" onClick={() => remove(() => deleteRole(role.id), "Delete this role? Users must be moved first.")} /></div></article>)}</div>
    </>}
  </section>;
}
