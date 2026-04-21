import { formatCurrency } from '../../utils/helpers';
import deleteIcon from '../../assets/icon-delete.svg';
import './ItemRow.css';

/**
 * Single item row within the invoice form.
 * @param {{
 *   item: { name: string, quantity: string|number, price: string|number, total: number },
 *   index: number,
 *   onChange: (index: number, field: string, value: string) => void,
 *   onDelete: (index: number) => void,
 *   errors?: { name?: string, quantity?: string, price?: string }
 * }} props
 */
export default function ItemRow({ item, index, onChange, onDelete, errors = {} }) {
  const total = (Number(item.quantity) || 0) * (Number(item.price) || 0);

  return (
    <div className="item-row">
      {/* Item Name */}
      <div>
        <span className="item-row__mobile-label">Item Name</span>
        <input
          type="text"
          className={`item-row__input ${errors.name ? 'item-row__input--error' : ''}`}
          value={item.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          placeholder="Item name"
          aria-label={`Item ${index + 1} name`}
        />
      </div>

      {/* Qty, Price, Total, Delete - grouped for mobile */}
      <div className="item-row__bottom">
        <div>
          <span className="item-row__mobile-label">Qty.</span>
          <input
            type="number"
            className={`item-row__input ${errors.quantity ? 'item-row__input--error' : ''}`}
            value={item.quantity}
            onChange={(e) => onChange(index, 'quantity', e.target.value)}
            min="1"
            placeholder="0"
            aria-label={`Item ${index + 1} quantity`}
          />
        </div>

        <div>
          <span className="item-row__mobile-label">Price</span>
          <input
            type="number"
            className={`item-row__input ${errors.price ? 'item-row__input--error' : ''}`}
            value={item.price}
            onChange={(e) => onChange(index, 'price', e.target.value)}
            min="0"
            step="0.01"
            placeholder="0.00"
            aria-label={`Item ${index + 1} price`}
          />
        </div>

        <div>
          <span className="item-row__mobile-label">Total</span>
          <span className="item-row__total">{total.toFixed(2)}</span>
        </div>

        <button
          type="button"
          className="item-row__delete"
          onClick={() => onDelete(index)}
          aria-label={`Delete item ${index + 1}`}
        >
          <img src={deleteIcon} alt="" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
