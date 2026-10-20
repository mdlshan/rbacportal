import Icon from "./icon";

export default function IconButton({ icon, label, variant = "quiet", size = 20, ...props }) {
  return (
    <button
      type="button"
      className={`icon-action ${variant}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}
