import { useState, useRef, useEffect, useMemo } from 'react';
import { formatDate } from '../../utils/helpers';
import calendarIcon from '../../assets/icon-calendar.svg';
import arrowLeft from '../../assets/icon-arrow-left.svg';
import arrowRight from '../../assets/icon-arrow-right.svg';
import './CustomDatePicker.css';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Custom calendar date picker matching the design system.
 * @param {{ value: string, onChange: (dateStr: string) => void, hasError?: boolean }} props
 */
export default function CustomDatePicker({ value, onChange, hasError = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Parse the current value to determine viewed month
  const selectedDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value + 'T00:00:00');
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

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

  // Navigate months
  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startDow = firstDay.getDay(); // 0=Sun
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    // Previous month filler
    for (let i = startDow - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: viewMonth - 1,
        year: viewMonth === 0 ? viewYear - 1 : viewYear,
        outside: true,
      });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, month: viewMonth, year: viewYear, outside: false });
    }

    // Next month filler (fill to 6 rows × 7 = 42)
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        day: d,
        month: viewMonth + 1,
        year: viewMonth === 11 ? viewYear + 1 : viewYear,
        outside: true,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handleSelectDay = (dayObj) => {
    const y = dayObj.year;
    const m = String(dayObj.month + 1).padStart(2, '0');
    const d = String(dayObj.day).padStart(2, '0');
    // Handle month rollover for outside days
    let finalMonth = dayObj.month;
    let finalYear = dayObj.year;
    if (finalMonth < 0) { finalMonth = 11; finalYear -= 1; }
    if (finalMonth > 11) { finalMonth = 0; finalYear += 1; }
    const dateStr = `${finalYear}-${String(finalMonth + 1).padStart(2, '0')}-${String(dayObj.day).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const isSelected = (dayObj) => {
    if (!value) return false;
    const sel = new Date(value + 'T00:00:00');
    let m = dayObj.month;
    let y = dayObj.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    return sel.getFullYear() === y && sel.getMonth() === m && sel.getDate() === dayObj.day;
  };

  const today = new Date();
  const isToday = (dayObj) => {
    let m = dayObj.month;
    let y = dayObj.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    return today.getFullYear() === y && today.getMonth() === m && today.getDate() === dayObj.day && !dayObj.outside;
  };

  return (
    <div className="custom-datepicker" ref={ref}>
      <button
        type="button"
        className={`custom-datepicker__trigger ${isOpen ? 'custom-datepicker__trigger--open' : ''} ${hasError ? 'custom-datepicker__trigger--error' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select date"
      >
        <span>{value ? formatDate(value) : 'Select date'}</span>
        <img src={calendarIcon} alt="" aria-hidden="true" className="custom-datepicker__trigger-icon" />
      </button>

      {isOpen && (
        <div className="custom-datepicker__calendar">
          {/* Month navigation */}
          <div className="custom-datepicker__nav">
            <button type="button" className="custom-datepicker__nav-btn" onClick={goToPrevMonth} aria-label="Previous month">
              <img src={arrowLeft} alt="" />
            </button>
            <span className="custom-datepicker__month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
            <button type="button" className="custom-datepicker__nav-btn" onClick={goToNextMonth} aria-label="Next month">
              <img src={arrowRight} alt="" />
            </button>
          </div>

          {/* Day grid */}
          <div className="custom-datepicker__grid">
            {calendarDays.map((dayObj, idx) => (
              <button
                type="button"
                key={idx}
                className={`custom-datepicker__day ${dayObj.outside ? 'custom-datepicker__day--outside' : ''} ${isSelected(dayObj) ? 'custom-datepicker__day--selected' : ''} ${isToday(dayObj) ? 'custom-datepicker__day--today' : ''}`}
                onClick={() => handleSelectDay(dayObj)}
              >
                {dayObj.day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
