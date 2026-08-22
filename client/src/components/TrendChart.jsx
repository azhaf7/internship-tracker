import { useMemo } from 'react';

const MONTHS_SHOWN = 6;
const WIDTH = 640;
const HEIGHT = 190;
const PAD_X = 10;
const PAD_TOP = 14;
const PAD_BOTTOM = 30;

// Last six months of applications, by appliedDate.
function buildSeries(applications) {
  const now = new Date();
  const buckets = [];

  for (let offset = MONTHS_SHOWN - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    buckets.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleDateString('en-GB', { month: 'short' }),
      count: 0
    });
  }

  const positions = new Map(buckets.map((bucket, index) => [bucket.key, index]));

  for (const application of applications) {
    if (!application.appliedDate) continue;
    const date = new Date(application.appliedDate);
    const position = positions.get(`${date.getFullYear()}-${date.getMonth()}`);
    if (position !== undefined) buckets[position].count += 1;
  }

  return buckets;
}

export default function TrendChart({ applications }) {
  const series = useMemo(() => buildSeries(applications), [applications]);

  const { linePath, areaPath, points, max } = useMemo(() => {
    const peak = Math.max(1, ...series.map((bucket) => bucket.count));
    const usableHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
    const step = (WIDTH - PAD_X * 2) / Math.max(1, series.length - 1);

    const plotted = series.map((bucket, index) => ({
      ...bucket,
      x: PAD_X + index * step,
      y: PAD_TOP + (1 - bucket.count / peak) * usableHeight
    }));

    const line = plotted
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(' ');

    const baseline = HEIGHT - PAD_BOTTOM;
    const area = `${line} L${plotted.at(-1).x.toFixed(1)},${baseline} L${plotted[0].x.toFixed(1)},${baseline} Z`;

    return { linePath: line, areaPath: area, points: plotted, max: peak };
  }, [series]);

  const totalPlotted = series.reduce((sum, bucket) => sum + bucket.count, 0);

  return (
    <section className="panel chart">
      <div className="panel__head">
        <div>
          <h2 className="panel__title">Applications Sent Over Time</h2>
          <p className="panel__sub">{totalPlotted} sent in the last {MONTHS_SHOWN} months</p>
        </div>
        <span className="chart__peak">peak {max}</span>
      </div>

      <svg className="chart__svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" preserveAspectRatio="none"
        aria-label={`Applications sent per month: ${series.map((b) => `${b.label} ${b.count}`).join(', ')}`}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22a06b" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#22a06b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((ratio) => {
          const y = PAD_TOP + ratio * (HEIGHT - PAD_TOP - PAD_BOTTOM);
          return <line key={ratio} className="chart__grid" x1={PAD_X} y1={y} x2={WIDTH - PAD_X} y2={y} />;
        })}

        <path className="chart__area" d={areaPath} fill="url(#chartFill)" />
        <path className="chart__line" d={linePath} />

        {points.map((point) => (
          <g key={point.key}>
            <circle className="chart__dot" cx={point.x} cy={point.y} r="3.5" />
            <text className="chart__label" x={point.x} y={HEIGHT - 9} textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
