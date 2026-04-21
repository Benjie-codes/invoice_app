import { useState, useMemo } from 'react';
import { useInvoices } from '../../context/InvoiceContext';
import InvoiceCard from './InvoiceCard';
import FilterDropdown from './FilterDropdown';
import EmptyState from './EmptyState';
import Button from '../UI/Button';
import './InvoiceList.css';

/**
 * Invoice list page component.
 * @param {{ onViewInvoice: (id: string) => void, onNewInvoice: () => void }} props
 */
export default function InvoiceList({ onViewInvoice, onNewInvoice }) {
  const { invoices } = useInvoices();
  const [filters, setFilters] = useState([]);

  const filteredInvoices = useMemo(() => {
    if (filters.length === 0) return invoices;
    return invoices.filter((inv) => filters.includes(inv.status));
  }, [invoices, filters]);

  const countText = useMemo(() => {
    const count = filteredInvoices.length;
    if (count === 0) return 'No invoices';
    if (count === 1) return 'There is 1 total invoice';
    return `There are ${count} total invoices`;
  }, [filteredInvoices]);

  return (
    <div className="invoice-list">
      <header className="invoice-list__header">
        <div className="invoice-list__title-group">
          <h1 className="invoice-list__title">Invoices</h1>
          <p className="invoice-list__count">{countText}</p>
        </div>

        <div className="invoice-list__actions">
          <FilterDropdown filters={filters} onFilterChange={setFilters} />
          <Button variant="primary" withIcon onClick={onNewInvoice}>
            New Invoice
          </Button>
        </div>
      </header>

      {filteredInvoices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="invoice-list__items">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onClick={() => onViewInvoice(invoice.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
