import Icon from './Icon.jsx';

const AVATAR_TONES = ['tone-a', 'tone-b', 'tone-c', 'tone-d', 'tone-e', 'tone-f'];

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function toneFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i)) % AVATAR_TONES.length;
  return AVATAR_TONES[hash];
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function KanbanCard({ application, onDragStart, onDragEnd, onOpen, dragging }) {
  const company = application.companyId?.name ?? 'Unknown company';

  return (
    <article
      className={`kcard${dragging ? ' kcard--dragging' : ''}`}
      draggable
      role="button"
      tabIndex={0}
      onDragStart={(event) => onDragStart(event, application)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(application)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen(application);
        }
      }}
    >
      <div className="kcard__top">
        <h4 className="kcard__title">{application.role}</h4>
        <span className="kcard__grip" aria-hidden="true">
          <Icon name="grip" size={15} />
        </span>
      </div>

      {application.notes && <p className="kcard__notes">{application.notes}</p>}

      <div className="kcard__tags">
        <span className="chip">{application.jobType}</span>
        {application.source && <span className="chip chip--soft">{application.source}</span>}
      </div>

      <div className="kcard__foot">
        <div className="kcard__meta">
          <span
            className="kcard__metaitem"
            title={application.appliedDate ? 'Date applied' : 'Date added to the tracker'}
          >
            <Icon name="calendar" size={13} />
            {application.appliedDate
              ? formatDate(application.appliedDate)
              : `Added ${formatDate(application.createdAt)}`}
          </span>

          {application.deadline && (
            <span className="kcard__metaitem" title="Deadline">
              <Icon name="clock" size={13} />
              {formatDate(application.deadline)}
            </span>
          )}

          <span className="kcard__metaitem" title={`Priority ${application.priority} of 5`}>
            <Icon name="star" size={13} />
            {application.priority}
          </span>

          {application.salaryExpectation && (
            <span className="kcard__metaitem" title="Expected pay">
              {(application.salaryExpectation / 1000).toFixed(0)}k
            </span>
          )}

          {application.jobUrl && (
            <a
              className="kcard__metaitem kcard__link"
              href={application.jobUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              title="Open job ad"
            >
              <Icon name="link" size={13} />
            </a>
          )}
        </div>

        <span className={`avatar avatar--${toneFor(company)}`} title={company}>
          {initials(company)}
        </span>
      </div>
    </article>
  );
}
