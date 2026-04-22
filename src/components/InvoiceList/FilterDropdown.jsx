import { useState, useRef, useEffect } from 'react';
import arrowDown from '../../assets/icon-arrow-down.svg';
import checkIcon from '../../assets/icon-check.svg';
import './FilterDropdown.css';

const STATUS_OPTIONS = ['draft', 'pending', 'paid'];

export default function FilterDropdown({ filters, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen]);

  const toggleFilter = (status) => {
    if (filters.includes(status)) {
      onFilterChange(filters.filter((f) => f !== status));
    } else {
      onFilterChange([...filters, status]);
    }
  };

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button
        className="filter-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        id="filter-dropdown-trigger"
      >
        <span className="filter-dropdown__trigger-text--full">Filter by status</span>
        <span className="filter-dropdown__trigger-text--short">Filter</span>
        <img
          className={`filter-dropdown__arrow ${isOpen ? 'filter-dropdown__arrow--open' : ''}`}
          src={arrowDown}
          alt=""
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="filter-dropdown__menu" role="listbox" aria-labelledby="filter-dropdown-trigger">
          {STATUS_OPTIONS.map((status) => {
            const isChecked = filters.includes(status);
            return (
              <div
                key={status}
                className="filter-dropdown__option"
                role="option"
                aria-selected={isChecked}
                onClick={() => toggleFilter(status)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFilter(status);
                  }
                }}
              >
                <span className={`filter-dropdown__checkbox ${isChecked ? 'filter-dropdown__checkbox--checked' : ''}`}>
                  {isChecked && <img src={checkIcon} alt="" aria-hidden="true" />}
                </span>
                <span className="filter-dropdown__label">{status}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
