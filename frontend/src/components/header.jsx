import IconButton from "./iconButton";

export default function Header({ onOpenProfile }) {
  return <header className="topbar"><span className="topbar-title">RBAC Portal</span><IconButton icon="profile" label="Open profile" variant="profile" onClick={onOpenProfile} /></header>;
}
