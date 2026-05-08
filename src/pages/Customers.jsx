import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  X,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../CSS/Customers.css';

const initialCustomers = [
  { id: 'CUST001', name: 'John Doe', business: 'Tech Solutions Inc.', email: 'john@techsolutions.com', mobile: '+1 234 567 8901' },
  { id: 'CUST002', name: 'Sarah Wilson', business: 'Creative Agency', email: 'sarah@creative.com', mobile: '+1 234 567 8902' },
  { id: 'CUST003', name: 'Michael Brown', business: 'Global Logistics', email: 'michael@logistics.com', mobile: '+1 234 567 8903' },
  { id: 'CUST004', name: 'Emma Davis', business: 'Emma Events', email: 'emma@events.com', mobile: '+1 234 567 8904' },
];

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    business: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.mobile || !formData.business) {
      alert('Please fill in all required fields');
      return;
    }

    const newCustomer = {
      id: `CUST00${customers.length + 1}`,
      ...formData
    };

    setCustomers([...customers, newCustomer]);
    setIsModalOpen(false);
    setFormData({ name: '', mobile: '', business: '', email: '' });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div className="customers-container">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Customers</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Manage your customer database and project details.</p>
            </div>
            <button 
              className="add-customer-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              <span>Add Customer</span>
            </button>
          </div>

          <div className="table-card">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Business Name</th>
                  <th>Mobile Number</th>
                  <th>Email Address</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust, i) => (
                  <tr key={i}>
                    <td>
                      <div className="customer-info-cell">
                        <div className="cust-avatar">
                          {cust.name[0]}
                        </div>
                        <div className="cust-details">
                          <span className="cust-name">{cust.name}</span>
                          <span className="cust-id">{cust.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Building2 size={14} color="#64748b" />
                        {cust.business}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={14} color="#64748b" />
                        {cust.mobile}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={14} color="#64748b" />
                        {cust.email || 'N/A'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="manage-btn"
                        onClick={() => navigate(`/customers/${cust.id}`)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Customer</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Customer Name *</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Enter customer name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number *</label>
                <input 
                  type="text" 
                  name="mobile"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Business Name *</label>
                <input 
                  type="text" 
                  name="business"
                  placeholder="Enter business name"
                  value={formData.business}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email (Optional)</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSave}>Save Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
