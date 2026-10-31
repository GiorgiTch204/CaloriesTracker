export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 px-6 py-12 text-center dark:border-ink-700">
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500">
          <Icon size={22} />
        </div>
      )}
      <p className="font-display text-base font-medium text-ink-800 dark:text-ink-100">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500 dark:text-ink-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
