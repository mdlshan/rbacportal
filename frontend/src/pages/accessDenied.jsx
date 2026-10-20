import Icon from "../components/icon";
export default function AccessDenied() {
  return <div className="center-page"><section className="card denied-card"><span className="denied-mark"><Icon name="lock" size={24} /></span><p className="denied-code">403</p><h1>Access denied</h1><p className="muted">You don’t have permission to view this page.</p></section></div>;
}
