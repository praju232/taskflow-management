function StatsBar({ stats, activeFilter, onFilterChange }) {
  const items = [
    { key: 'All', label: 'All', value: stats.total },
    { key: 'Pending', label: 'Pending', value: stats.pending },
    { key: 'In Progress', label: 'Active', value: stats.inProgress },
    { key: 'Completed', label: 'Done', value: stats.completed },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-x-auto">
      {items.map(({ key, label, value }) => {
        const active = activeFilter === key;
        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              active
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {label}
            <span
              className={`tabular-nums px-1.5 py-0.5 rounded text-[10px] ${
                active
                  ? 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                  : 'bg-zinc-200/60 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500'
              }`}
            >
              {value}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default StatsBar;
