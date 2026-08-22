import { useMemo, useState } from 'react';
import ApplicationRow from './ApplicationRow.jsx';

const COLUMNS = [
  { key: 'role', label: 'Role' },
  { key: 'company', label: 'Company' },
  { key: 'stage', label: 'Stage' },
  { key: 'priority', label: 'Priority' },
  { key: 'appliedDate', label: 'Applied' },
  { key: 'salaryExpectation', label: 'Expected pay' }
];

function valueFor(application, key) {
  switch (key) {
    case 'company':
      return application.companyId?.name ?? '';
    case 'appliedDate':
      return application.appliedDate ? new Date(application.appliedDate).getTime() : 0;
    case 'priority':
    case 'salaryExpectation':
      return application[key] ?? 0;
    default:
      return (application[key] ?? '').toString().toLowerCase();
  }
}

export default function ApplicationsTable({ applications, onOpen, onEdit }) {
  const [sort, setSort] = useState({ key: 'priority', direction: 'desc' });

  const sorted = useMemo(() => {
    const copy = [...applications];

    copy.sort((a, b) => {
      const left = valueFor(a, sort.key);
      const right = valueFor(b, sort.key);

      if (left < right) return sort.direction === 'asc' ? -1 : 1;
      if (left > right) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return copy;
  }, [applications, sort]);

  function toggleSort(key) {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  }

  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">Nothing here yet</p>
        <p>No applications match the current search and stage filter.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column.key} aria-sort={sort.key === column.key ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button type="button" className="th-button" onClick={() => toggleSort(column.key)}>
                  {column.label}
                  <span className={`th-arrow${sort.key === column.key ? ' th-arrow--on' : ''}`}>
                    {sort.key === column.key && sort.direction === 'asc' ? '↑' : '↓'}
                  </span>
                </button>
              </th>
            ))}
            <th>
              <span className="th-plain">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((application) => (
            <ApplicationRow
              key={application._id}
              application={application}
              onOpen={onOpen}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
