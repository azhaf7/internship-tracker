import { useEffect, useMemo, useState } from 'react';
import { api } from './api/client.js';
import { useApplications } from './hooks/useApplications.js';
import { usePipelineStats } from './hooks/usePipelineStats.js';
import Topbar from './components/Topbar.jsx';
import StatCards from './components/StatCards.jsx';
import TrendChart from './components/TrendChart.jsx';
import PipelineStats from './components/PipelineStats.jsx';
import TableToolbar from './components/TableToolbar.jsx';
import ViewToggle from './components/ViewToggle.jsx';
import Dock from './components/Dock.jsx';
import KanbanBoard from './components/KanbanBoard.jsx';
import ApplicationsTable from './components/ApplicationsTable.jsx';
import ApplicationForm from './components/ApplicationForm.jsx';
import ApplicationDetail from './components/ApplicationDetail.jsx';
import EditModal from './components/EditModal.jsx';
import Modal from './components/Modal.jsx';

const STAGE_TITLES = {
  all: 'Dashboard',
  wishlist: 'Wishlist',
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interviews',
  offer: 'Offers',
  rejected: 'Rejections'
};

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [view, setView] = useState('board');
  const [statsToken, setStatsToken] = useState(0);

  const { applications, loading, error, lastUpdated, refresh } = useApplications(stage, search);
  const { stats, loading: statsLoading, error: statsError } = usePipelineStats(statsToken);

  useEffect(() => {
    api.getCompanies().then(setCompanies).catch(() => setCompanies([]));
  }, []);

  // Badge counts come from stats so filtering the list does not shrink them.
  const counts = useMemo(() => {
    const tally = { all: stats?.total ?? 0 };
    for (const row of stats?.stages ?? []) {
      tally[row.stage] = row.count;
    }
    return tally;
  }, [stats]);

  async function afterMutation() {
    await refresh();
    setStatsToken((token) => token + 1);
  }

  async function handleCreate(payload) {
    await api.createApplication(payload);
    await afterMutation();
    setCreating(false);
  }

  async function handleUpdate(id, payload) {
    await api.updateApplication(id, payload);
    await afterMutation();
  }

  async function handleDelete(id) {
    await api.deleteApplication(id);
    await afterMutation();
  }

  // Drag-and-drop only patches the stage field.
  async function handleMoveStage(id, stage) {
    await api.updateApplication(id, { stage });
    await afterMutation();
  }

  function clearFilters() {
    setSearch('');
    setStage('all');
  }

  // One dock entry per stage — that is the only way to reach them.
  const stageItems = [
    { id: 'all', label: 'Dashboard', icon: 'grid' },
    { id: 'wishlist', label: 'Wishlist', icon: 'bookmark' },
    { id: 'applied', label: 'Applied', icon: 'send' },
    { id: 'screening', label: 'Screening', icon: 'filter' },
    { id: 'interview', label: 'Interviews', icon: 'calendar' },
    { id: 'offer', label: 'Offers', icon: 'check' },
    { id: 'rejected', label: 'Rejections', icon: 'close' }
  ];

  const dockItems = [
    ...stageItems.map((item) => ({
      ...item,
      badge: counts[item.id],
      active: stage === item.id,
      onClick: () => setStage(item.id)
    })),
    {
      id: 'view',
      label: view === 'board' ? 'Switch to table' : 'Switch to board',
      icon: view === 'board' ? 'rows' : 'columns',
      onClick: () => setView((current) => (current === 'board' ? 'table' : 'board'))
    },
    { id: 'add', label: 'Add application', icon: 'plus', onClick: () => setCreating(true) }
  ];

  const onDashboard = stage === 'all';

  return (
    <div className="shell">
      <div className="main">
        <Topbar
          crumb={STAGE_TITLES[stage]}
          search={search}
          onSearchChange={setSearch}
          onAdd={() => setCreating(true)}
          lastUpdated={lastUpdated}
        />

        <main className="content">
          {onDashboard ? (
            <>
              <div className="greeting">
                <h1>Job hunt overview</h1>
                <p>
                  Track your applications, manage interviews, and take control of your career journey.
                </p>
              </div>

              <StatCards stats={stats} loading={statsLoading} error={statsError} />

              <div className="panel-row">
                <TrendChart applications={applications} />
                <PipelineStats stats={stats} loading={statsLoading} error={statsError} />
              </div>
            </>
          ) : (
            <div className="greeting">
              <h1>{STAGE_TITLES[stage]}</h1>
              <p>
                {counts[stage] ?? 0} application{(counts[stage] ?? 0) === 1 ? '' : 's'} at this stage.
              </p>
            </div>
          )}

          <section className="panel">
            <TableToolbar
              search={search}
              stage={stage}
              resultCount={applications.length}
              onClear={clearFilters}
            >
              <ViewToggle view={view} onChange={setView} />
            </TableToolbar>

            {loading && <p className="loading">Loading applications...</p>}
            {error && <p className="alert alert--error">Could not load applications: {error}</p>}

            {!loading && !error && view === 'table' && (
              <ApplicationsTable applications={applications} onOpen={setViewing} onEdit={setEditing} />
            )}

            {!loading && !error && view === 'board' && (
              <KanbanBoard
                applications={applications}
                stage={stage}
                onMoveStage={handleMoveStage}
                onOpen={setViewing}
                onAdd={() => setCreating(true)}
              />
            )}
          </section>
        </main>
      </div>

      {creating && (
        <Modal
          title="Track a new application"
          subtitle="Add a role you have applied for, or one you are still eyeing."
          onClose={() => setCreating(false)}
        >
          <ApplicationForm
            companies={companies}
            onCreate={handleCreate}
            onCancel={() => setCreating(false)}
          />
        </Modal>
      )}

      <Dock items={dockItems} />

      {viewing && !editing && (
        <ApplicationDetail
          application={viewing}
          onEdit={(application) => {
            setViewing(null);
            setEditing(application);
          }}
          onClose={() => setViewing(null)}
        />
      )}

      {editing && (
        <EditModal
          application={editing}
          onSave={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
