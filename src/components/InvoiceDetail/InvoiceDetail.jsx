import { useInvoices } from '../../context/InvoiceContext';
import StatusBadge from '../StatusBadge/StatusBadge';
import Button from '../UI/Button';
import { formatDate, formatCurrency } from '../../utils/helpers';
import arrowLeft from '../../assets/icon-arrow-left.svg';
import './InvoiceDetail.css';

/**
 * Invoice detail view showing full invoice information.
 * @param {{
 *   invoiceId: string,
 *   onGoBack: () => void,
 *   onEdit: (id: string) => void,
 *   onDelete: (id: string) => void
 * }} props
 */
export default function InvoiceDetail({ invoiceId, onGoBack, onEdit, onDelete }) {
  const { invoices, markAsPaid } = useInvoices();
  const invoice = invoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return (
      <div className="invoice-detail">
        <button className="invoice-detail__back" onClick={onGoBack}>
          <img src={arrowLeft} alt="" aria-hidden="true" />
          Go back
        </button>
        <p>Invoice not found.</p>
      </div>
    );
  }

  const handleMarkAsPaid = () => {
    markAsPaid(invoice.id);
  };

  const actionButtons = (
    <>
      {invoice.status !== 'paid' && (
        <Button variant="edit" onClick={() => onEdit(invoice.id)}>
          Edit
        </Button>
      )}
      <Button variant="danger" onClick={() => onDelete(invoice.id)}>
        Delete
      </Button>
      {invoice.status === 'pending' && (
        <Button variant="primary" onClick={handleMarkAsPaid}>
          Mark as Paid
        </Button>
      )}
    </>
  );

  return (
    <div className="invoice-detail">
      <button className="invoice-detail__back" onClick={onGoBack}>
        <img src={arrowLeft} alt="" aria-hidden="true" />
        Go back
      </button>

      {/* Status Bar */}
      <div className="invoice-detail__status-bar">
        <div className="invoice-detail__status-left">
          <span className="invoice-detail__status-label">Status</span>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="invoice-detail__actions">
          {actionButtons}
        </div>
      </div>

      {/* Main Card */}
      <div className="invoice-detail__card">
        {/* Header */}
        <div className="invoice-detail__header">
          <div>
            <div className="invoice-detail__id">
              <span className="invoice-detail__id-hash">#</span>
              {invoice.id}
            </div>
            <div className="invoice-detail__description">{invoice.description}</div>
          </div>
          <div className="invoice-detail__sender-address">
            {invoice.senderAddress.street}<br />
            {invoice.senderAddress.city}<br />
            {invoice.senderAddress.postCode}<br />
            {invoice.senderAddress.country}
          </div>
        </div>

        {/* Info Grid */}
        <div className="invoice-detail__info">
          <div className="invoice-detail__info-dates">
            <div>
              <div className="invoice-detail__info-label">Invoice Date</div>
              <div className="invoice-detail__info-value">{formatDate(invoice.createdAt)}</div>
            </div>
            <div>
              <div className="invoice-detail__info-label">Payment Due</div>
              <div className="invoice-detail__info-value">{formatDate(invoice.paymentDue)}</div>
            </div>
          </div>

          <div>
            <div className="invoice-detail__info-label">Bill To</div>
            <div className="invoice-detail__info-value">{invoice.clientName}</div>
            <div className="invoice-detail__client-address">
              {invoice.clientAddress.street}<br />
              {invoice.clientAddress.city}<br />
              {invoice.clientAddress.postCode}<br />
              {invoice.clientAddress.country}
            </div>
          </div>

          <div className="invoice-detail__info-email">
            <div className="invoice-detail__info-label">Sent to</div>
            <div className="invoice-detail__info-value">{invoice.clientEmail}</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-detail__table">
          {/* Desktop table header */}
          <div className="invoice-detail__table-header">
            <span>Item Name</span>
            <span>QTY.</span>
            <span>Price</span>
            <span>Total</span>
          </div>

          {invoice.items.map((item, index) => (
            <div key={index} className="invoice-detail__table-row">
              <span className="invoice-detail__item-name">{item.name}</span>
              {/* Desktop: separate qty and price */}
              <span className="invoice-detail__item-qty">{item.quantity}</span>
              <span className="invoice-detail__item-price">{formatCurrency(item.price)}</span>
              {/* Mobile: combined "qty x £ price" */}
              <span className="invoice-detail__item-qty-price">
                {item.quantity} x {formatCurrency(item.price)}
              </span>
              <span className="invoice-detail__item-total">{formatCurrency(item.total)}</span>
            </div>
          ))}
        </div>

        {/* Amount Due / Grand Total */}
        <div className="invoice-detail__total">
          <span className="invoice-detail__total-label invoice-detail__total-label--desktop">Amount Due</span>
          <span className="invoice-detail__total-label invoice-detail__total-label--mobile">Grand Total</span>
          <span className="invoice-detail__total-amount">{formatCurrency(invoice.total)}</span>
        </div>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="invoice-detail__mobile-actions">
        {actionButtons}
      </div>
    </div>
  );
}
