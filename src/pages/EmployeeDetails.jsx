import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, 
  Edit3, 
  Calendar, 
  Clock, 
  FileText, 
  Briefcase, 
  DollarSign,
  Bell,
  Mail,
  ChevronDown,
  LayoutGrid,
  Loader2,
  Phone,
  MapPin,
  Search,
  Plus,
  History,
  CheckCircle2,
  X,
  Filter,
  ArrowRight,
  AlertCircle,
  Pencil
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import '../CSS/EmployeeDetails.css';

const API_URL = import.meta.env.VITE_API_URL;

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Allocation State
  const [selectedProject, setSelectedProject] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [isAllocating, setIsAllocating] = useState(false);

  // Timesheet State
  const [isAddingTimesheet, setIsAddingTimesheet] = useState(false);
  const [timesheetForm, setTimesheetForm] = useState({
    projectID: '',
    projectName: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    description: ''
  });
  const [timesheetLoading, setTimesheetLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  // Leave State
  const [isAddingLeave, setIsAddingLeave] = useState(false);
  const [isEditingLeave, setIsEditingLeave] = useState(false);
  const [editingLeaveID, setEditingLeaveID] = useState(null);
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual Leave',
    reason: '',
    fromDate: '',
    toDate: ''
  });
  const [leaveLoading, setLeaveLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, projRes, allocRes, tsRes, leaveRes] = await Promise.all([
        axios.get(`${API_URL}/collection/employees/${id}`),
        axios.get(`${API_URL}/collection/projects`),
        axios.get(`${API_URL}/collection/project_allocations`),
        axios.get(`${API_URL}/collection/timesheets`),
        axios.get(`${API_URL}/collection/leaves`)
      ]);
      
      setEmployee(empRes.data);
      setProjects(projRes.data);
      
      const empAllocations = allocRes.data
        .filter(a => a.employeeID === id)
        .sort((a, b) => new Date(b.allocatedAt) - new Date(a.allocatedAt));
      setAllocations(empAllocations);

      if (empAllocations.length > 0) {
        setTimesheetForm(prev => ({ ...prev, projectID: empAllocations[0].projectID }));
      }

      const empTimesheets = tsRes.data
        .filter(ts => ts.employeeID === id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setTimesheets(empTimesheets);

      const empLeaves = leaveRes.data
        .filter(l => l.employeeID === id)
        .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate));
      setLeaves(empLeaves);
      
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAllocate = async () => {
    if (!selectedProject) return;
    setIsAllocating(true);
    try {
      const project = projects.find(p => p.id === selectedProject);
      const allocationID = `ALC${Date.now()}`;
      const allocationData = {
        id: allocationID,
        employeeID: id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        projectID: project.id,
        projectName: project.name,
        allocatedAt: new Date().toISOString(),
        status: 'Active'
      };
      await axios.post(`${API_URL}/collection/project_allocations/${allocationID}`, allocationData);
      alert('Project allocated successfully!');
      setSelectedProject('');
      setSearchProject('');
      fetchData();
    } catch (error) {
      alert('Allocation failed');
    } finally {
      setIsAllocating(false);
    }
  };

  const handleSaveTimesheet = async (e) => {
    e.preventDefault();
    if (!timesheetForm.hours || !timesheetForm.date) {
      alert('Please fill in all required fields');
      return;
    }
    setTimesheetLoading(true);
    try {
      const tsID = `TS${Date.now()}`;
      const latestAlloc = allocations[0];
      if (!latestAlloc) {
        alert('No active allocation found');
        return;
      }
      const entryData = {
        ...timesheetForm,
        id: tsID,
        employeeID: id,
        projectID: latestAlloc.projectID,
        projectName: latestAlloc.projectName,
        createdAt: new Date().toISOString()
      };
      await axios.post(`${API_URL}/collection/timesheets/${tsID}`, entryData);
      alert('Timesheet saved!');
      setIsAddingTimesheet(false);
      setTimesheetForm({ ...timesheetForm, hours: '', description: '' });
      fetchData();
    } catch (error) {
      alert('Failed to save timesheet');
    } finally {
      setTimesheetLoading(false);
    }
  };

  const handleOpenAddLeave = () => {
    setIsEditingLeave(false);
    setEditingLeaveID(null);
    setLeaveForm({ type: 'Casual Leave', reason: '', fromDate: '', toDate: '' });
    setIsAddingLeave(true);
  };

  const handleOpenEditLeave = (lv) => {
    setIsEditingLeave(true);
    setEditingLeaveID(lv.id);
    setLeaveForm({
      type: lv.type,
      reason: lv.reason,
      fromDate: lv.fromDate,
      toDate: lv.toDate
    });
    setIsAddingLeave(true);
    // Scroll to form
    window.scrollTo({ top: 500, behavior: 'smooth' });
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveForm.fromDate || !leaveForm.toDate || !leaveForm.reason) {
      alert('Please fill in all fields');
      return;
    }

    setLeaveLoading(true);
    try {
      const days = Math.ceil((new Date(leaveForm.toDate) - new Date(leaveForm.fromDate)) / (1000 * 60 * 60 * 24)) + 1;
      
      if (isEditingLeave) {
        await axios.put(`${API_URL}/collection/leaves/${editingLeaveID}`, { ...leaveForm, days });
        alert('Leave updated successfully!');
      } else {
        const leaveID = `LV${Date.now()}`;
        const leaveData = {
          ...leaveForm,
          id: leaveID,
          employeeID: id,
          employeeName: `${employee.firstName} ${employee.lastName}`,
          days,
          status: 'Applied',
          appliedAt: new Date().toISOString()
        };
        await axios.post(`${API_URL}/collection/leaves/${leaveID}`, leaveData);
        alert('Leave applied successfully!');
      }
      
      setIsAddingLeave(false);
      setIsEditingLeave(false);
      setLeaveForm({ type: 'Casual Leave', reason: '', fromDate: '', toDate: '' });
      fetchData();
    } catch (error) {
      alert('Action failed');
    } finally {
      setLeaveLoading(false);
    }
  };

  const updateLeaveStatus = async (leaveID, status) => {
    try {
      await axios.put(`${API_URL}/collection/leaves/${leaveID}`, { status });
      alert(`Leave ${status}`);
      fetchData();
    } catch (error) {
      alert('Status update failed');
    }
  };

  const filteredTimesheets = timesheets.filter(ts => {
    if (!dateFilter.start && !dateFilter.end) return true;
    const tsDate = new Date(ts.date);
    const start = dateFilter.start ? new Date(dateFilter.start) : null;
    const end = dateFilter.end ? new Date(dateFilter.end) : null;
    if (start && tsDate < start) return false;
    if (end && tsDate > end) return false;
    return true;
  });

  const getQuarterlySummary = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
    const quarterLeaves = leaves.filter(l => new Date(l.fromDate) >= startOfQuarter && l.status === 'Approved');
    const casualUsed = quarterLeaves.filter(l => l.type === 'Casual Leave').reduce((sum, l) => sum + l.days, 0);
    const sickUsed = quarterLeaves.filter(l => l.type === 'Sick Leave').reduce((sum, l) => sum + l.days, 0);
    return { casualUsed, sickUsed };
  };

  const summary = getQuarterlySummary();

  const tabs = [
    { name: 'Basic Info', icon: <LayoutGrid size={18} /> },
    { name: 'Project Allocation', icon: <Briefcase size={18} /> },
    { name: 'Timesheet', icon: <Clock size={18} /> },
    { name: 'Applied Leaves', icon: <FileText size={18} /> },
    { name: 'Salary', icon: <DollarSign size={18} /> },
  ];

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchProject.toLowerCase()) || 
    p.id.toLowerCase().includes(searchProject.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Basic Info':
        return (
          <div className="details-content-grid">
            <div className="section-card">
              <div className="section-header"><h3>General Information</h3></div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{employee.firstName} {employee.lastName} is a {employee.designation} in the {employee.department} department.</p>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Department</span><span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{employee.department}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role</span><span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{employee.role}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Date Joined</span><span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}</span></div>
              </div>
            </div>
            <div className="section-card">
              <div className="section-header"><h3>Contact & Address</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div className="info-item"><span className="info-label">Email</span><span className="info-value">{employee.email}</span></div>
                 <div className="info-item"><span className="info-label">Phone</span><span className="info-value">{employee.phone}</span></div>
                 <div className="info-item"><span className="info-label">Address</span><span className="info-value">{employee.address1}, {employee.city}, {employee.state} - {employee.pincode}</span></div>
              </div>
            </div>
            <div className="section-card">
              <div className="section-header"><h3>Identity Documents</h3></div>
              <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '1rem' }}>
                 <div className="info-item"><span className="info-label">Aadhar Number</span><span className="info-value">{employee.aadharNumber}</span>{employee.aadharCardUrl && <a href={employee.aadharCardUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem', display: 'block' }}>View Aadhar Card</a>}</div>
                 <div className="info-item"><span className="info-label">PAN Number</span><span className="info-value">{employee.panNumber}</span>{employee.panCardUrl && <a href={employee.panCardUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem', display: 'block' }}>View PAN Card</a>}</div>
              </div>
            </div>
          </div>
        );

      case 'Project Allocation':
        return (
          <div className="allocation-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
            <div className="section-card">
              <div className="section-header"><h3>New Allocation</h3><Plus size={18} color="var(--primary)" /></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="input-field">
                  <label>Search & Select Project</label>
                  <div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} /><input type="text" placeholder="Search project..." style={{ paddingLeft: '2.5rem', marginBottom: '0.5rem' }} value={searchProject} onChange={(e) => setSearchProject(e.target.value)} /></div>
                  <div className="allocation-list-container">
                    {filteredProjects.map(p => (<div key={p.id} className={`project-item ${selectedProject === p.id ? 'selected' : ''}`} onClick={() => setSelectedProject(p.id)}><span style={{ fontWeight: 600 }}>{p.name}</span><span className="project-id">{p.id}</span></div>))}
                    {filteredProjects.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>No projects found</div>}
                  </div>
                </div>
                <button className="save-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAllocate} disabled={!selectedProject || isAllocating}>{isAllocating ? <Loader2 size={18} className="animate-spin" /> : 'Allocate Project'}</button>
              </div>
            </div>
            <div className="section-card">
              <div className="section-header"><h3>Allocation History</h3><History size={18} color="#64748b" /></div>
              <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {allocations.length === 0 ? <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No history of allocations.</div> : allocations.map((alc, index) => (
                  <div key={index} style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', transition: 'transform 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}><div style={{ width: '45px', height: '45px', background: 'var(--primary-light)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Briefcase size={22} /></div><div><h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{alc.projectName}</h4><div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}><span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><LayoutGrid size={14} /> {alc.projectID}</span><span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> {new Date(alc.allocatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div></div></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 800, padding: '0.4rem 0.85rem', background: '#f0fdf4', borderRadius: '2rem', border: '1px solid #dcfce7' }}><CheckCircle2 size={14} />ACTIVE</div>
                  </div>))}
              </div>
            </div>
          </div>
        );

      case 'Timesheet':
        return (
          <div className="timesheet-container">
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}><h3>Project Timesheet</h3><button className="add-employee-btn" style={{ padding: '0.6rem 1.25rem' }} onClick={() => setIsAddingTimesheet(!isAddingTimesheet)}><Plus size={18} /><span>Add Timesheet</span></button></div>
            {isAddingTimesheet && (<div className="section-card" style={{ marginBottom: '2rem', background: '#f8fafc', border: '1px dashed var(--primary)' }}><form onSubmit={handleSaveTimesheet} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1.5rem', alignItems: 'flex-end' }}><div className="input-field"><label>Current Project</label><div style={{ padding: '0.65rem 1rem', background: '#f1f5f9', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, border: '1px solid var(--border)' }}>{allocations.length > 0 ? allocations[0].projectName : 'No active allocation'}</div></div><div className="input-field"><label>Date</label><input type="date" value={timesheetForm.date} onChange={(e) => setTimesheetForm({ ...timesheetForm, date: e.target.value })} required /></div><div className="input-field"><label>Billable Hours</label><input type="number" step="0.5" placeholder="e.g. 8" value={timesheetForm.hours} onChange={(e) => setTimesheetForm({ ...timesheetForm, hours: e.target.value })} required /></div><div style={{ display: 'flex', gap: '0.5rem' }}><button type="submit" className="save-btn" disabled={timesheetLoading}>{timesheetLoading ? <Loader2 size={18} className="animate-spin" /> : 'Save'}</button><button type="button" className="cancel-btn" onClick={() => setIsAddingTimesheet(false)}>Cancel</button></div></form></div>)}
            <div className="section-card">
               <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}><Filter size={18} /><span>Filter by Date:</span><input type="date" style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }} value={dateFilter.start} onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })} /><ArrowRight size={14} /><input type="date" style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '0.4rem' }} value={dateFilter.end} onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })} />{(dateFilter.start || dateFilter.end) && (<button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }} onClick={() => setDateFilter({ start: '', end: '' })}>Clear</button>)}</div></div>
               <table className="project-table">
                  <thead><tr><th>Date</th><th>Project</th><th>Billable Hours</th><th style={{ textAlign: 'center' }}>Status</th></tr></thead>
                  <tbody>{filteredTimesheets.length === 0 ? (<tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No timesheet entries found.</td></tr>) : filteredTimesheets.map((ts) => (<tr key={ts.id}><td><span style={{ fontWeight: 600 }}>{new Date(ts.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></td><td>{ts.projectName}</td><td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{ts.hours} Hrs</span></td><td style={{ textAlign: 'center' }}><span className="status-badge status-done" style={{ fontSize: '0.7rem' }}>Submitted</span></td></tr>))}</tbody>
               </table>
            </div>
          </div>
        );

      case 'Applied Leaves':
        return (
          <div className="leaves-container">
            <div className="leave-summary-grid">
               <div className="leave-stat-card" style={{ borderLeft: '4px solid var(--primary)' }}><p>Casual Leave Limit</p><h4>2 Days <span>/ Quarter</span></h4></div>
               <div className="leave-stat-card" style={{ borderLeft: '4px solid #10b981' }}><p>Casual Leave Used</p><h4 style={{ color: summary.casualUsed > 2 ? '#ef4444' : '#10b981' }}>{summary.casualUsed} Days</h4></div>
               <div className="leave-stat-card" style={{ borderLeft: '4px solid #8b5cf6' }}><p>Sick Leave Limit</p><h4>4 Days <span>/ Quarter</span></h4></div>
               <div className="leave-stat-card" style={{ borderLeft: '4px solid #f59e0b' }}><p>Sick Leave Used</p><h4 style={{ color: summary.sickUsed > 4 ? '#ef4444' : '#f59e0b' }}>{summary.sickUsed} Days</h4></div>
            </div>
            {(summary.casualUsed > 2 || summary.sickUsed > 4) && (<div style={{ padding: '1rem', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: '#e11d48', fontSize: '0.875rem', fontWeight: 500 }}><AlertCircle size={20} /><span>Leave limit exceeded for this quarter. Additional leaves will initiate <strong>Loss of Pay (LOP)</strong>.</span></div>)}
            <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}><h3>Applied Leaves</h3><button className="add-employee-btn" onClick={handleOpenAddLeave}><Plus size={18} /><span>Apply Leave</span></button></div>
            {isAddingLeave && (
              <div id="leave-form" className="section-card" style={{ marginBottom: '2rem', background: '#f8fafc', border: '1px dashed var(--primary)' }}>
                 <form onSubmit={handleApplyLeave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                       <div className="input-field"><label>Leave Type</label><select value={leaveForm.type} onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}><option value="Casual Leave">Casual Leave</option><option value="Sick Leave">Sick Leave</option></select></div>
                       <div className="input-field"><label>From Date</label><input type="date" required value={leaveForm.fromDate} onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })} /></div>
                       <div className="input-field"><label>To Date</label><input type="date" required value={leaveForm.toDate} onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })} /></div>
                    </div>
                    <div className="input-field" style={{ marginBottom: '1.5rem' }}><label>Reason</label><textarea rows="2" placeholder="Enter reason for leave..." required style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }} value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}></textarea></div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}><button type="button" className="cancel-btn" onClick={() => setIsAddingLeave(false)}>Cancel</button><button type="submit" className="save-btn" disabled={leaveLoading}>{leaveLoading ? <Loader2 size={18} className="animate-spin" /> : (isEditingLeave ? 'Update Leave' : 'Apply Leave')}</button></div>
                 </form>
              </div>
            )}
            <div className="section-card">
               <table className="project-table">
                  <thead><tr><th>Dates</th><th>Type</th><th>Days</th><th>Reason</th><th style={{ textAlign: 'center' }}>Status</th><th style={{ textAlign: 'center' }}>Action</th></tr></thead>
                  <tbody>{leaves.length === 0 ? (<tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>No leave applications found.</td></tr>) : leaves.map((lv) => (
                    <tr key={lv.id}>
                      <td><div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{new Date(lv.fromDate).toLocaleDateString()} - {new Date(lv.toDate).toLocaleDateString()}</div></td>
                      <td>{lv.type}</td>
                      <td>{lv.days} Days</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b', fontSize: '0.8rem' }}>{lv.reason}</td>
                      <td style={{ textAlign: 'center' }}><span className={`status-badge status-${lv.status.toLowerCase()}`}>{lv.status}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          <button 
                            className="edit-btn" 
                            style={{ padding: '0.35rem 0.6rem', background: '#f0f9ff', color: '#0ea5e9', border: 'none', borderRadius: '0.4rem', cursor: 'pointer' }}
                            onClick={() => handleOpenEditLeave(lv)}
                          >
                            <Pencil size={14} />
                          </button>
                          {lv.status === 'Applied' && (
                            <>
                              <button onClick={() => updateLeaveStatus(lv.id, 'Approved')} style={{ background: '#ecfdf5', color: '#10b981', border: 'none', padding: '0.35rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>Approve</button>
                              <button onClick={() => updateLeaveStatus(lv.id, 'Rejected')} style={{ background: '#fff1f2', color: '#e11d48', border: 'none', padding: '0.35rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>Reject</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>))}
                  </tbody>
               </table>
            </div>
          </div>
        );

      default:
        return <div className="section-card">Content for {activeTab} coming soon...</div>;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={48} className="animate-spin" color="var(--primary)" />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="main-content">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Employee Not Found</h2>
            <button onClick={() => navigate('/employees')} className="manage-btn" style={{ marginTop: '1rem' }}>Back to Employees</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => navigate('/employees')}
              className="action-btn"
              style={{ background: 'white', border: '1px solid var(--border)' }}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Employee Details</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>View and manage information for {employee?.firstName}.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <button className="action-btn" style={{ position: 'relative', color: '#64748b' }}>
               <Bell size={20} />
               <span className="badge">3</span>
             </button>
             <button className="action-btn" style={{ position: 'relative', color: '#64748b' }}>
               <Mail size={20} />
               <span className="badge">2</span>
             </button>
             <div className="user-profile" style={{ borderLeft: '1px solid var(--border)', paddingLeft: '1.5rem' }}>
               <div className="user-avatar" style={{ width: 35, height: 35, background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>A</div>
               <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.75rem' }}>
                 Admin <ChevronDown size={14} />
               </span>
             </div>
          </div>
        </div>

        <div className="employee-details-container">
          <div className="profile-card">
            <div className="profile-left">
              <div className="profile-avatar-large" style={{ overflow: 'hidden' }}>
                {employee?.profilePhotoUrl ? <img src={employee.profilePhotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'JD'}
              </div>
              <div className="profile-main-info">
                <h2>{employee?.firstName} {employee?.lastName}</h2>
                <p>{employee?.designation}</p>
                <span className="status-badge status-active">Active</span>
              </div>
              <button className="edit-profile-btn">
                <Edit3 size={16} />
                Edit Employee
              </button>
            </div>

            <div className="profile-info-grid">
              <div className="info-col">
                <div className="info-item"><span className="info-label">Employee ID</span><span className="info-value">{employee?.employeeID}</span></div>
                <div className="info-item"><span className="info-label">Email</span><span className="info-value">{employee?.email}</span></div>
              </div>
              <div className="info-col">
                <div className="info-item"><span className="info-label">Department</span><span className="info-value">{employee?.department}</span></div>
                <div className="info-item"><span className="info-label">Phone</span><span className="info-value">{employee?.phone}</span></div>
              </div>
              <div className="info-col">
                <div className="info-item"><span className="info-label">Role</span><span className="info-value">{employee?.role}</span></div>
                <div className="info-item"><span className="info-label">Designation</span><span className="info-value">{employee?.designation}</span></div>
              </div>
            </div>
          </div>

          <div className="detail-tabs">
            {tabs.map(tab => (
              <div 
                key={tab.name}
                className={`tab-item ${activeTab === tab.name ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.icon}
                {tab.name}
              </div>
            ))}
          </div>

          <div className="tab-content-area" style={{ marginTop: '0.5rem' }}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
