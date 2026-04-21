/**
 * Generate a random 6-character invoice ID (2 uppercase + 4 digits).
 * Example: "RT3080", "XM9141"
 */
export function generateId() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const l1 = letters[Math.floor(Math.random() * letters.length)];
  const l2 = letters[Math.floor(Math.random() * letters.length)];
  const nums = Math.floor(1000 + Math.random() * 9000);
  return `${l1}${l2}${nums}`;
}

/**
 * Format a date string to "DD Mon YYYY" format.
 * Example: "2021-08-19" → "19 Aug 2021"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Format a number as GBP currency.
 * Example: 1800.9 → "£ 1,800.90"
 */
export function formatCurrency(amount) {
  const formatted = Number(amount).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `£ ${formatted}`;
}

/**
 * Calculate payment due date from invoice date + payment terms (days).
 * @param {string} invoiceDate - ISO date string
 * @param {number} paymentTerms - Number of days (e.g. 30)
 * @returns {string} ISO date string for due date
 */
export function calculateDueDate(invoiceDate, paymentTerms) {
  const date = new Date(invoiceDate);
  date.setDate(date.getDate() + paymentTerms);
  return date.toISOString().split('T')[0];
}

/**
 * Get payment terms label.
 * @param {number} days
 * @returns {string} - e.g. "Net 30 Days"
 */
export function getPaymentTermsLabel(days) {
  const labels = {
    1: 'Net 1 Day',
    7: 'Net 7 Days',
    14: 'Net 14 Days',
    30: 'Net 30 Days',
  };
  return labels[days] || `Net ${days} Days`;
}

/** Payment terms options for the select dropdown. */
export const PAYMENT_TERMS_OPTIONS = [
  { value: 1, label: 'Net 1 Day' },
  { value: 7, label: 'Net 7 Days' },
  { value: 14, label: 'Net 14 Days' },
  { value: 30, label: 'Net 30 Days' },
];
