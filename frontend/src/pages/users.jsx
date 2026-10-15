import { useEffect, useState } from "react";
import { createRole, createUser, deleteRole, deleteUser, getPage, updateRole, updateUser } from "../api";
import AccessDenied from "./accessDenied";

const inputClass = "rounded border border-gray-200 p-2";
const features = [["ground", "Ground operations"], ["maintenance", "Maintenance"], ["users", "Users"]];

function Users() {
  const [result, setResult] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("users");
  const [roleForm, setRoleForm] = useState({ name: "", features: [] });
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    getPage("users")
      .then(setResult)
      .catch(() => setError("Could not load users."));
  }, []);

  async function refreshUsers() {
    setResult(await getPage("users"));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await createUser({ username, password, role });
      setUsername("");
      setPassword("");
      setRole("");
      await refreshUsers();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setError("");
    try {
      await updateUser(editing.id, editing);
      setEditing(null);
      await refreshUsers();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    setError("");
    try {
      await deleteUser(id);
      await refreshUsers();
    } catch (error) {
      setError(error.message);
    }
  }

  async function saveRole(event) {
    event.preventDefault();
    setError("");
    try {
      if (editingRole) await updateRole(editingRole.id, roleForm);
      else await createRole(roleForm);
      setRoleForm({ name: "", features: [] });
      setEditingRole(null);
      await refreshUsers();
      window.dispatchEvent(new Event("roles:updated"));
    } catch (error) {
      setError(error.message);
    }
  }

  async function removeRole(id) {
    if (!window.confirm("Delete this role?")) return;
    setError("");
    try {
      await deleteRole(id);
      await refreshUsers();
    } catch (error) {
      setError(error.message);
    }
  }

  if (!result) return <p>{error || "Loading users..."}</p>;
  if (result.status === 403) return <AccessDenied />;
  if (result.status === 401) return <h1>Please log in again</h1>;

  const { users, roles } = result.data;

return (
  <section className="space-y-5">
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-[#eaf6ff] p-4">
      <h1 className="text-lg font-semibold">User management</h1>
    </div>

    <div className="flex gap-2 border-b border-gray-50">
      {[["users", "Users"], ["roles", "Roles"]].map(([id, label]) => (
        <button key={id} onClick={() => { setTab(id); setError(""); }} className={`border-b-2 px-4 py-2 text-sm font-medium ${tab === id ? "border-[#5081fc] text-[#5081fc]" : "border-transparent text-gray-500"}`}>{label}</button>
      ))}
    </div>

    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

    {tab === "users" && <>
    {/* Add User */}
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-50 bg-white p-4"
    >
      <h2 className="mb-4 font-medium">Add user</h2>

      <div className="flex flex-wrap gap-3">
        <input
          required
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={inputClass}
        />

        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputClass}
        />

        <select
          required
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className={inputClass}
        >
          <option value="">Choose role</option>

          {roles.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <button className="bg-[#5081fc] text-white flex  gap-3 rounded-md px-3 py-2">
          Add user
        </button>
      </div>
    </form>

    {/* User List */}
    <div className="overflow-hidden rounded-lg border border-gray-50 bg-white">


      <ul className="divide-y divide-gray-50">
        {users.map((user) => (
          <li key={user.id} className="p-4">
            {editing?.id === user.id ? (
              <form
                onSubmit={handleUpdate}
                className="flex flex-wrap items-center gap-3"
              >
                <input
                  required
                  value={editing.username}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      username: event.target.value,
                    })
                  }
                  className={inputClass}
                />

                <select
                  value={editing.role}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      role: event.target.value,
                    })
                  }
                  className={inputClass}
                >
                  {roles.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.active}
                    onChange={(event) =>
                      setEditing({
                        ...editing,
                        active: event.target.checked,
                      })
                    }
                  />
                  Active
                </label>

                <button className="text-sm font-medium text-[#5081fc]">
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="text-sm text-gray-600"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{user.username}</p>

                  <p className="mt-1 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                    {user.role}
                    {!user.active && (
                      <span className="ml-2 text-red-600">
                        Inactive
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() =>
                      setEditing({
                        ...user,
                        role: String(user.role_id),
                      })
                    }
                    className="text-blue-700 "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
    </>}

    {tab === "roles" && <>
      <form onSubmit={saveRole} className="space-y-4 rounded-lg border border-gray-50 bg-white p-4">
        <h2 className="font-medium">{editingRole ? "Edit role" : "Add role"}</h2>
        <input required placeholder="Role name" value={roleForm.name} onChange={(event) => setRoleForm({ ...roleForm, name: event.target.value })} className={inputClass} />
        <div className="flex flex-wrap gap-5">
          {features.map(([id, label]) => <label key={id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={roleForm.features.includes(id)} onChange={(event) => setRoleForm({ ...roleForm, features: event.target.checked ? [...roleForm.features, id] : roleForm.features.filter((item) => item !== id) })} />{label}</label>)}
        </div>
        <div className="flex gap-3">
          <button className="rounded-md bg-[#5081fc] px-4 py-2 text-white">{editingRole ? "Update role" : "Add role"}</button>
          {editingRole && <button type="button" onClick={() => { setEditingRole(null); setRoleForm({ name: "", features: [] }); }} className="text-sm text-gray-600">Cancel</button>}
        </div>
      </form>
      <div className="overflow-hidden rounded-lg border border-gray-50 bg-white">
        <ul className="divide-y divide-gray-50">{roles.map((item) => <li key={item.id} className="flex items-center justify-between gap-4 p-4">
          <div><p className="font-medium">{item.name}</p><p className="mt-1 text-sm text-gray-500">{item.features.map((id) => features.find(([key]) => key === id)?.[1]).filter(Boolean).join(" · ") || "No sections"} · {item.user_count} users</p></div>
          <div className="flex gap-3 text-sm"><button onClick={() => { setEditingRole(item); setRoleForm({ name: item.name, features: item.features }); }} className="text-blue-700">Edit</button><button onClick={() => removeRole(item.id)} className="text-red-600">Delete</button></div>
        </li>)}</ul>
      </div>
    </>}
  </section>
);
}
export default Users;
