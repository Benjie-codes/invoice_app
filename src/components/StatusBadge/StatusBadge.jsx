import './StatusBadge.css';

/**
 * Status badge component for invoice states.
 * @param {{ status: 'draft' | 'pending' | 'paid' }} props
 */
export default function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      {status}
    </span>
  );
}
