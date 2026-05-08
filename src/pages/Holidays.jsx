import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../CSS/Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL;

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: ''
  });
  const [saving, setSaving] = useState(false);

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/collection/holidays`);
      // Sort by date
      const sorted = response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setHolidays(sorted);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      if (error.response?.status === 404) {
        setHolidays([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.name) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaving(true);
    const loadToast = toast.loading('Adding holiday...');
    try {
      const holidayID = `HLD${Date.now()}`;
      await axios.post(`${API_URL}/collection/holidays/${holidayID}`, {
        id: holidayID,
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      toast.success('Holiday added successfully!', { id: loadToast });
      setFormData({ date: new Date().toISOString().split('T')[0], name: '' });
      setIsAdding(false);
      fetchHolidays();
    } catch (error) {
      toast.error('Failed to add holiday', { id: loadToast });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHoliday = async (id) => {
    if (!window.confirm('Are you sure you want to delete this holiday?')) return;
    
    const loadToast = toast.loading('Deleting holiday...');
    try {
      await axios.delete(`${API_URL}/collection/holidays/${id}`);
      toast.success('Holiday deleted', { id: loadToast });
      fetchHolidays();
    } catch (error) {
      toast.error('Delete failed', { id: loadToast });
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div className="employees-container" style={{ padding: '2rem' }}>
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Company Holidays</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Manage official company holidays for the calendar year.</p>
            </div>
            <button 
              className="add-employee-btn"
              onClick={() => setIsAdding(!isAdding)}
            >
              <Plus size={18} />
              <span>{isAdding ? 'Close' : 'Add Holiday'}</span>
            </button>
          </div>

          {isAdding && (
            <div className="table-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#f8fafc', border: '1px dashed var(--primary)' }}>
              <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 600 }}>New Holiday Entry</h3>
              <form onSubmit={handleAddHoliday} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr auto', gap: '1.5rem', alignItems: 'flex-end' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    style={{ padding: '0.6rem 1rem' }}
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required 
                  />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="input-label">Holiday Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Independence Day"
                    style={{ padding: '0.6rem 1rem' }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>
                <button type="submit" className="save-btn" style={{ padding: '0.75rem 2rem' }} disabled={saving}>
                  {saving ? <Loader2 size={18} className="animate-spin" /> : 'Save Holiday'}
                </button>
              </form>
            </div>
          )}

          <div className="table-card">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Holiday Name</th>
                  <th>Day</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}>
                      <Loader2 size={32} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto' }} />
                    </td>
                  </tr>
                ) : holidays.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      No holidays added yet.
                    </td>
                  </tr>
                ) : (
                  holidays.map((holiday) => {
                    const dateObj = new Date(holiday.date);
                    const isPast = dateObj < new Date().setHours(0,0,0,0);
                    return (
                      <tr key={holiday.id} style={{ opacity: isPast ? 0.6 : 1 }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                              <CalendarIcon size={20} />
                            </div>
                            <span style={{ fontWeight: 600 }}>
                              {dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td>{holiday.name}</td>
                        <td>{dateObj.toLocaleDateString('en-US', { weekday: 'long' })}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            onClick={() => handleDeleteHoliday(holiday.id)}
                            style={{ color: '#ef4444', background: 'none', padding: '0.5rem', borderRadius: '0.5rem' }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holidays;
