import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserCircle,
  Clock,
  CalendarCheck,
  CheckSquare,
  FileText,
  Receipt,
  CreditCard,
  Folder,
  Calendar,
  Settings,
  Headphones,
  ChevronRight,
  LogOut
} from 'lucide-react';
import './../CSS/Sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo-h.png';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
    { name: 'Projects', icon: <Briefcase />, path: '/projects' },
    { name: 'Customers', icon: <Users />, path: '/customers' },
    { name: 'Employees', icon: <UserCircle />, path: '/employees' },
    { name: 'Timesheet', icon: <Clock />, path: '/timesheet' },
    { name: 'Leave Requests', icon: <CalendarCheck />, path: '/leave' },
    { name: 'Tasks', icon: <CheckSquare />, path: '/tasks' },
    { name: 'Reports', icon: <FileText />, path: '/reports' },
    { name: 'Invoices', icon: <Receipt />, path: '/invoices' },
    { name: 'Payments', icon: <CreditCard />, path: '/payments' },
    { name: 'Documents', icon: <Folder />, path: '/documents' },
    { name: 'Calendar', icon: <Calendar />, path: '/calendar' },
    { name: 'Holidays', icon: <Calendar />, path: '/holidays' },
    { name: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={Logo} alt="" style={{ width: '100%' }} />
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
        <div className="help-card">
          <div className="help-info">
            <div className="help-icon-bg">
              <Headphones size={18} />
            </div>
            <div>
              <p style={{ margin: 0 }}>Need Help?</p>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '0.75rem' }}>Contact Support</p>
            </div>
          </div>
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
