import StatusBadge from '../StatusBadge/StatusBadge';
import arrowRight from '../../assets/icon-arrow-right.svg';
import { formatDate, formatCurrency } from '../../utils/helpers';
import './InvoiceCard.css';

export default function InvoiceCard({ invoice, onClick }) {
  return (
    <div
      className="invoice-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Invoice ${invoice.id}, ${invoice.clientName}, ${formatCurrency(invoice.total)}, ${invoice.status}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <span className="invoice-card__id">
        <span className="invoice-card__id-hash">#</span>
        {invoice.id}
      </span>

      <span className="invoice-card__date">
        Due {formatDate(invoice.paymentDue)}
      </span>

      <span className="invoice-card__name">{invoice.clientName}</span>

      <span className="invoice-card__amount">
        {formatCurrency(invoice.total)}
      </span>

      <span className="invoice-card__status">
        <StatusBadge status={invoice.status} />
      </span>

      <img
        className="invoice-card__arrow"
        src={arrowRight}
        alt=""
        aria-hidden="true"
      />
    </div>
  );
}
