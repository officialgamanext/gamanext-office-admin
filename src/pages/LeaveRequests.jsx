import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  FileText
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../CSS/Employees.css';
import '../CSS/Projects.css';

const API_URL = import.meta.env.VITE_API_URL;

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Applied');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/collection/leaves`);
      // Sort by latest applied
      const sorted = response.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      setLeaves(sorted);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      if (error.response?.status === 404) {
        setLeaves([]);
      } else {
        toast.error('Failed to fetch leave requests');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusUpdate = async (leaveID, status) => {
    const loadToast = toast.loading(`Updating status to ${status}...`);
    try {
      await axios.put(`${API_URL}/collection/leaves/${leaveID}`, { status });
      toast.success(`Leave ${status} successfully`, { id: loadToast });
      fetchLeaves();
    } catch (error) {
      toast.error('Failed to update status', { id: loadToast });
    }
  };

  const filteredLeaves = leaves.filter(lv => {
    const matchesStatus = statusFilter === 'All' || lv.status === statusFilter;
    const matchesSearch = lv.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lv.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div className="employees-page" style={{ padding: '2rem' }}>
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Leave Requests</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Review and manage employee leave applications.</p>
            </div>
          </div>

          <div className="table-card" style={{ background: 'white', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            {/* Filter Bar */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
               <div className="search-bar" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input 
                    type="text" 
                    placeholder="Search by employee or reason..." 
                    style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Filter size={18} color="#64748b" />
                 <select 
                   style={{ padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', background: 'white', fontSize: '0.875rem', fontWeight: 600 }}
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                 >
                   <option value="Applied">Pending (Applied)</option>
                   <option value="Approved">Approved</option>
                   <option value="Rejected">Rejected</option>
                   <option value="All">All Requests</option>
                 </select>
               </div>
            </div>

            <table className="project-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                      <Loader2 size={32} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto' }} />
                    </td>
                  </tr>
                ) : filteredLeaves.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      No {statusFilter === 'All' ? '' : statusFilter.toLowerCase()} leave requests found.
                    </td>
                  </tr>
                ) : (
                  filteredLeaves.map((lv) => (
                    <tr key={lv.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 32, height: 32, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                            {lv.employeeName?.charAt(0)}
                          </div>
                          <span style={{ fontWeight: 600 }}>{lv.employeeName}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.875rem' }}>{lv.type}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={14} />
                          {new Date(lv.fromDate).toLocaleDateString()} - {new Date(lv.toDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{lv.days} Days</span>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={lv.reason}>
                          {lv.reason}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-badge status-${lv.status.toLowerCase()}`}>
                          {lv.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {lv.status === 'Applied' ? (
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <button 
                              onClick={() => handleStatusUpdate(lv.id, 'Approved')}
                              style={{ padding: '0.4rem 0.8rem', background: '#ecfdf5', color: '#10b981', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <CheckCircle2 size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(lv.id, 'Rejected')}
                              style={{ padding: '0.4rem 0.8rem', background: '#fff1f2', color: '#e11d48', border: 'none', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>No actions</span>
                        )}
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

export default LeaveRequests;
