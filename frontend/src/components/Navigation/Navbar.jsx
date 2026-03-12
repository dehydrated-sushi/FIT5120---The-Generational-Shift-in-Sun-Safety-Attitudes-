// components/Navigation/Navbar.jsx
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/',           icon: '🏠', label: 'Home'    },
  { to: '/uv-tracker', icon: '📍', label: 'UV Map'  },
  { to: '/prevention', icon: '👕', label: 'Outfit'  },
  { to: '/awareness',  icon: '📊', label: 'Stats'   },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `navbar__item ${isActive ? 'navbar__item--active' : ''}`
          }
        >
          <span className="navbar__icon">{item.icon}</span>
          <span className="navbar__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}