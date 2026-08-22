const STAGE_LABELS = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected'
};

export default function StatusBadge({ stage }) {
  return (
    <span className={`badge badge--${stage}`}>{STAGE_LABELS[stage] ?? stage}</span>
  );
}
