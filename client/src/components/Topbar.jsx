import Icon from './Icon.jsx';
import AddButton from './AddButton.jsx';

export default function Topbar({ crumb, search, onSearchChange, onAdd, lastUpdated }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand__mark">
          <Icon name="spark" size={17} />
        </span>
        <span className="brand__name">Internship Tracker</span>
      </div>

      <nav className="crumb" aria-label="Breadcrumb">
        <span className="crumb__sep">/</span>
        <span className="crumb__current">{crumb}</span>
      </nav>

      <label className="searchbox">
        <Icon name="search" size={15} />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search role or company..."
          aria-label="Search applications"
        />
      </label>

      <div className="topbar__right">
        {lastUpdated && (
          <span className="sync" title="Auto-refreshes every 15 seconds">
            <Icon name="clock" size={13} />
            {lastUpdated.toLocaleTimeString('sv-SE')}
          </span>
        )}
        <AddButton onClick={onAdd} />
      </div>
    </header>
  );
}
