import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Briefcase,
  User,
  Loader2,
  ArrowRight,
  Download
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../CSS/Employees.css';
import '../CSS/Projects.css';

const API_URL = import.meta.env.VITE_API_URL;

const Timesheet = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/collection/timesheets`);
      // Sort by work date latest first
      const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTimesheets(sorted);
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      if (error.response?.status === 404) {
        setTimesheets([]);
      } else {
        toast.error('Failed to fetch timesheet records');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const filteredTimesheets = timesheets.filter(ts => {
    const matchesSearch = ts.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ts.employeeID?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!dateFilter.start && !dateFilter.end) return matchesSearch;
    
    const tsDate = new Date(ts.date);
    const start = dateFilter.start ? new Date(dateFilter.start) : null;
    const end = dateFilter.end ? new Date(dateFilter.end) : null;
    
    if (start && tsDate < start) return false;
    if (end && tsDate > end) return false;
    
    return matchesSearch;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div className="employees-page" style={{ padding: '2rem' }}>
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Company Timesheets</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Monitor and review work hours across all employees and projects.</p>
            </div>
            <button 
              className="action-btn" 
              style={{ background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}
              onClick={() => toast.success('Report generation started...')}
            >
              <Download size={18} />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="table-card" style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            {/* Filter Bar */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
               <div className="search-bar" style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input 
                    type="text" 
                    placeholder="Search by project or Employee ID..." 
                    style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    <Calendar size={18} />
                    <span>Range:</span>
                    <input 
                      type="date" 
                      style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.8rem' }}
                      value={dateFilter.start}
                      onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
                    />
                    <ArrowRight size={14} />
                    <input 
                      type="date" 
                      style={{ padding: '0.5rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.8rem' }}
                      value={dateFilter.end}
                      onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
                    />
                    {(dateFilter.start || dateFilter.end) && (
                      <button 
                        style={{ color: '#ef4444', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
                        onClick={() => setDateFilter({ start: '', end: '' })}
                      >
                        Clear
                      </button>
                    )}
                 </div>
               </div>
            </div>

            <table className="project-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Work Date</th>
                  <th>Project Name</th>
                  <th>Billable Hours</th>
                  <th>Submitted On</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                      <Loader2 size={32} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto' }} />
                    </td>
                  </tr>
                ) : filteredTimesheets.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      No timesheet records found.
                    </td>
                  </tr>
                ) : (
                  filteredTimesheets.map((ts) => (
                    <tr key={ts.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <User size={14} color="#64748b" />
                          <span style={{ fontWeight: 600 }}>{ts.employeeID}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {new Date(ts.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%' }}></div>
                          {ts.projectName}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                          {ts.hours} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Hrs</span>
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {new Date(ts.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="status-badge status-done" style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}>
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timesheet;
