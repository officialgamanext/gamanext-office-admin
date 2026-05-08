import React from 'react';
import { 
  BarChart3, 
  Wallet, 
  TrendingUp, 
  Users2, 
  UserPlus, 
  Calendar,
  ChevronDown,
  Monitor,
  Smartphone,
  Zap,
  Target,
  Gift
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StatCard from './components/StatCard';
import './CSS/Dashboard.css';
import './CSS/Tables.css';

const lineData = [
  { name: 'May 12', revenue: 30000, profit: 20000 },
  { name: 'May 19', revenue: 55000, profit: 35000 },
  { name: 'May 26', revenue: 45000, profit: 40000 },
  { name: 'Jun 2', revenue: 70000, profit: 45000 },
  { name: 'Jun 9', revenue: 85430, profit: 52120 },
  { name: 'Jun 12', revenue: 80000, profit: 50000 },
];

const pieData = [
  { name: 'Completed', value: 35, color: '#4f46e5' },
  { name: 'In Progress', value: 40, color: '#10b981' },
  { name: 'On Hold', value: 15, color: '#f59e0b' },
  { name: 'Pending', value: 10, color: '#ef4444' },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div className="dashboard-header">
          <div className="welcome-msg">
            <h2>Welcome back, Admin! 👋</h2>
            <p>Here's what's happening with your company today.</p>
          </div>
          <div className="date-picker">
            <Calendar size={16} />
            <span>May 12 - Jun 12, 2024</span>
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="stats-grid">
          <StatCard 
            label="Total Revenue" 
            value="$124,560" 
            trend="12.5%" 
            trendType="up"
            icon={<BarChart3 size={20} />}
            iconBg="#eef2ff"
            iconColor="#4f46e5"
          />
          <StatCard 
            label="Total Expenses" 
            value="$48,240" 
            trend="7.3%" 
            trendType="up"
            icon={<Wallet size={20} />}
            iconBg="#fff7ed"
            iconColor="#f97316"
          />
          <StatCard 
            label="Total Profit" 
            value="$76,320" 
            trend="18.8%" 
            trendType="up"
            icon={<TrendingUp size={20} />}
            iconBg="#f0fdf4"
            iconColor="#10b981"
          />
          <StatCard 
            label="Total Customers" 
            value="1,245" 
            trend="8.6%" 
            trendType="up"
            icon={<Users2 size={20} />}
            iconBg="#f5f3ff"
            iconColor="#8b5cf6"
          />
          <StatCard 
            label="Total Employees" 
            value="58" 
            trend="3.4%" 
            trendType="up"
            icon={<UserPlus size={20} />}
            iconBg="#fffbeb"
            iconColor="#f59e0b"
          />
        </div>

        <div className="charts-grid">
          <div className="card">
            <div className="card-title">
              <span>Revenue Overview</span>
              <div className="date-picker" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                <span>This Month</span>
                <ChevronDown size={12} />
              </div>
            </div>
            <div style={{ height: '250px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <span>Projects Status</span>
              <div className="date-picker" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                <span>All Projects</span>
                <ChevronDown size={12} />
              </div>
            </div>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Total</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>34</p>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
               {pieData.map((item, i) => (
                 <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color }}></div>
                     <span style={{ color: '#64748b' }}>{item.name}</span>
                   </div>
                   <span style={{ fontWeight: 600 }}>{item.value}%</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <span>Tasks Overview</span>
              <div className="date-picker" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                <span>This Week</span>
                <ChevronDown size={12} />
              </div>
            </div>
            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="120" height="120" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#4f46e5" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="70.3" strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>72%</p>
                <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Completed</p>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                 <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Tasks</span>
                 <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>128</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                 <span style={{ fontSize: '0.8rem', color: '#10b981' }}>Completed</span>
                 <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>92</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                 <span style={{ fontSize: '0.8rem', color: '#3b82f6' }}>In Progress</span>
                 <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>24</span>
               </div>
               <a href="#" className="view-all" style={{ marginTop: '0.5rem', display: 'block' }}>View all tasks &gt;</a>
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="card">
            <div className="card-title">
              <span>Recent Projects</span>
              <a href="#" className="view-all">View all</a>
            </div>
            <div className="list-container">
              {[
                { name: 'Website Redesign', sub: 'Acme Corp', status: 'In Progress', progress: 75, icon: <Monitor size={16} />, color: '#eff6ff', iconColor: '#3b82f6' },
                { name: 'Mobile App Development', sub: 'Globex Ltd.', status: 'In Progress', progress: 60, icon: <Smartphone size={16} />, color: '#ecfdf5', iconColor: '#10b981' },
                { name: 'CRM Integration', sub: 'Zenith Solutions', status: 'On Hold', progress: 30, icon: <Zap size={16} />, color: '#fff7ed', iconColor: '#f97316' },
                { name: 'Marketing Campaign', sub: 'Bright Ideas Co.', status: 'Pending', progress: 10, icon: <Target size={16} />, color: '#f5f3ff', iconColor: '#8b5cf6' },
              ].map((proj, i) => (
                <div key={i} className="list-item">
                  <div className="item-main">
                    <div className="item-icon-bg" style={{ background: proj.color, color: proj.iconColor }}>
                      {proj.icon}
                    </div>
                    <div className="item-info">
                      <span className="item-name">{proj.name}</span>
                      <span className="item-sub">{proj.sub}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`item-status status-${proj.status.toLowerCase().replace(' ', '-')}`}>{proj.status}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <div className="progress-bar-container"><div className="progress-bar" style={{ width: `${proj.progress}%`, background: proj.iconColor }}></div></div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{proj.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a href="#" className="view-all" style={{ marginTop: '1rem', display: 'block' }}>View all projects &gt;</a>
          </div>

          <div className="card">
            <div className="card-title">
              <span>Timesheet Summary</span>
              <div className="date-picker" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                <span>This Week</span>
                <ChevronDown size={12} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
               <div>
                 <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Total Hours</p>
                 <p style={{ fontSize: '1rem', fontWeight: 700 }}>245h 30m</p>
               </div>
               <div>
                 <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Utilization</p>
                 <p style={{ fontSize: '1rem', fontWeight: 700 }}>73%</p>
               </div>
            </div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Entries <a href="#" className="view-all" style={{ float: 'right' }}>View all</a></p>
            {[
              { name: 'John Doe', sub: 'Website Redesign', time: '8h 00m', date: 'May 12' },
              { name: 'Sarah Smith', sub: 'Mobile App', time: '7h 30m', date: 'May 12' },
              { name: 'Michael Brown', sub: 'CRM Integration', time: '6h 45m', date: 'May 12' },
            ].map((entry, i) => (
              <div key={i} className="list-item">
                <div className="item-main">
                  <div className="user-avatar" style={{ width: 24, height: 24, fontSize: '0.7rem' }}>{entry.name[0]}</div>
                  <div className="item-info">
                    <span className="item-name" style={{ fontSize: '0.75rem' }}>{entry.name}</span>
                    <span className="item-sub" style={{ fontSize: '0.65rem' }}>{entry.sub}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, margin: 0 }}>{entry.time}</p>
                  <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>{entry.date}</p>
                </div>
              </div>
            ))}
            <a href="#" className="view-all" style={{ marginTop: '1rem', display: 'block' }}>View timesheet &gt;</a>
          </div>

          <div className="card">
            <div className="card-title">
              <span>Leave Requests</span>
              <a href="#" className="view-all">View all</a>
            </div>
            {[
              { name: 'Emma Johnson', type: 'Annual Leave', date: 'May 20 - May 24, 2024', status: 'Approved' },
              { name: 'David Wilson', type: 'Sick Leave', date: 'May 15 - May 16, 2024', status: 'Pending' },
              { name: 'Olivia Martinez', type: 'Casual Leave', date: 'May 18, 2024', status: 'Rejected' },
              { name: 'James Anderson', type: 'Annual Leave', date: 'May 25 - May 30, 2024', status: 'Pending' },
            ].map((req, i) => (
              <div key={i} className="list-item">
                <div className="item-main">
                  <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{req.name[0]}</div>
                  <div className="item-info">
                    <span className="item-name">{req.name}</span>
                    <span className="item-sub">{req.type}</span>
                    <span className="item-sub" style={{ fontSize: '0.65rem' }}>{req.date}</span>
                  </div>
                </div>
                <span className={`item-status status-${req.status.toLowerCase()}`}>{req.status}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">
              <span>Upcoming Birthdays</span>
            </div>
            {[
              { name: 'Sarah Smith', date: 'May 16' },
              { name: 'Michael Brown', date: 'May 18' },
              { name: 'Emma Johnson', date: 'May 22' },
              { name: 'Robert Davis', date: 'May 28' },
            ].map((b, i) => (
              <div key={i} className="list-item">
                <div className="item-main">
                  <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>{b.name[0]}</div>
                  <div className="item-info">
                    <span className="item-name">{b.name}</span>
                    <span className="item-sub">{b.date}</span>
                  </div>
                </div>
              </div>
            ))}
            <button className="birthday-btn">
              <Gift size={16} />
              <span>View all birthdays</span>
              <ChevronDown size={14} style={{ marginLeft: 'auto', transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.75rem' }}>
           <span>© 2024 Gamanext. All rights reserved.</span>
           <span>Version 1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
