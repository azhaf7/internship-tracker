import { useState } from 'react';

const STAGES = ['wishlist', 'applied', 'screening', 'interview', 'offer', 'rejected'];
const JOB_TYPES = ['internship', 'part-time', 'full-time', 'thesis'];
const SOURCES = ['LinkedIn', 'Company site', 'Referral', 'Career fair', 'University portal', 'Recruiter'];
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

const EMPTY_FORM = {
  companyId: '',
  role: '',
  jobType: 'internship',
  stage: 'wishlist',
  appliedDate: '',
  deadline: '',
  salaryExpectation: '',
  source: 'LinkedIn',
  priority: 3,
  notes: ''
};

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

export default function ApplicationForm({ companies, onCreate, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [rounds, setRounds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const canAddRounds = STAGES_THAT_ALLOW_ROUNDS.has(form.stage);

  function update(field, value) {
    if (field === 'stage' && !STAGES_THAT_ALLOW_ROUNDS.has(value)) {
      setRounds([]);
    }
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addRound() {
    setRounds((current) => [...current, emptyRound(current.length + 1)]);
  }

  function removeRound(id) {
    setRounds((current) =>
      current
        .filter((round) => round.id !== id)
        .map((round, index) => ({ ...round, round: String(index + 1) }))
    );
  }

  function updateRound(id, field, value) {
    setRounds((current) =>
      current.map((round) => (round.id === id ? { ...round, [field]: value } : round))
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      ...form,
      priority: Number(form.priority),
      salaryExpectation: form.salaryExpectation === '' ? undefined : Number(form.salaryExpectation),
      appliedDate: form.appliedDate === '' ? undefined : form.appliedDate,
      deadline: form.deadline === '' ? undefined : form.deadline
    };

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
      await onCreate(payload, interviews);
      setForm(EMPTY_FORM);
      setRounds([]);
    } catch (err) {
      setError(err.details?.join(' · ') ?? err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="alert alert--error">{error}</p>}

      <div className="field-row">
        <label className="field">
          Company
          <select value={form.companyId} onChange={(e) => update('companyId', e.target.value)} required>
            <option value="">Select a company...</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          Job type
          <select value={form.jobType} onChange={(e) => update('jobType', e.target.value)}>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        Role
        <input
          type="text"
          value={form.role}
          onChange={(e) => update('role', e.target.value)}
          placeholder="Summer Intern, Backend Engineering"
          required
        />
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
          Applied on
          <input
            type="date"
            value={form.appliedDate}
            onChange={(e) => update('appliedDate', e.target.value)}
          />
        </label>
      </div>

      <label className="field">
        Deadline
        <input
          type="date"
          value={form.deadline}
          onChange={(e) => update('deadline', e.target.value)}
        />
      </label>

      <div className="field-row">
        <label className="field">
          Expected pay (SEK/month)
          <input
            type="number"
            min="0"
            max="120000"
            value={form.salaryExpectation}
            onChange={(e) => update('salaryExpectation', e.target.value)}
            placeholder="27000"
          />
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

      <label className="field">
        Source
        <select value={form.source} onChange={(e) => update('source', e.target.value)}>
          {SOURCES.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        Notes
        <textarea
          rows="2"
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Who referred you, what they asked, what to follow up on..."
        />
      </label>

      {canAddRounds && (
        <div className="create-rounds">
          <div className="detail__heading-row">
            <h3 className="detail__heading">Interview rounds</h3>
            <button type="button" className="btn btn--ghost" onClick={addRound} disabled={submitting}>
              Add round
            </button>
          </div>
          <p className="create-rounds__hint">Optional — you can also add rounds later from the application.</p>

          {rounds.length === 0 && (
            <p className="detail__empty">No rounds yet. Click Add round if you already have one scheduled.</p>
          )}

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
                disabled={submitting}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="modal__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Add application'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
