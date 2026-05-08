import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserX, 
  Plus,
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../CSS/Dashboard.css';
import '../CSS/Employees.css';

const API_URL = import.meta.env.VITE_API_URL;

const Employees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/collection/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      // If no documents found, it returns 404 with message
      if (error.response?.status === 404) {
        setEmployees([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => 
    emp.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div className="employees-container">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Employees</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Manage and view all your organization's employees in one place.</p>
            </div>
            <button 
              className="add-employee-btn"
              onClick={() => navigate('/employees/add')}
            >
              <Plus size={18} />
              <span>Add Employee</span>
            </button>
          </div>

          <div className="stats-grid">
            <StatCard 
              label="Total Employees" 
              value={employees.length.toString()} 
              trend="+4.2%" 
              trendType="up"
              icon={<Users size={20} />}
              iconBg="#f5f3ff"
              iconColor="#8b5cf6"
            />
            <StatCard 
              label="Active Employees" 
              value={employees.length.toString()} 
              trend="+5.6%" 
              trendType="up"
              icon={<UserCheck size={20} />}
              iconBg="#f0fdf4"
              iconColor="#10b981"
            />
            <StatCard 
              label="On Leave" 
              value="0" 
              trend="0%" 
              trendType="down"
              icon={<UserMinus size={20} />}
              iconBg="#fff7ed"
              iconColor="#f97316"
            />
            <StatCard 
              label="Inactive" 
              value="0" 
              trend="0%" 
              trendType="up"
              icon={<UserX size={20} />}
              iconBg="#eff6ff"
              iconColor="#3b82f6"
            />
          </div>

          <div className="table-card">
            <div className="table-header-actions" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
               <div className="search-bar" style={{ position: 'relative', maxWidth: '300px', width: '100%' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input 
                    type="text" 
                    placeholder="Search employees..." 
                    style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '0.875rem' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>
            
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <Loader2 size={32} className="animate-spin" color="var(--primary)" />
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Loading employees...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, i) => (
                    <tr key={emp.id || i}>
                      <td>
                        <div className="employee-info-cell">
                          <div className="emp-avatar" style={{ background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#64748b', overflow: 'hidden' }}>
                            {emp.profilePhotoUrl ? (
                              <img src={emp.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              (emp.firstName?.[0] || '') + (emp.lastName?.[0] || '')
                            )}
                          </div>
                          <div className="emp-details">
                            <span className="emp-name">{emp.firstName} {emp.lastName}</span>
                            <span className="emp-id">{emp.employeeID}</span>
                          </div>
                        </div>
                      </td>
                      <td>{emp.department}</td>
                      <td>{emp.designation}</td>
                      <td className="email-cell" title={emp.email}>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.role}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="manage-btn"
                          onClick={() => navigate(`/employees/${emp.employeeID}`)}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="table-footer">
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Showing {filteredEmployees.length} of {employees.length} employees
              </span>
              
              <div className="pagination">
                <button className="pagination-btn"><ChevronLeft size={16} /></button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn"><ChevronRight size={16} /></button>
              </div>
              
              <div className="rows-per-page">
                <select>
                  <option>10 / page</option>
                  <option>20 / page</option>
                  <option>50 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Employees;
