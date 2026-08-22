import { useEffect, useMemo, useState } from 'react';
import KanbanCard from './KanbanCard.jsx';
import Icon from './Icon.jsx';

const COLUMNS = [
  { stage: 'wishlist', title: 'Wishlist' },
  { stage: 'applied', title: 'Applied' },
  { stage: 'screening', title: 'Screening' },
  { stage: 'interview', title: 'Interview' },
  { stage: 'offer', title: 'Offer' },
  { stage: 'rejected', title: 'Rejected' }
];

export default function KanbanBoard({ applications, stage, onMoveStage, onOpen, onAdd }) {
  const [dragging, setDragging] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
// Optimistic stage while the PUT is in flight.
  const [optimistic, setOptimistic] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    setOptimistic((current) => {
      const stillPending = Object.entries(current).filter(([id, pendingStage]) => {
        const application = applications.find((item) => item._id === id);
        return application && application.stage !== pendingStage;
      });

      return stillPending.length === Object.keys(current).length ? current : Object.fromEntries(stillPending);
    });
  }, [applications]);

  const resolved = useMemo(
    () =>
      applications.map((application) =>
        optimistic[application._id] ? { ...application, stage: optimistic[application._id] } : application
      ),
    [applications, optimistic]
  );

  const columns = stage === 'all' ? COLUMNS : COLUMNS.filter((column) => column.stage === stage);

  function handleDragStart(event, application) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', application._id);
    setDragging(application);
  }

  function handleDragEnd() {
    setDragging(null);
    setDropTarget(null);
  }

  function handleDragOver(event, targetStage) {
    if (!dragging) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDropTarget(targetStage);
  }

  async function handleDrop(event, targetStage) {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    const moved = applications.find((application) => application._id === id);

    setDragging(null);
    setDropTarget(null);

    if (!moved || moved.stage === targetStage) return;

    setOptimistic((current) => ({ ...current, [id]: targetStage }));
    setError(null);

    try {
      await onMoveStage(id, targetStage);
    } catch (err) {
      setOptimistic((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      setError(err.details?.join(' · ') ?? err.message);
    }
  }

  return (
    <>
      {error && <p className="alert alert--error">Could not move that application: {error}</p>}

      <div className="kanban">
        {columns.map((column) => {
          const cards = resolved.filter((application) => application.stage === column.stage);

          return (
            <section
              key={column.stage}
              className={`kcol${dropTarget === column.stage ? ' kcol--over' : ''}`}
              onDragOver={(event) => handleDragOver(event, column.stage)}
              onDragLeave={() => setDropTarget((current) => (current === column.stage ? null : current))}
              onDrop={(event) => handleDrop(event, column.stage)}
            >
              <header className="kcol__head">
                <span className={`kcol__dot kcol__dot--${column.stage}`} />
                <h3 className="kcol__title">{column.title}</h3>
                <span className="kcol__count">{cards.length}</span>
                <button
                  type="button"
                  className="icon-btn icon-btn--sm"
                  onClick={onAdd}
                  aria-label={`Add an application to ${column.title}`}
                >
                  <Icon name="plus" size={14} />
                </button>
              </header>

              <div className="kcol__body">
                {cards.map((application) => (
                  <KanbanCard
                    key={application._id}
                    application={application}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onOpen={onOpen}
                    dragging={dragging?._id === application._id}
                  />
                ))}

                {cards.length === 0 && <p className="kcol__empty">Drop an application here</p>}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
