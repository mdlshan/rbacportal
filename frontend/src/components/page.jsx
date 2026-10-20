import Header from "./header";
import Sidebar from "./sidebar";
export default function Page({ children, page, setPage, features, onOpenProfile }) {
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} features={features} /><div className="app-main"><Header onOpenProfile={onOpenProfile} /><main className="page-content">{children}</main></div></div>;
}
