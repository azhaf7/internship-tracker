import Icon from './Icon.jsx';

const CARDS = [
  { key: 'active', label: 'Active Applications', icon: 'briefcase', tone: 'blue' },
  { key: 'interviewCount', label: 'Interviews Scheduled', icon: 'calendar', tone: 'violet' },
  { key: 'offers', label: 'Offers Received', icon: 'check', tone: 'green' },
  { key: 'responseRate', label: 'Response Rate', icon: 'trend', tone: 'amber', suffix: '%' }
];

export default function StatCards({ stats, loading, error }) {
  if (loading) {
    return (
      <div className="statgrid">
        {CARDS.map((card) => (
          <div key={card.key} className="stat stat--skeleton" aria-hidden="true">
            <span className="skeleton skeleton--chip" />
            <span className="skeleton skeleton--value" />
            <span className="skeleton skeleton--label" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="alert alert--error">Could not load pipeline stats: {error}</p>;
  }

  return (
    <div className="statgrid">
      {CARDS.map((card) => (
        <article key={card.key} className="stat">
          <span className={`stat__chip stat__chip--${card.tone}`}>
            <Icon name={card.icon} size={16} />
          </span>
          <p className="stat__value">
            {stats[card.key]}
            {card.suffix ?? ''}
          </p>
          <p className="stat__label">{card.label}</p>
        </article>
      ))}
    </div>
  );
}
