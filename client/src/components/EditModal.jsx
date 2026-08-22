import { useState } from 'react';
import Modal from './Modal.jsx';

const STAGES = ['wishlist', 'applied', 'screening', 'interview', 'offer', 'rejected'];

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
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
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await onSave(application._id, {
        ...form,
        priority: Number(form.priority),
        salaryExpectation: form.salaryExpectation === '' ? undefined : Number(form.salaryExpectation),
        appliedDate: form.appliedDate === '' ? null : form.appliedDate,
        deadline: form.deadline === '' ? null : form.deadline
      });
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
