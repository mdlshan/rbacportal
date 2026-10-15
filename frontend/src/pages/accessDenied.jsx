export default function AccessDenied() {
  return (
    <div className="flex min-h-[55vh] items-center justify-center px-4">
      <section
        className="w-full max-w-md rounded-md border border-gray-200 bg-white p-8 text-center shadow-sm"
        role="alert"
        aria-labelledby="access-denied-title"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <span className="material-symbols-outlined text-3xl" aria-hidden="true">
            lock
          </span>
        </div>
        <p className="mb-2 text-lg font-semibold uppercase tracking-wide text-red-600">
          403
        </p>
        <h1 id="access-denied-title" className="text-2xl font-semibold text-gray-900">
          Access denied
        </h1>
        <p className="mt-3 text-gray-600">
          You don’t have permission to view this page
        </p>
      </section>
    </div>
  );
}
