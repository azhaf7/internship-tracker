import { useState } from 'react';

const STAGES = ['wishlist', 'applied', 'screening', 'interview', 'offer', 'rejected'];
const JOB_TYPES = ['internship', 'part-time', 'full-time', 'thesis'];
const SOURCES = ['LinkedIn', 'Company site', 'Referral', 'Career fair', 'University portal', 'Recruiter'];

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

export default function ApplicationForm({ companies, onCreate, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
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

    try {
      await onCreate(payload);
      setForm(EMPTY_FORM);
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
