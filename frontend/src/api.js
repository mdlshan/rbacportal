const API = "http://127.0.0.1:8000/api";

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

async function authorizedFetch(path, options = {}) {
  const send = () => fetch(API + path, {
    ...options,
    headers: { ...options.headers, Authorization: "Bearer " + localStorage.getItem("access") },
  });
  let response = await send();
  if (response.status !== 401) return response;
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return response;
  const renewed = await fetch(API + "/auth/token/refresh/", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh }),
  });
  if (!renewed.ok) {
    logout();
    window.dispatchEvent(new Event("auth:logout"));
    return response;
  }
  const tokens = await renewed.json();
  localStorage.setItem("access", tokens.access);
  if (tokens.refresh) localStorage.setItem("refresh", tokens.refresh);
  return send();
}

async function read(response, message) {
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.detail || message);
  return data;
}

export async function login(username, password) {
  const response = await fetch(API + "/auth/token/", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }),
  });
  const data = await read(response, "Invalid username or password");
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  return data;
}

export async function getMe() { return read(await authorizedFetch("/me/"), "Could not load your account"); }
export async function updateMyProfile(profile) {
  return read(await authorizedFetch("/me/", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(profile) }), "Could not save profile");
}
export async function getPage(endpoint) {
  const response = await authorizedFetch("/" + endpoint + "/");
  return { status: response.status, data: await response.json() };
}
export async function getNotices() { return read(await authorizedFetch("/notices/"), "Could not load notices"); }
export async function createNotice(notice) {
  return read(await authorizedFetch("/notices/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(notice) }), "Could not publish notice");
}
export async function deleteNotice(id) { return read(await authorizedFetch("/notices/" + id + "/", { method: "DELETE" }), "Could not remove notice"); }
export async function createUser(user) {
  return read(await authorizedFetch("/users/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(user) }), "Could not create user");
}
export async function updateUser(id, user) {
  return read(await authorizedFetch("/users/" + id + "/", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(user) }), "Could not update user");
}
export async function deleteUser(id) { return read(await authorizedFetch("/users/" + id + "/", { method: "DELETE" }), "Could not delete user"); }
export async function createRole(role) {
  return read(await authorizedFetch("/roles/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(role) }), "Could not create role");
}
export async function updateRole(id, role) {
  return read(await authorizedFetch("/roles/" + id + "/", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(role) }), "Could not update role");
}
export async function deleteRole(id) { return read(await authorizedFetch("/roles/" + id + "/", { method: "DELETE" }), "Could not delete role"); }
