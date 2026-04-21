import { useState, useRef, useEffect } from 'react';
import arrowDown from '../../assets/icon-arrow-down.svg';
import './CustomSelect.css';

/**
 * Custom select dropdown matching the design system.
 * @param {{
 *   value: number|string,
 *   options: Array<{ value: number|string, label: string }>,
 *   onChange: (value: number|string) => void
 * }} props
 */
export default function CustomSelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : 'Select...';

  const handleSelect = (optValue) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select" ref={ref}>
      <button
        type="button"
        className={`custom-select__trigger ${isOpen ? 'custom-select__trigger--open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{displayLabel}</span>
        <img
          className={`custom-select__arrow ${isOpen ? 'custom-select__arrow--open' : ''}`}
          src={arrowDown}
          alt=""
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="custom-select__menu" role="listbox">
          {options.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`custom-select__option ${opt.value === value ? 'custom-select__option--selected' : ''}`}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
