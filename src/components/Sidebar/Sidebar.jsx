import { useTheme } from '../../context/ThemeContext';
import logo from '../../assets/Logo.png';
import avatarImg from '../../assets/Oval.png';
import moonIcon from '../../assets/path.svg';
import sunIcon from '../../assets/sun.svg';
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
            src={avatarImg}
            alt="User avatar"
          />
        </div>
      </div>
    </aside>
  );
}
