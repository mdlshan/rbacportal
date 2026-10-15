import { useState } from "react";

export default function ProfileEdit({ profile, onSave, onCancel }) {
  const [form, setForm] = useState({ ...profile });

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    onSave(form);
  }
return (
  <form
    onSubmit={submit}
    className="bg-white p-5"
  >
    <h2 className="text-lg font-semibold">Edit profile</h2>

    <div className="mt-5 space-y-6">
      <section className="space-y-3">
        <h3 className="border-b border-gray-200 pb-2 text-sm font-semibold text-gray-700">
          Personal information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            Full Name
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="name"
              value={form.name || ""}
              onChange={changeField}
            />
          </label>

          <label className="space-y-1">
            Address
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="address"
              value={form.address || ""}
              onChange={changeField}
            />
          </label>

          <label className="space-y-1">
            Date of birth
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="date_of_birth"
              type="date"
              value={form.date_of_birth || ""}
              onChange={changeField}
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="border-b border-gray-200 pb-2 text-sm font-semibold text-gray-700">
          Contact information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            Email
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="email"
              type="email"
              value={form.email || ""}
              onChange={changeField}
            />
          </label>

          <label className="space-y-1">
            Phone
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="phone_number"
              type="tel"
              value={form.phone_number || ""}
              onChange={changeField}
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="border-b border-gray-200 pb-2 text-sm font-semibold text-gray-700">
          Social links
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            Instagram
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="instagram_url"
              type="url"
              value={form.instagram_url || ""}
              onChange={changeField}
            />
          </label>

          <label className="space-y-1">
            Facebook
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="facebook_url"
              type="url"
              value={form.facebook_url || ""}
              onChange={changeField}
            />
          </label>

          <label className="space-y-1">
            LinkedIn
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="linkedin_url"
              type="url"
              value={form.linkedin_url || ""}
              onChange={changeField}
            />
          </label>

          <label className="space-y-1">
            x
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="x_url"
              type="url"
              value={form.x_url || ""}
              onChange={changeField}
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            Website
            <input
              className="w-full rounded-lg border border-gray-200 p-2"
              name="website_url"
              type="url"
              value={form.website_url || ""}
              onChange={changeField}
            />
          </label>
        </div>
      </section>
    </div>

    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-gray-200 px-4 py-2"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
      >
        Update
      </button>
    </div>
  </form>
);
}