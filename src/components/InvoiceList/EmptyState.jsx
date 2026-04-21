import './EmptyState.css';

export default function EmptyState() {
  return (
    <div className="empty-state">
      <svg className="empty-state__illustration" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Envelope body */}
        <path d="M48 100L4 140V190C4 195.523 8.477 200 14 200H228C233.523 200 238 195.523 238 190V140L194 100H48Z" fill="#F8F8FB" stroke="#BCC1E2" strokeWidth="1.5"/>
        {/* Envelope flap */}
        <path d="M4 140L121 80L238 140" stroke="#BCC1E2" strokeWidth="1.5" fill="none"/>
        {/* Paper */}
        <rect x="60" y="20" width="122" height="130" rx="4" fill="white" stroke="#BCC1E2" strokeWidth="1.5"/>
        {/* Paper lines */}
        <line x1="80" y1="50" x2="162" y2="50" stroke="#DFE3FA" strokeWidth="3" strokeLinecap="round"/>
        <line x1="80" y1="68" x2="142" y2="68" stroke="#DFE3FA" strokeWidth="3" strokeLinecap="round"/>
        <line x1="80" y1="86" x2="152" y2="86" stroke="#DFE3FA" strokeWidth="3" strokeLinecap="round"/>
        <line x1="80" y1="104" x2="132" y2="104" stroke="#DFE3FA" strokeWidth="3" strokeLinecap="round"/>
        {/* Person */}
        <circle cx="130" cy="40" r="14" fill="#7C5DFA"/>
        <path d="M110 85C110 73.954 118.954 65 130 65C141.046 65 150 73.954 150 85V100H110V85Z" fill="#7C5DFA" opacity="0.6"/>
        {/* Megaphone */}
        <path d="M158 35L180 20V55L158 40" fill="#7C5DFA" opacity="0.4"/>
        {/* Small envelope flying */}
        <g transform="translate(90, 38) scale(0.3)">
          <path d="M0 10L30 0L60 10V40L30 30L0 40Z" fill="#DFE3FA" stroke="#BCC1E2"/>
        </g>
        {/* Paper airplane */}
        <g transform="translate(150, 140) rotate(-15)">
          <path d="M0 8L24 0L8 8L24 16Z" fill="#DFE3FA" stroke="#BCC1E2" strokeWidth="0.5"/>
        </g>
        {/* Small floating elements */}
        <circle cx="70" cy="55" r="3" fill="#DFE3FA"/>
        <circle cx="180" cy="65" r="4" fill="#DFE3FA"/>
        <circle cx="100" cy="35" r="2" fill="#BCC1E2"/>
      </svg>

      <h2 className="empty-state__title">There is nothing here</h2>
      <p className="empty-state__text">
        Create an invoice by clicking the{' '}
        <strong>New Invoice</strong> button and get started
      </p>
    </div>
  );
}
