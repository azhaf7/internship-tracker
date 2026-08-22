import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import Modal from './Modal.jsx';
import StatusBadge from './StatusBadge.jsx';
import Icon from './Icon.jsx';

const INTERVIEW_LABELS = {
  phone: 'Phone screen',
  technical: 'Technical',
  behavioural: 'Behavioural',
  onsite: 'On site',
  case: 'Case study'
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('sv-SE');
}

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatMoney(value) {
  return value ? `${value.toLocaleString('sv-SE')} kr / month` : '—';
}

export default function ApplicationDetail({ application, onEdit, onClose }) {
  const [detail, setDetail] = useState(application);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // List payload is slim; pull the full company + interviews here.
        const [full, related] = await Promise.all([
          api.getApplication(application._id),
          api.getApplicationInterviews(application._id)
        ]);

        if (cancelled) return;
        setDetail(full);
        setInterviews(related.interviews);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [application._id]);

  const company = detail.companyId;

  return (
    <Modal
      title={detail.role}
      subtitle={company?.name ? `${company.name}${company.location ? ` · ${company.location}` : ''}` : 'Unknown company'}
      onClose={onClose}
    >
      {error && <p className="alert alert--error">Could not load the full record: {error}</p>}

      <div className="detail__badges">
        <StatusBadge stage={detail.stage} />
        <span className="chip">{detail.jobType}</span>
        {detail.source && <span className="chip chip--soft">{detail.source}</span>}
        <span className="stars" title={`Priority ${detail.priority} of 5`}>
          {'★'.repeat(detail.priority)}
          <span className="stars__rest">{'★'.repeat(5 - detail.priority)}</span>
        </span>
      </div>

      <dl className="detail__grid">
        <div>
          <dt>Added on</dt>
          <dd>{formatDate(detail.createdAt)}</dd>
        </div>
        <div>
          <dt>Applied on</dt>
          <dd>{formatDate(detail.appliedDate)}</dd>
        </div>
        <div>
          <dt>Deadline</dt>
          <dd>{formatDate(detail.deadline)}</dd>
        </div>
        <div>
          <dt>Expected pay</dt>
          <dd>{formatMoney(detail.salaryExpectation)}</dd>
        </div>
        <div>
          <dt>Industry</dt>
          <dd>{company?.industry ?? '—'}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatDate(detail.updatedAt)}</dd>
        </div>
        <div>
          <dt>Links</dt>
          <dd className="detail__links">
            {detail.jobUrl && (
              <a href={detail.jobUrl} target="_blank" rel="noreferrer">
                <Icon name="link" size={13} /> Job ad
              </a>
            )}
            {company?.website && (
              <a href={company.website} target="_blank" rel="noreferrer">
                <Icon name="building" size={13} /> Company
              </a>
            )}
            {!detail.jobUrl && !company?.website && '—'}
          </dd>
        </div>
      </dl>

      {detail.notes && (
        <div className="detail__block">
          <h3 className="detail__heading">Notes</h3>
          <p className="detail__notes">{detail.notes}</p>
        </div>
      )}

      <div className="detail__block">
        <h3 className="detail__heading">
          Interview rounds
          <span className="kcol__count">{loading ? '…' : interviews.length}</span>
        </h3>

        {loading && <p className="loading">Loading interview rounds...</p>}

        {!loading && interviews.length === 0 && (
          <p className="detail__empty">No interview rounds recorded for this application yet.</p>
        )}

        {!loading && interviews.length > 0 && (
          <ol className="rounds">
            {interviews.map((interview) => (
              <li key={interview._id} className="round">
                <span className="round__num">{interview.round}</span>
                <div className="round__body">
                  <div className="round__top">
                    <span className="round__type">{INTERVIEW_LABELS[interview.type] ?? interview.type}</span>
                    <span className={`badge badge--outcome-${interview.outcome}`}>{interview.outcome}</span>
                  </div>
                  <p className="round__meta">
                    {formatDateTime(interview.scheduledAt)}
                    {interview.durationMinutes ? ` · ${interview.durationMinutes} min` : ''}
                    {interview.interviewer ? ` · ${interview.interviewer}` : ''}
                  </p>
                  {interview.notes && <p className="round__notes">{interview.notes}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="modal__actions">
        <button type="button" className="btn btn--primary" onClick={() => onEdit(detail)}>
          Edit application
        </button>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
