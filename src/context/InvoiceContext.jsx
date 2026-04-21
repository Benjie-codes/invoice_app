import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { sampleInvoices } from '../data/sampleData';
import { generateId, calculateDueDate } from '../utils/helpers';

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useLocalStorage('invoice-app-data', sampleInvoices);

  const addInvoice = useCallback((invoiceData) => {
    const id = generateId();
    const paymentDue = calculateDueDate(invoiceData.createdAt, invoiceData.paymentTerms);
    const total = invoiceData.items.reduce(
      (sum, item) => sum + (Number(item.quantity) * Number(item.price)),
      0
    );
    const items = invoiceData.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price),
      total: Number(item.quantity) * Number(item.price),
    }));

    const newInvoice = {
      ...invoiceData,
      id,
      paymentDue,
      items,
      total,
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  }, [setInvoices]);

  const updateInvoice = useCallback((id, invoiceData) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== id) return inv;

        const paymentDue = calculateDueDate(invoiceData.createdAt, invoiceData.paymentTerms);
        const items = invoiceData.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          price: Number(item.price),
          total: Number(item.quantity) * Number(item.price),
        }));
        const total = items.reduce((sum, item) => sum + item.total, 0);

        return {
          ...inv,
          ...invoiceData,
          paymentDue,
          items,
          total,
          status: invoiceData.status || 'pending',
        };
      })
    );
  }, [setInvoices]);

  const deleteInvoice = useCallback((id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  }, [setInvoices]);

  const markAsPaid = useCallback((id) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, status: 'paid' } : inv
      )
    );
  }, [setInvoices]);

  return (
    <InvoiceContext.Provider
      value={{ invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}
