import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/logo.svg';
import moonIcon from '../../assets/icon-moon.svg';
import sunIcon from '../../assets/icon-sun.svg';
import './Sidebar.css';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar__logo">
        <img src={logo} alt="Invoice App Logo" />
      </div>

      <div className="sidebar__bottom">
        <button
          className="sidebar__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <img
            src={theme === 'light' ? moonIcon : sunIcon}
            alt={theme === 'light' ? 'Dark mode' : 'Light mode'}
          />
        </button>

        <div className="sidebar__divider" />

        <div className="sidebar__avatar">
          <img
            className="sidebar__avatar-img"
            src="https://ui-avatars.com/api/?name=BJ&background=7C5DFA&color=fff&size=80&rounded=true&bold=true"
            alt="User avatar"
          />
        </div>
      </div>
    </aside>
  );
}
