import Icon from './Icon.jsx';

const VIEWS = [
  { id: 'board', label: 'Board', icon: 'columns' },
  { id: 'table', label: 'Table', icon: 'rows' }
];

export default function ViewToggle({ view, onChange }) {
  return (
    <div className="viewtoggle" role="group" aria-label="Switch layout">
      {VIEWS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`viewtoggle__btn${view === option.id ? ' viewtoggle__btn--on' : ''}`}
          onClick={() => onChange(option.id)}
          aria-pressed={view === option.id}
        >
          <Icon name={option.icon} size={14} />
          {option.label}
        </button>
      ))}
    </div>
  );
}
