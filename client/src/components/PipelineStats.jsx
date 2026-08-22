const STAGE_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected'
};

export default function PipelineStats({ stats, loading, error }) {
  if (loading) {
    return (
      <section className="panel" aria-hidden="true">
        <div className="panel__head">
          <span className="skeleton skeleton--label" />
        </div>
        <div className="bars">
          {Object.keys(STAGE_LABELS).map((stage) => (
            <span key={stage} className="skeleton skeleton--bar" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="panel">
        <p className="alert alert--error">Could not load the pipeline: {error}</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel__head">
        <div>
          <h2 className="panel__title">Pipeline by Stage</h2>
          <p className="panel__sub">{stats.total} applications tracked</p>
        </div>
      </div>

      <div className="bars">
        {stats.stages.map((row) => (
          <div key={row.stage} className="bar">
            <span className="bar__label">{STAGE_LABELS[row.stage] ?? row.stage}</span>
            <div className="bar__track">
              <div
                className={`bar__fill bar__fill--${row.stage}`}
                style={{ width: `${stats.total === 0 ? 0 : (row.count / stats.total) * 100}%` }}
              />
            </div>
            <span className="bar__count">{row.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
