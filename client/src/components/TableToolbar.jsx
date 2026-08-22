const STAGE_LABELS = {
  all: 'All stages',
  wishlist: 'Wishlist',
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected'
};

export default function TableToolbar({ search, stage, resultCount, onClear, children }) {
  const filtered = search.trim() !== '' || stage !== 'all';

  return (
    <div className="toolbar">
      <div>
        <h2 className="panel__title">Applications</h2>
        <p className="panel__sub">
          {resultCount} shown
          {stage !== 'all' && ` in ${STAGE_LABELS[stage]}`}
          {search.trim() !== '' && ` matching "${search.trim()}"`}
        </p>
      </div>

      <div className="toolbar__actions">
        {filtered && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClear}>
            Clear filters
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
