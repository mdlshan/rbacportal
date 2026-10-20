const icons = {
  dashboard: "circle-gauge",
  ground: "decimals-arrow-right",
  maintenance: "drill",
  users: "users-round",
  profile: "circle-user-round",
  lock: "lock",
  logout: "log-out",
  down: "chevron-down",
  add: "plus",
  edit: "pen",
  delete: "trash",
};

const iconUrl = (name) => `https://cdn.jsdelivr.net/npm/lucide-static@1.59.0/icons/${icons[name] || icons.profile}.svg`;

export default function Icon({ name, size = 20 }) {
  const url = iconUrl(name);
  return <span className={`app-icon icon-${name}`} aria-hidden="true" style={{ width: size, height: size, maskImage: `url("${url}")`, WebkitMaskImage: `url("${url}")` }} />;
}
