import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  Briefcase, 
  Plus, 
  Mail, 
  Phone, 
  Building2,
  Calendar,
  DollarSign,
  X,
  CreditCard,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../CSS/Customers.css';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const [projects, setProjects] = useState([
    { id: 'PRJ001', name: 'Website Development', amount: 5000, date: '10 May 2024' },
    { id: 'PRJ002', name: 'Mobile App Design', amount: 3500, date: '15 May 2024' },
  ]);

  const [payments, setPayments] = useState([
    { id: 'PAY001', project: 'Website Development', amount: 2000, date: '12 May 2024', method: 'Bank Transfer' },
    { id: 'PAY002', project: 'Website Development', amount: 1500, date: '20 May 2024', method: 'Credit Card' },
    { id: 'PAY003', project: 'Mobile App Design', amount: 3500, date: '22 May 2024', method: 'PayPal' },
  ]);

  const [projectFormData, setProjectFormData] = useState({
    name: '',
    amount: ''
  });

  const [paymentFormData, setPaymentFormData] = useState({
    project: '',
    amount: '',
    method: 'Bank Transfer'
  });

  const handleProjectInputChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProject = () => {
    if (!projectFormData.name || !projectFormData.amount) {
      alert('Please fill in all fields');
      return;
    }

    const newProject = {
      id: `PRJ00${projects.length + 1}`,
      name: projectFormData.name,
      amount: parseFloat(projectFormData.amount),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setProjects([...projects, newProject]);
    setIsProjectModalOpen(false);
    setProjectFormData({ name: '', amount: '' });
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPayment = () => {
    if (!paymentFormData.project || !paymentFormData.amount) {
      alert('Please fill in all fields');
      return;
    }

    const newPayment = {
      id: `PAY00${payments.length + 1}`,
      ...paymentFormData,
      amount: parseFloat(paymentFormData.amount),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setPayments([...payments, newPayment]);
    setIsPaymentModalOpen(false);
    setPaymentFormData({ project: '', amount: '', method: 'Bank Transfer' });
  };

  const totalRevenue = projects.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = totalRevenue - totalPaid;

  const renderTabContent = () => {
    if (activeTab === 'Basic Info') {
      return (
        <div className="section-card">
          <div className="section-header">
            <h3>Customer Basic Information</h3>
          </div>
          <div className="profile-info-grid" style={{ gap: '2.5rem' }}>
            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">John Doe</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mobile Number</span>
              <span className="info-value">+1 234 567 8901</span>
            </div>
            <div className="info-item">
              <span className="info-label">Business Name</span>
              <span className="info-value">Tech Solutions Inc.</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email Address</span>
              <span className="info-value">john@techsolutions.com</span>
            </div>
            <div className="info-item">
              <span className="info-label">Customer Since</span>
              <span className="info-value">12 Jan 2024</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value" style={{ color: '#10b981' }}>Active</span>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'Projects') {
      return (
        <div className="section-card">
          <div className="section-header">
            <h3>Projects List</h3>
            <button className="add-project-btn" onClick={() => setIsProjectModalOpen(true)}>
              <Plus size={16} />
              Add Project
            </button>
          </div>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Amount</th>
                <th>Date Added</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, i) => (
                <tr key={i}>
                  <td>{proj.id}</td>
                  <td style={{ fontWeight: 600 }}>{proj.name}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <DollarSign size={14} color="#64748b" />
                      {parseFloat(proj.amount).toLocaleString()}
                    </div>
                  </td>
                  <td>{proj.date}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: '#f0fdf4', color: '#10b981', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Active</span>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    } else if (activeTab === 'Payments') {
      return (
        <div className="section-card">
          <div className="section-header">
            <h3>Payment Records</h3>
            <button className="add-project-btn" onClick={() => setIsPaymentModalOpen(true)}>
              <Plus size={16} />
              Add Payment
            </button>
          </div>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((pay, i) => (
                <tr key={i}>
                  <td>{pay.id}</td>
                  <td>{pay.project}</td>
                  <td style={{ fontWeight: 600, color: '#10b981' }}>
                    +${pay.amount.toLocaleString()}
                  </td>
                  <td>{pay.date}</td>
                  <td>{pay.method}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ padding: '0.25rem 0.75rem', background: '#f0fdf4', color: '#10b981', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>Received</span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No payment records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    } else if (activeTab === 'Analytics') {
      return (
        <div className="analytics-container">
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="stat-card-mini">
              <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                <DollarSign size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Revenue</span>
                <h4 className="stat-value">${totalRevenue.toLocaleString()}</h4>
                <div className="stat-trend up">
                  <TrendingUp size={12} /> 12% from last month
                </div>
              </div>
            </div>

            <div className="stat-card-mini">
              <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#10b981' }}>
                <CreditCard size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Amount Paid</span>
                <h4 className="stat-value">${totalPaid.toLocaleString()}</h4>
                <div className="stat-trend up">
                   <ArrowUpRight size={12} /> {totalRevenue > 0 ? ((totalPaid/totalRevenue)*100).toFixed(1) : 0}% collected
                </div>
              </div>
            </div>

            <div className="stat-card-mini">
              <div className="stat-icon-wrapper" style={{ background: '#fff1f2', color: '#e11d48' }}>
                <Clock size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Amount Pending</span>
                <h4 className="stat-value">${totalPending.toLocaleString()}</h4>
                <div className="stat-trend down">
                  <ArrowDownRight size={12} /> {totalRevenue > 0 ? ((totalPending/totalRevenue)*100).toFixed(1) : 0}% remaining
                </div>
              </div>
            </div>
          </div>

          <div className="analytics-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div className="section-card">
              <div className="section-header">
                <h3>Collection Overview</h3>
                <BarChart3 size={18} color="#64748b" />
              </div>
              <div className="progress-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {projects.map((proj, i) => {
                   const projPaid = payments.filter(p => p.project === proj.name).reduce((sum, p) => sum + p.amount, 0);
                   const percentage = proj.amount > 0 ? (projPaid / proj.amount) * 100 : 0;
                   return (
                     <div key={i} className="project-progress">
                       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                         <span style={{ fontWeight: 600 }}>{proj.name}</span>
                         <span style={{ color: '#64748b' }}>${projPaid.toLocaleString()} / ${proj.amount.toLocaleString()}</span>
                       </div>
                       <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                         <div style={{ height: '100%', width: `${percentage}%`, background: 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s ease-out' }}></div>
                       </div>
                       <div style={{ textAlign: 'right', fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--primary)', fontWeight: 600 }}>{percentage.toFixed(0)}%</div>
                     </div>
                   );
                })}
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h3>Payment Methods</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Bank Transfer', 'Credit Card', 'PayPal'].map(method => {
                  const count = payments.filter(p => p.method === method).length;
                  const methodTotal = payments.filter(p => p.method === method).reduce((sum, p) => sum + p.amount, 0);
                  return (
                    <div key={method} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>{method}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{count} transactions</p>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>${methodTotal.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div className="customer-details-container">
          <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => navigate('/customers')}
              className="manage-btn"
              style={{ background: 'white', border: '1px solid var(--border)', padding: '0.5rem' }}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Customer Details</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Manage individual customer information and their associated projects.</p>
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-left">
              <div className="profile-avatar-large">JD</div>
              <div className="profile-main-info">
                <h2>John Doe</h2>
                <p>Tech Solutions Inc.</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: '#64748b' }}>
                     <Phone size={14} /> +1 234 567 8901
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: '#64748b' }}>
                     <Mail size={14} /> john@techsolutions.com
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-tabs">
            <div 
              className={`tab-item ${activeTab === 'Basic Info' ? 'active' : ''}`}
              onClick={() => setActiveTab('Basic Info')}
            >
              <User size={18} />
              Basic Info
            </div>
            <div 
              className={`tab-item ${activeTab === 'Projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('Projects')}
            >
              <Briefcase size={18} />
              Projects
            </div>
            <div 
              className={`tab-item ${activeTab === 'Payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('Payments')}
            >
              <CreditCard size={18} />
              Payments
            </div>
            <div 
              className={`tab-item ${activeTab === 'Analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('Analytics')}
            >
              <BarChart3 size={18} />
              Analytics
            </div>
          </div>

          <div className="tab-content" style={{ marginTop: '1rem' }}>
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {isProjectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Project</h3>
              <button className="close-btn" onClick={() => setIsProjectModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Project Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter project name"
                  value={projectFormData.name}
                  onChange={handleProjectInputChange}
                />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input 
                  type="number" 
                  name="amount"
                  placeholder="Enter project amount"
                  value={projectFormData.amount}
                  onChange={handleProjectInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsProjectModalOpen(false)}>Cancel</button>
              <button className="save-btn" onClick={handleAddProject}>Save Project</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Payment</h3>
              <button className="close-btn" onClick={() => setIsPaymentModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Project</label>
                <select 
                  name="project"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                  value={paymentFormData.project}
                  onChange={handlePaymentInputChange}
                >
                  <option value="">Select a project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Installment Amount</label>
                <input 
                  type="number" 
                  name="amount"
                  placeholder="Enter payment amount"
                  value={paymentFormData.amount}
                  onChange={handlePaymentInputChange}
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select 
                  name="method"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}
                  value={paymentFormData.method}
                  onChange={handlePaymentInputChange}
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsPaymentModalOpen(false)}>Cancel</button>
              <button className="save-btn" onClick={handleAddPayment}>Save Payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
