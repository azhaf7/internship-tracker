import StatusBadge from './StatusBadge.jsx';

const AVATAR_TONES = ['tone-a', 'tone-b', 'tone-c', 'tone-d', 'tone-e', 'tone-f'];

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('sv-SE');
}

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

// Stable colour per company name.
function toneFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash + name.charCodeAt(i)) % AVATAR_TONES.length;
  return AVATAR_TONES[hash];
}

export default function ApplicationRow({ application, onOpen, onEdit }) {
  const company = application.companyId?.name ?? 'Unknown company';

  return (
    <tr className="row-clickable" onClick={() => onOpen(application)}>
      <td>
        <span className="cell-role">{application.role}</span>
        <span className="cell-sub">{application.jobType}</span>
      </td>

      <td>
        <div className="cell-company">
          <span className={`avatar avatar--${toneFor(company)}`}>{initials(company)}</span>
          <div>
            <span className="cell-company__name">{company}</span>
            {application.companyId?.location && (
              <span className="cell-sub">{application.companyId.location}</span>
            )}
          </div>
        </div>
      </td>

      <td>
        <StatusBadge stage={application.stage} />
      </td>

      <td>
        <span className="stars" title={`Priority ${application.priority} of 5`}>
          {'★'.repeat(application.priority)}
          <span className="stars__rest">{'★'.repeat(5 - application.priority)}</span>
        </span>
      </td>

      <td className="cell-muted">
        {application.appliedDate ? (
          formatDate(application.appliedDate)
        ) : (
          <>
            —<span className="cell-sub">added {formatDate(application.createdAt)}</span>
          </>
        )}
      </td>

      <td className="cell-numeric">
        {application.salaryExpectation
          ? `${application.salaryExpectation.toLocaleString('sv-SE')} kr`
          : '—'}
      </td>

      <td className="cell-actions">
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(application);
          }}
        >
          Edit
        </button>
      </td>
    </tr>
  );
}
