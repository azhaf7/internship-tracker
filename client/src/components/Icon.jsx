// Inline SVG icons — no icon package.
const PATHS = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM14 14h6v6h-6zM4 14h6v6H4z',
  bookmark: 'M6 3h12v18l-6-4-6 4z',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4z',
  filter: 'M3 4h18l-7 8v7l-4 2v-9z',
  calendar: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
  check: 'M20 6 9 17l-5-5',
  close: 'M18 6 6 18M6 6l12 12',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  building: 'M3 21h18M5 21V5h9v16M14 9h5v12M8 8h2M8 12h2M8 16h2',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  trend: 'M22 7 13.5 15.5 8.5 10.5 2 17M16 7h6v6',
  briefcase: 'M3 8h18v12H3zM8 8V5h8v3',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  spark: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z',
  grip: 'M5 9h14M5 15h14',
  link: 'M10.5 13.5a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M13.5 10.5a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1',
  star: 'M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8z',
  columns: 'M3 4h18v16H3zM9 4v16M15 4v16',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  rows: 'M3 4h18v16H3zM3 10h18M3 15h18'
};

export default function Icon({ name, size = 16 }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}
