function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function Avatar({ user, size = 36, className = "" }) {
  const style = { width: size, height: size };

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={`${user.name}'s profile picture`}
        style={style}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={style}
      className={`flex items-center justify-center rounded-full bg-moss-600 font-display text-sm font-medium text-white ${className}`}
      aria-hidden="true"
    >
      {initials(user?.name) || "?"}
    </div>
  );
}
