// Generates docs/erd.svg and docs/erd.png from the schema description below.
// Run with: npm run erd
//
// The diagram is generated rather than drawn by hand so it stays in step with
// the Mongoose models: update the entities here and re-run. The PNG is what the
// report embeds, because a vector diagram does not survive every PDF exporter.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DOCS_DIR = dirname(fileURLToPath(import.meta.url));
const OUT = join(DOCS_DIR, 'erd.svg');
const OUT_PNG = join(DOCS_DIR, 'erd.png');

const HEADER_H = 32;
const ROW_H = 19;
const PAD_BOTTOM = 10;

const entities = [
  {
    name: 'companies',
    subtitle: '6 documents',
    x: 40,
    y: 80,
    w: 340,
    nameCol: 150,
    fields: [
      ['_id', 'ObjectId', 'PK'],
      ['name', 'String', 'UK'],
      ['industry', 'String', ''],
      ['location', 'String', ''],
      ['website', 'String', ''],
      ['employeeCount', 'Number', ''],
      ['notes', 'String', ''],
      ['createdAt', 'Date', ''],
      ['updatedAt', 'Date', '']
    ],
    constraints: [
      '',
      'required, unique, 2-80',
      'required, enum(8)',
      'required',
      'match https?://',
      'min 1, max 500000',
      'max 500',
      'auto',
      'auto'
    ]
  },
  {
    name: 'applications',
    subtitle: '10 documents · main entity',
    x: 500,
    y: 80,
    w: 400,
    nameCol: 175,
    highlight: 'stage',
    fields: [
      ['_id', 'ObjectId', 'PK'],
      ['companyId', 'ObjectId', 'FK'],
      ['role', 'String', ''],
      ['jobType', 'String', ''],
      ['stage', 'String', '*'],
      ['appliedDate', 'Date', ''],
      ['deadline', 'Date', ''],
      ['jobUrl', 'String', ''],
      ['salaryExpectation', 'Number', ''],
      ['source', 'String', ''],
      ['priority', 'Number', ''],
      ['notes', 'String', ''],
      ['createdAt', 'Date', ''],
      ['updatedAt', 'Date', '']
    ],
    constraints: [
      '',
      'required, ref Company',
      'required, 3-100',
      'enum(4), def internship',
      'required, enum(6)',
      '',
      '',
      'match https?://',
      'min 0, max 120000',
      'enum(6)',
      'min 1, max 5, def 3',
      'max 1000',
      'auto',
      'auto'
    ]
  },
  {
    name: 'interviews',
    subtitle: '8 documents',
    x: 1010,
    y: 80,
    w: 380,
    nameCol: 165,
    fields: [
      ['_id', 'ObjectId', 'PK'],
      ['applicationId', 'ObjectId', 'FK'],
      ['round', 'Number', ''],
      ['type', 'String', ''],
      ['scheduledAt', 'Date', ''],
      ['interviewer', 'String', ''],
      ['durationMinutes', 'Number', ''],
      ['outcome', 'String', ''],
      ['notes', 'String', ''],
      ['createdAt', 'Date', ''],
      ['updatedAt', 'Date', '']
    ],
    constraints: [
      '',
      'required, ref Application',
      'required, 1-8',
      'required, enum(5)',
      'required',
      'max 80',
      'min 15, max 480',
      'enum(4), def scheduled',
      'max 1000',
      'auto',
      'auto'
    ]
  },
  {
    name: 'contacts',
    subtitle: '7 documents',
    x: 40,
    y: 430,
    w: 340,
    nameCol: 150,
    fields: [
      ['_id', 'ObjectId', 'PK'],
      ['companyId', 'ObjectId', 'FK'],
      ['name', 'String', ''],
      ['role', 'String', ''],
      ['email', 'String', ''],
      ['phone', 'String', ''],
      ['isPrimary', 'Boolean', ''],
      ['createdAt', 'Date', ''],
      ['updatedAt', 'Date', '']
    ],
    constraints: [
      '',
      'required, ref Company',
      'required, 2-80',
      'required, max 80',
      'required, email',
      'max 24',
      'default false',
      'auto',
      'auto'
    ]
  }
];

const height = (entity) => HEADER_H + entity.fields.length * ROW_H + PAD_BOTTOM;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderEntity(entity) {
  const h = height(entity);
  const parts = [];

  parts.push(`
  <g>
    <rect x="${entity.x}" y="${entity.y}" width="${entity.w}" height="${h}" rx="8"
          fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
    <path d="M ${entity.x} ${entity.y + HEADER_H} L ${entity.x} ${entity.y + 8}
             Q ${entity.x} ${entity.y} ${entity.x + 8} ${entity.y}
             L ${entity.x + entity.w - 8} ${entity.y}
             Q ${entity.x + entity.w} ${entity.y} ${entity.x + entity.w} ${entity.y + 8}
             L ${entity.x + entity.w} ${entity.y + HEADER_H} Z"
          fill="#1e293b"/>
    <text x="${entity.x + 12}" y="${entity.y + 21}" font-family="Helvetica, Arial, sans-serif"
          font-size="13.5" font-weight="700" fill="#ffffff">${escapeXml(entity.name)}</text>
    <text x="${entity.x + entity.w - 12}" y="${entity.y + 21}" text-anchor="end"
          font-family="Helvetica, Arial, sans-serif" font-size="10" fill="#94a3b8">${escapeXml(entity.subtitle)}</text>`);

  entity.fields.forEach(([name, type, badge], index) => {
    const rowY = entity.y + HEADER_H + index * ROW_H;
    const textY = rowY + 13.5;
    const isHighlight = entity.highlight === name;

    if (index % 2 === 1) {
      parts.push(`    <rect x="${entity.x + 1}" y="${rowY}" width="${entity.w - 2}" height="${ROW_H}" fill="#f8fafc"/>`);
    }

    if (isHighlight) {
      parts.push(`    <rect x="${entity.x + 1}" y="${rowY}" width="${entity.w - 2}" height="${ROW_H}" fill="#fef3c7"/>`);
    }

    const nameColour = badge === 'PK' ? '#0f766e' : badge === 'FK' ? '#b45309' : '#0f172a';
    const weight = badge ? '700' : '400';

    parts.push(`    <text x="${entity.x + 12}" y="${textY}" font-family="Menlo, Consolas, monospace"
          font-size="11" font-weight="${weight}" fill="${nameColour}">${escapeXml(name)}</text>`);

    parts.push(`    <text x="${entity.x + entity.nameCol}" y="${textY}" font-family="Menlo, Consolas, monospace"
          font-size="10.5" fill="#475569">${escapeXml(type)}</text>`);

    const constraint = entity.constraints[index];
    if (constraint) {
      parts.push(`    <text x="${entity.x + entity.w - 12}" y="${textY}" text-anchor="end"
          font-family="Helvetica, Arial, sans-serif" font-size="9.5" fill="#94a3b8">${escapeXml(constraint)}</text>`);
    }
  });

  parts.push('  </g>');
  return parts.join('\n');
}

// Crow's foot: three short strokes fanning out on the "many" end.
function crowsFoot(x, y, direction = 'right') {
  const s = direction === 'right' ? 1 : -1;
  return `
    <g stroke="#475569" stroke-width="1.5" fill="none">
      <line x1="${x}" y1="${y}" x2="${x + s * 12}" y2="${y - 7}"/>
      <line x1="${x}" y1="${y}" x2="${x + s * 12}" y2="${y}"/>
      <line x1="${x}" y1="${y}" x2="${x + s * 12}" y2="${y + 7}"/>
    </g>`;
}

function crowsFootDown(x, y) {
  return `
    <g stroke="#475569" stroke-width="1.5" fill="none">
      <line x1="${x}" y1="${y}" x2="${x - 7}" y2="${y + 12}"/>
      <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 12}"/>
      <line x1="${x}" y1="${y}" x2="${x + 7}" y2="${y + 12}"/>
    </g>`;
}

function relationshipLabel(x, y, text) {
  return `
    <rect x="${x - text.length * 3.3 - 6}" y="${y - 15}" width="${text.length * 6.6 + 12}" height="18" rx="4"
          fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
    <text x="${x}" y="${y - 2}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
          font-size="10.5" fill="#334155">${escapeXml(text)}</text>`;
}

const [companies, applications, interviews, contacts] = entities;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="740" viewBox="0 0 1440 740">
  <rect width="1440" height="740" fill="#ffffff"/>

  <text x="40" y="42" font-family="Helvetica, Arial, sans-serif" font-size="19" font-weight="700" fill="#0f172a">
    Internship Tracker — Data Model
  </text>
  <text x="40" y="61" font-family="Helvetica, Arial, sans-serif" font-size="11.5" fill="#64748b">
    MongoDB Atlas · 4 collections · relationships by ObjectId reference
  </text>

${entities.map(renderEntity).join('\n')}

  <!-- companies 1 to N applications -->
  <g>
    <line x1="${companies.x + companies.w}" y1="180" x2="${applications.x - 14}" y2="180"
          stroke="#475569" stroke-width="1.5"/>
    <line x1="${companies.x + companies.w + 8}" y1="173" x2="${companies.x + companies.w + 8}" y2="187"
          stroke="#475569" stroke-width="1.5"/>
    ${crowsFoot(applications.x - 14, 180, 'right')}
    ${relationshipLabel((companies.x + companies.w + applications.x) / 2, 175, 'receives')}
  </g>

  <!-- applications 1 to N interviews -->
  <g>
    <line x1="${applications.x + applications.w}" y1="200" x2="${interviews.x - 14}" y2="200"
          stroke="#475569" stroke-width="1.5"/>
    <line x1="${applications.x + applications.w + 8}" y1="193" x2="${applications.x + applications.w + 8}" y2="207"
          stroke="#475569" stroke-width="1.5"/>
    ${crowsFoot(interviews.x - 14, 200, 'right')}
    ${relationshipLabel((applications.x + applications.w + interviews.x) / 2, 195, 'schedules')}
  </g>

  <!-- companies 1 to N contacts -->
  <g>
    <line x1="200" y1="${companies.y + height(companies)}" x2="200" y2="${contacts.y - 14}"
          stroke="#475569" stroke-width="1.5"/>
    <line x1="193" y1="${companies.y + height(companies) + 8}" x2="207" y2="${companies.y + height(companies) + 8}"
          stroke="#475569" stroke-width="1.5"/>
    ${crowsFootDown(200, contacts.y - 14)}
    ${relationshipLabel(200, (companies.y + height(companies) + contacts.y) / 2, 'employs')}
  </g>

  <!-- legend -->
  <g transform="translate(500, 470)">
    <rect x="0" y="0" width="400" height="118" rx="8" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
    <text x="14" y="22" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="700" fill="#0f172a">Legend</text>
    <text x="14" y="43" font-family="Menlo, Consolas, monospace" font-size="10.5" font-weight="700" fill="#0f766e">PK</text>
    <text x="44" y="43" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#475569">Primary key (MongoDB _id)</text>
    <text x="14" y="62" font-family="Menlo, Consolas, monospace" font-size="10.5" font-weight="700" fill="#b45309">FK</text>
    <text x="44" y="62" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#475569">ObjectId reference to another collection</text>
    <rect x="14" y="72" width="20" height="12" fill="#fef3c7" stroke="#fcd34d"/>
    <text x="44" y="82" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#475569">Custom domain field (pipeline stage)</text>
    <text x="14" y="102" font-family="Helvetica, Arial, sans-serif" font-size="10.5" fill="#475569">Crow's foot marks the "many" side of a one-to-many relation</text>
  </g>

  <!-- unique index note -->
  <g transform="translate(1010, 470)">
    <rect x="0" y="0" width="380" height="70" rx="8" fill="#fff7ed" stroke="#fdba74" stroke-width="1"/>
    <text x="14" y="22" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="700" fill="#9a3412">Unique compound index</text>
    <text x="14" y="42" font-family="Menlo, Consolas, monospace" font-size="10.5" fill="#7c2d12">applications { companyId: 1, role: 1 }</text>
    <text x="14" y="59" font-family="Helvetica, Arial, sans-serif" font-size="10" fill="#9a3412">Duplicate role at the same company is rejected with 409 Conflict</text>
  </g>
</svg>
`;

writeFileSync(OUT, svg, 'utf8');
console.log(`Wrote ${OUT}`);

// Rasterise to PNG. resvg is a native renderer, so this needs no headless
// browser - handy on machines where downloading Chromium is not an option.
try {
  const { Resvg } = await import('@resvg/resvg-js');
  const renderer = new Resvg(svg, {
    fitTo: { mode: 'width', value: 2880 },
    background: 'white'
  });
  writeFileSync(OUT_PNG, renderer.render().asPng());
  console.log(`Wrote ${OUT_PNG}`);
} catch (err) {
  console.warn(`Skipped PNG (${err.message}). Run: npm install @resvg/resvg-js`);
}
