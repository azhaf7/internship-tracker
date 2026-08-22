import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import Modal from './Modal.jsx';
import StatusBadge from './StatusBadge.jsx';
import Icon from './Icon.jsx';

const INTERVIEW_TYPES = ['phone', 'technical', 'behavioural', 'onsite', 'case'];
const INTERVIEW_OUTCOMES = ['scheduled', 'passed', 'failed', 'cancelled'];
const STAGES_THAT_ALLOW_ROUNDS = new Set(['screening', 'interview', 'offer']);

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

function emptyInterviewForm(nextRound) {
  return {
    round: String(nextRound),
    type: 'technical',
    scheduledAt: '',
    interviewer: '',
    durationMinutes: '60',
    outcome: 'scheduled',
    notes: ''
  };
}

export default function ApplicationDetail({ application, onEdit, onClose }) {
  const [detail, setDetail] = useState(application);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [interviewForm, setInterviewForm] = useState(() => emptyInterviewForm(1));
  const [savingInterview, setSavingInterview] = useState(false);
  const [interviewError, setInterviewError] = useState(null);

  async function reloadInterviews() {
    const related = await api.getApplicationInterviews(application._id);
    setInterviews(related.interviews);
    return related.interviews;
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [full, related] = await Promise.all([
          api.getApplication(application._id),
          api.getApplicationInterviews(application._id)
        ]);

        if (cancelled) return;
        setDetail(full);
        setInterviews(related.interviews);
        setInterviewForm(emptyInterviewForm(related.interviews.length + 1));
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

  function updateInterviewField(field, value) {
    setInterviewForm((current) => ({ ...current, [field]: value }));
  }

  async function handleAddInterview(event) {
    event.preventDefault();
    setSavingInterview(true);
    setInterviewError(null);

    try {
      await api.createInterview({
        applicationId: application._id,
        round: Number(interviewForm.round),
        type: interviewForm.type,
        scheduledAt: interviewForm.scheduledAt,
        interviewer: interviewForm.interviewer.trim() || undefined,
        durationMinutes:
          interviewForm.durationMinutes === '' ? undefined : Number(interviewForm.durationMinutes),
        outcome: interviewForm.outcome,
        notes: interviewForm.notes.trim() || undefined
      });

      const updated = await reloadInterviews();
      setInterviewForm(emptyInterviewForm(updated.length + 1));
      setShowForm(false);
    } catch (err) {
      setInterviewError(err.details?.join(' · ') ?? err.message);
    } finally {
      setSavingInterview(false);
    }
  }

  async function handleDeleteInterview(id) {
    setInterviewError(null);
    try {
      await api.deleteInterview(id);
      const updated = await reloadInterviews();
      setInterviewForm(emptyInterviewForm(updated.length + 1));
    } catch (err) {
      setInterviewError(err.message);
    }
  }

  const company = detail.companyId;
  const canAddRounds = STAGES_THAT_ALLOW_ROUNDS.has(detail.stage);

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
        <div className="detail__heading-row">
          <h3 className="detail__heading">
            Interview rounds
            <span className="kcol__count">{loading ? '…' : interviews.length}</span>
          </h3>
          {!loading && canAddRounds && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                setShowForm((open) => !open);
                setInterviewError(null);
              }}
            >
              {showForm ? 'Cancel' : 'Add round'}
            </button>
          )}
        </div>

        {loading && <p className="loading">Loading interview rounds...</p>}

        {interviewError && <p className="alert alert--error">{interviewError}</p>}

        {!loading && !canAddRounds && (
          <p className="detail__empty">
            Move this application to screening, interview, or offer to add interview rounds.
          </p>
        )}

        {showForm && canAddRounds && (
          <form className="interview-form" onSubmit={handleAddInterview}>
            <div className="field-row">
              <label className="field">
                Round
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={interviewForm.round}
                  onChange={(e) => updateInterviewField('round', e.target.value)}
                  required
                />
              </label>
              <label className="field">
                Type
                <select
                  value={interviewForm.type}
                  onChange={(e) => updateInterviewField('type', e.target.value)}
                >
                  {INTERVIEW_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {INTERVIEW_LABELS[type] ?? type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                When
                <input
                  type="datetime-local"
                  value={interviewForm.scheduledAt}
                  onChange={(e) => updateInterviewField('scheduledAt', e.target.value)}
                  required
                />
              </label>
              <label className="field">
                Duration (min)
                <input
                  type="number"
                  min="15"
                  max="480"
                  value={interviewForm.durationMinutes}
                  onChange={(e) => updateInterviewField('durationMinutes', e.target.value)}
                />
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                Interviewer
                <input
                  type="text"
                  value={interviewForm.interviewer}
                  onChange={(e) => updateInterviewField('interviewer', e.target.value)}
                  placeholder="Optional"
                />
              </label>
              <label className="field">
                Outcome
                <select
                  value={interviewForm.outcome}
                  onChange={(e) => updateInterviewField('outcome', e.target.value)}
                >
                  {INTERVIEW_OUTCOMES.map((outcome) => (
                    <option key={outcome} value={outcome}>
                      {outcome}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="field">
              Notes
              <textarea
                rows="2"
                value={interviewForm.notes}
                onChange={(e) => updateInterviewField('notes', e.target.value)}
                placeholder="Optional"
              />
            </label>

            <div className="modal__actions">
              <button type="submit" className="btn btn--primary" disabled={savingInterview}>
                {savingInterview ? 'Saving...' : 'Save round'}
              </button>
            </div>
          </form>
        )}

        {!loading && interviews.length === 0 && !showForm && canAddRounds && (
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
                    {canAddRounds && (
                      <button
                        type="button"
                        className="round__delete"
                        onClick={() => handleDeleteInterview(interview._id)}
                      >
                        Remove
                      </button>
                    )}
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
