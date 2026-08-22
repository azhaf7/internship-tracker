import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api/client.js';

const STAGES = ['wishlist', 'applied', 'screening', 'interview', 'offer', 'rejected'];
const STAGES_THAT_ALLOW_ROUNDS = new Set(['screening', 'interview', 'offer']);
const INTERVIEW_TYPES = ['phone', 'technical', 'behavioural', 'onsite', 'case'];
const INTERVIEW_OUTCOMES = ['scheduled', 'passed', 'failed', 'cancelled'];

const INTERVIEW_LABELS = {
  phone: 'Phone screen',
  technical: 'Technical',
  behavioural: 'Behavioural',
  onsite: 'On site',
  case: 'Case study'
};

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function emptyRound(nextRound) {
  return {
    id: crypto.randomUUID(),
    round: String(nextRound),
    type: 'technical',
    scheduledAt: '',
    interviewer: '',
    durationMinutes: '60',
    outcome: 'scheduled',
    notes: ''
  };
}

export default function EditModal({ application, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({
    role: application.role,
    stage: application.stage,
    priority: application.priority,
    salaryExpectation: application.salaryExpectation ?? '',
    appliedDate: toDateInput(application.appliedDate),
    deadline: toDateInput(application.deadline),
    notes: application.notes ?? ''
  });
  const [rounds, setRounds] = useState([]);
  const [existingCount, setExistingCount] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const canAddRounds = STAGES_THAT_ALLOW_ROUNDS.has(form.stage);

  useEffect(() => {
    let cancelled = false;

    api
      .getApplicationInterviews(application._id)
      .then((related) => {
        if (!cancelled) setExistingCount(related.interviews.length);
      })
      .catch(() => {
        if (!cancelled) setExistingCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, [application._id]);

  function update(field, value) {
    if (field === 'stage' && !STAGES_THAT_ALLOW_ROUNDS.has(value)) {
      setRounds([]);
    }
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addRound() {
    setRounds((current) => [...current, emptyRound(existingCount + current.length + 1)]);
  }

  function removeRound(id) {
    setRounds((current) =>
      current
        .filter((round) => round.id !== id)
        .map((round, index) => ({ ...round, round: String(existingCount + index + 1) }))
    );
  }

  function updateRound(id, field, value) {
    setRounds((current) =>
      current.map((round) => (round.id === id ? { ...round, [field]: value } : round))
    );
  }

  async function handleSave(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const interviews = canAddRounds
      ? rounds.map((round) => ({
          round: Number(round.round),
          type: round.type,
          scheduledAt: round.scheduledAt,
          interviewer: round.interviewer.trim() || undefined,
          durationMinutes:
            round.durationMinutes === '' ? undefined : Number(round.durationMinutes),
          outcome: round.outcome,
          notes: round.notes.trim() || undefined
        }))
      : [];

    try {
      await onSave(
        application._id,
        {
          ...form,
          priority: Number(form.priority),
          salaryExpectation: form.salaryExpectation === '' ? undefined : Number(form.salaryExpectation),
          appliedDate: form.appliedDate === '' ? null : form.appliedDate,
          deadline: form.deadline === '' ? null : form.deadline
        },
        interviews
      );
      onClose();
    } catch (err) {
      setError(err.details?.join(' · ') ?? err.message);
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    setError(null);

    try {
      await onDelete(application._id);
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Edit application"
      subtitle={`${application.role} at ${application.companyId?.name ?? 'Unknown company'}`}
      onClose={onClose}
    >
      {error && <p className="alert alert--error">{error}</p>}

      <form onSubmit={handleSave}>
        <label className="field">
          Role
          <input type="text" value={form.role} onChange={(e) => update('role', e.target.value)} required />
        </label>

        <div className="field-row">
          <label className="field">
            Stage
            <select value={form.stage} onChange={(e) => update('stage', e.target.value)}>
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            Priority (1-5)
            <input
              type="number"
              min="1"
              max="5"
              value={form.priority}
              onChange={(e) => update('priority', e.target.value)}
            />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            Applied on
            <input
              type="date"
              value={form.appliedDate}
              onChange={(e) => update('appliedDate', e.target.value)}
            />
          </label>

          <label className="field">
            Deadline
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => update('deadline', e.target.value)}
            />
          </label>
        </div>

        <label className="field">
          Expected pay (SEK/month)
          <input
            type="number"
            min="0"
            value={form.salaryExpectation}
            onChange={(e) => update('salaryExpectation', e.target.value)}
          />
        </label>

        <label className="field">
          Notes
          <textarea rows="3" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
        </label>

        {canAddRounds && (
          <div className="create-rounds">
            <div className="detail__heading-row">
              <h3 className="detail__heading">Interview rounds</h3>
              <button type="button" className="btn btn--ghost" onClick={addRound} disabled={busy}>
                Add round
              </button>
            </div>
            <p className="create-rounds__hint">
              {existingCount > 0
                ? `${existingCount} round${existingCount === 1 ? '' : 's'} already saved — manage those from the application detail. Add new ones here.`
                : 'Optional — new rounds are saved with this application.'}
            </p>

            {rounds.map((round) => (
              <div key={round.id} className="interview-form">
                <div className="field-row">
                  <label className="field">
                    Round
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={round.round}
                      onChange={(e) => updateRound(round.id, 'round', e.target.value)}
                      required
                    />
                  </label>
                  <label className="field">
                    Type
                    <select
                      value={round.type}
                      onChange={(e) => updateRound(round.id, 'type', e.target.value)}
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
                      value={round.scheduledAt}
                      onChange={(e) => updateRound(round.id, 'scheduledAt', e.target.value)}
                      required
                    />
                  </label>
                  <label className="field">
                    Duration (min)
                    <input
                      type="number"
                      min="15"
                      max="480"
                      value={round.durationMinutes}
                      onChange={(e) => updateRound(round.id, 'durationMinutes', e.target.value)}
                    />
                  </label>
                </div>

                <div className="field-row">
                  <label className="field">
                    Interviewer
                    <input
                      type="text"
                      value={round.interviewer}
                      onChange={(e) => updateRound(round.id, 'interviewer', e.target.value)}
                      placeholder="Optional"
                    />
                  </label>
                  <label className="field">
                    Outcome
                    <select
                      value={round.outcome}
                      onChange={(e) => updateRound(round.id, 'outcome', e.target.value)}
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
                    value={round.notes}
                    onChange={(e) => updateRound(round.id, 'notes', e.target.value)}
                    placeholder="Optional"
                  />
                </label>

                <button
                  type="button"
                  className="round__delete"
                  onClick={() => removeRound(round.id)}
                  disabled={busy}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="modal__actions">
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? 'Saving...' : 'Save changes'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
        </div>
      </form>

      <div className="danger-zone">
        {confirmingDelete ? (
          <>
            <p className="danger-zone__prompt">
              Delete this application and its interviews? This cannot be undone.
            </p>
            <div className="danger-zone__actions">
              <button type="button" className="btn btn--danger" onClick={handleDelete} disabled={busy}>
                Yes, delete it
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setConfirmingDelete(false)}
                disabled={busy}
              >
                Keep it
              </button>
            </div>
          </>
        ) : (
          <button type="button" className="btn btn--danger-ghost" onClick={() => setConfirmingDelete(true)}>
            Delete application
          </button>
        )}
      </div>
    </Modal>
  );
}
