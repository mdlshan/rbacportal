import { useEffect, useState } from "react";
import { deleteNotice, getNotices } from "../api";
import IconButton from "../components/iconButton";

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function refresh() {
    setData(await getNotices());
  }

  useEffect(() => {
    refresh().catch(() => setError("Could not load the Dashboard."));
  }, []);

  async function removeNotice(id) {
    if (!window.confirm("Remove this notice from dashboards?")) return;
    setError("");
    try {
      await deleteNotice(id);
      await refresh();
    } catch (reason) {
      setError(reason.message);
    }
  }

  return <section className="page-stack">
    <div className="page-heading dashboard-heading">
      <div><h1>Dashboard</h1></div>

    </div>

    {error && <p className="error-message" role="alert">{error}</p>}

    <section className="card notice-board" aria-labelledby="notice-board-title w-[x] h-[y] ">
      <div className="section-intro list-intro"><div><h2 id="notice-board-title">Current notices</h2></div></div>
      <div className="notice-list-scroll" aria-label="Notice list">
        {!data && !error && <p className="muted notice-loading">Loading notices…</p>}
        {data?.notices.length === 0 && <p className="empty-state">There are no current notices.</p>}
        {data?.notices.map(notice => <article className="notice-item" key={notice.id}>
          <div className="notice-meta"><span className="notice-audience-label">{notice.audience}</span><time dateTime={notice.created_at}>{formatDate(notice.created_at)}</time></div>
          <h3>{notice.title}</h3>
          <p className="notice-message">{notice.message}</p>
          <div className="notice-footer"><span>Published by {notice.author}</span>{data.can_publish && (
  <IconButton
    icon="delete"
    label="Remove notice"
    variant="danger"
    onClick={() => removeNotice(notice.id)}
  />
)}</div>
        </article>)}
      </div>
    </section>
  </section>;
}
