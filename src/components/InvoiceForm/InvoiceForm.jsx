import { useState, useEffect, useCallback } from 'react';
import { useInvoices } from '../../context/InvoiceContext';
import { validateInvoice } from '../../utils/validation';
import { PAYMENT_TERMS_OPTIONS } from '../../utils/helpers';
import ItemRow from './ItemRow';
import Button from '../UI/Button';
import './InvoiceForm.css';

const emptyItem = { name: '', quantity: '', price: '', total: 0 };

const emptyForm = {
  senderAddress: { street: '', city: '', postCode: '', country: '' },
  clientName: '',
  clientEmail: '',
  clientAddress: { street: '', city: '', postCode: '', country: '' },
  createdAt: new Date().toISOString().split('T')[0],
  paymentTerms: 30,
  description: '',
  items: [{ ...emptyItem }],
};

/**
 * Sliding form panel for creating/editing invoices.
 * @param {{
 *   mode: 'create' | 'edit',
 *   invoiceId?: string,
 *   onClose: () => void
 * }} props
 */
export default function InvoiceForm({ mode, invoiceId, onClose }) {
  const { invoices, addInvoice, updateInvoice } = useInvoices();
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Load existing invoice for edit mode
  useEffect(() => {
    if (mode === 'edit' && invoiceId) {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (invoice) {
        setFormData({
          senderAddress: { ...invoice.senderAddress },
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          clientAddress: { ...invoice.clientAddress },
          createdAt: invoice.createdAt,
          paymentTerms: invoice.paymentTerms,
          description: invoice.description,
          items: invoice.items.map((item) => ({
            name: item.name,
            quantity: item.quantity.toString(),
            price: item.price.toString(),
            total: item.total,
          })),
          status: invoice.status,
        });
      }
    }
  }, [mode, invoiceId, invoices]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // --- Field change handlers ---
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const updateAddress = useCallback((type, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
    // Clear specific address error
    const errorKey = type === 'senderAddress'
      ? `sender${field.charAt(0).toUpperCase() + field.slice(1)}`
      : `client${field.charAt(0).toUpperCase() + field.slice(1)}`;
    setErrors((prev) => {
      const next = { ...prev };
      delete next[errorKey];
      return next;
    });
  }, []);

  const updateItem = useCallback((index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const addItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...emptyItem }],
    }));
  }, []);

  const deleteItem = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  // --- Submit handlers ---
  const handleSaveAndSend = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateInvoice(formData, false);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    if (mode === 'create') {
      addInvoice({ ...formData, status: 'pending' });
    } else {
      updateInvoice(invoiceId, { ...formData, status: 'pending' });
    }
    onClose();
  };

  const handleSaveDraft = () => {
    addInvoice({ ...formData, status: 'draft' });
    onClose();
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateInvoice(formData, false);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    updateInvoice(invoiceId, formData);
    onClose();
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      {/* Overlay */}
      <div className="invoice-form-overlay" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        className="invoice-form-panel"
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'create' ? 'New Invoice' : `Edit Invoice ${invoiceId}`}
      >
        <h2 className="invoice-form-panel__title">
          {mode === 'create' ? (
            'New Invoice'
          ) : (
            <>Edit <span className="invoice-form-panel__title-hash">#</span>{invoiceId}</>
          )}
        </h2>

        <form onSubmit={mode === 'edit' ? handleSaveChanges : handleSaveAndSend} noValidate>
          {/* === Bill From === */}
          <p className="invoice-form__section-title">Bill From</p>

          <div className="invoice-form__group">
            <div className="invoice-form__label-row">
              <label className={`invoice-form__label ${errors.senderStreet ? 'invoice-form__label--error' : ''}`}>
                Street Address
              </label>
              {errors.senderStreet && <span className="invoice-form__error-text">{errors.senderStreet}</span>}
            </div>
            <input
              type="text"
              className={`invoice-form__input ${errors.senderStreet ? 'invoice-form__input--error' : ''}`}
              value={formData.senderAddress.street}
              onChange={(e) => updateAddress('senderAddress', 'street', e.target.value)}
            />
          </div>

          <div className="invoice-form__row invoice-form__row--3">
            <div className="invoice-form__group">
              <div className="invoice-form__label-row">
                <label className={`invoice-form__label ${errors.senderCity ? 'invoice-form__label--error' : ''}`}>City</label>
                {errors.senderCity && <span className="invoice-form__error-text">{errors.senderCity}</span>}
              </div>
              <input
                type="text"
                className={`invoice-form__input ${errors.senderCity ? 'invoice-form__input--error' : ''}`}
                value={formData.senderAddress.city}
                onChange={(e) => updateAddress('senderAddress', 'city', e.target.value)}
              />
            </div>
            <div className="invoice-form__group">
              <div className="invoice-form__label-row">
                <label className={`invoice-form__label ${errors.senderPostCode ? 'invoice-form__label--error' : ''}`}>Post Code</label>
                {errors.senderPostCode && <span className="invoice-form__error-text">{errors.senderPostCode}</span>}
              </div>
              <input
                type="text"
                className={`invoice-form__input ${errors.senderPostCode ? 'invoice-form__input--error' : ''}`}
                value={formData.senderAddress.postCode}
                onChange={(e) => updateAddress('senderAddress', 'postCode', e.target.value)}
              />
            </div>
            <div className="invoice-form__group">
              <div className="invoice-form__label-row">
                <label className={`invoice-form__label ${errors.senderCountry ? 'invoice-form__label--error' : ''}`}>Country</label>
                {errors.senderCountry && <span className="invoice-form__error-text">{errors.senderCountry}</span>}
              </div>
              <input
                type="text"
                className={`invoice-form__input ${errors.senderCountry ? 'invoice-form__input--error' : ''}`}
                value={formData.senderAddress.country}
                onChange={(e) => updateAddress('senderAddress', 'country', e.target.value)}
              />
            </div>
          </div>

          {/* === Bill To === */}
          <p className="invoice-form__section-title">Bill To</p>

          <div className="invoice-form__group">
            <div className="invoice-form__label-row">
              <label className={`invoice-form__label ${errors.clientName ? 'invoice-form__label--error' : ''}`}>Client&apos;s Name</label>
              {errors.clientName && <span className="invoice-form__error-text">{errors.clientName}</span>}
            </div>
            <input
              type="text"
              className={`invoice-form__input ${errors.clientName ? 'invoice-form__input--error' : ''}`}
              value={formData.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
            />
          </div>

          <div className="invoice-form__group">
            <div className="invoice-form__label-row">
              <label className={`invoice-form__label ${errors.clientEmail ? 'invoice-form__label--error' : ''}`}>Client&apos;s Email</label>
              {errors.clientEmail && <span className="invoice-form__error-text">{errors.clientEmail}</span>}
            </div>
            <input
              type="email"
              className={`invoice-form__input ${errors.clientEmail ? 'invoice-form__input--error' : ''}`}
              value={formData.clientEmail}
              onChange={(e) => updateField('clientEmail', e.target.value)}
              placeholder="e.g. email@example.com"
            />
          </div>

          <div className="invoice-form__group">
            <div className="invoice-form__label-row">
              <label className={`invoice-form__label ${errors.clientStreet ? 'invoice-form__label--error' : ''}`}>Street Address</label>
              {errors.clientStreet && <span className="invoice-form__error-text">{errors.clientStreet}</span>}
            </div>
            <input
              type="text"
              className={`invoice-form__input ${errors.clientStreet ? 'invoice-form__input--error' : ''}`}
              value={formData.clientAddress.street}
              onChange={(e) => updateAddress('clientAddress', 'street', e.target.value)}
            />
          </div>

          <div className="invoice-form__row invoice-form__row--3">
            <div className="invoice-form__group">
              <div className="invoice-form__label-row">
                <label className={`invoice-form__label ${errors.clientCity ? 'invoice-form__label--error' : ''}`}>City</label>
                {errors.clientCity && <span className="invoice-form__error-text">{errors.clientCity}</span>}
              </div>
              <input
                type="text"
                className={`invoice-form__input ${errors.clientCity ? 'invoice-form__input--error' : ''}`}
                value={formData.clientAddress.city}
                onChange={(e) => updateAddress('clientAddress', 'city', e.target.value)}
              />
            </div>
            <div className="invoice-form__group">
              <div className="invoice-form__label-row">
                <label className={`invoice-form__label ${errors.clientPostCode ? 'invoice-form__label--error' : ''}`}>Post Code</label>
                {errors.clientPostCode && <span className="invoice-form__error-text">{errors.clientPostCode}</span>}
              </div>
              <input
                type="text"
                className={`invoice-form__input ${errors.clientPostCode ? 'invoice-form__input--error' : ''}`}
                value={formData.clientAddress.postCode}
                onChange={(e) => updateAddress('clientAddress', 'postCode', e.target.value)}
              />
            </div>
            <div className="invoice-form__group">
              <div className="invoice-form__label-row">
                <label className={`invoice-form__label ${errors.clientCountry ? 'invoice-form__label--error' : ''}`}>Country</label>
                {errors.clientCountry && <span className="invoice-form__error-text">{errors.clientCountry}</span>}
              </div>
              <input
                type="text"
                className={`invoice-form__input ${errors.clientCountry ? 'invoice-form__input--error' : ''}`}
                value={formData.clientAddress.country}
                onChange={(e) => updateAddress('clientAddress', 'country', e.target.value)}
              />
            </div>
          </div>

          {/* === Invoice Details === */}
          <div className="invoice-form__row invoice-form__row--2">
            <div className="invoice-form__group">
              <div className="invoice-form__label-row">
                <label className={`invoice-form__label ${errors.createdAt ? 'invoice-form__label--error' : ''}`}>Invoice Date</label>
                {errors.createdAt && <span className="invoice-form__error-text">{errors.createdAt}</span>}
              </div>
              <input
                type="date"
                className={`invoice-form__input ${errors.createdAt ? 'invoice-form__input--error' : ''}`}
                value={formData.createdAt}
                onChange={(e) => updateField('createdAt', e.target.value)}
              />
            </div>
            <div className="invoice-form__group">
              <label className="invoice-form__label">Payment Terms</label>
              <select
                className="invoice-form__select"
                value={formData.paymentTerms}
                onChange={(e) => updateField('paymentTerms', Number(e.target.value))}
              >
                {PAYMENT_TERMS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="invoice-form__group">
            <div className="invoice-form__label-row">
              <label className={`invoice-form__label ${errors.description ? 'invoice-form__label--error' : ''}`}>Project Description</label>
              {errors.description && <span className="invoice-form__error-text">{errors.description}</span>}
            </div>
            <input
              type="text"
              className={`invoice-form__input ${errors.description ? 'invoice-form__input--error' : ''}`}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="e.g. Graphic Design Service"
            />
          </div>

          {/* === Item List === */}
          <h3 className="invoice-form__items-title">Item List</h3>

          <div className="invoice-form__items-header">
            <span>Item Name</span>
            <span>Qty.</span>
            <span>Price</span>
            <span>Total</span>
            <span></span>
          </div>

          <div className="invoice-form__items-list">
            {formData.items.map((item, index) => (
              <ItemRow
                key={index}
                item={item}
                index={index}
                onChange={updateItem}
                onDelete={deleteItem}
                errors={errors.itemErrors?.[index] || {}}
              />
            ))}
          </div>

          <button
            type="button"
            className="invoice-form__add-item"
            onClick={addItem}
          >
            + Add New Item
          </button>

          {/* Error summary */}
          {hasErrors && (
            <div className="invoice-form__errors">
              <p className="invoice-form__error-msg">- All fields must be added</p>
              {errors.items && <p className="invoice-form__error-msg">- An item must be added</p>}
            </div>
          )}

          {/* Footer */}
          {mode === 'create' ? (
            <div className="invoice-form__footer invoice-form__footer--create">
              <Button variant="secondary" onClick={onClose}>
                Discard
              </Button>
              <div className="invoice-form__footer-right">
                <Button variant="dark" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                <Button variant="primary" type="submit">
                  Save &amp; Send
                </Button>
              </div>
            </div>
          ) : (
            <div className="invoice-form__footer invoice-form__footer--edit">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}
