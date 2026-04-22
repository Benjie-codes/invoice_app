import plusIcon from '../../assets/icon-plus.svg';
import './Button.css';

export default function Button({
  variant = 'primary',
  children,
  withIcon = false,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`btn btn--${variant} ${withIcon ? 'btn--with-icon' : ''} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...rest}
    >
      {withIcon && (
        <span className="btn__icon-circle">
          <img src={plusIcon} alt="" aria-hidden="true" />
        </span>
      )}
      {children}
    </button>
  );
}
