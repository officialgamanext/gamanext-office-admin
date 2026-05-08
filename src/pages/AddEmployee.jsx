import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ChevronLeft, 
  Camera, 
  Upload, 
  Save, 
  X,
  Bell,
  Mail,
  ChevronDown,
  Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import '../CSS/AddEmployee.css';

const API_URL = import.meta.env.VITE_API_URL;

const AddEmployee = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    employeeID: '',
    department: '',
    designation: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    aadharNumber: '',
    panNumber: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    emergency1: { relation: '', name: '', mobile: '' },
    emergency2: { relation: '', name: '', mobile: '' }
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    aadharCard: null,
    panCard: null
  });

  const [previews, setPreviews] = useState({
    profilePhoto: null,
    aadharCard: null,
    panCard: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append('image', file);
    try {
      const response = await axios.post(`${API_URL}/image/upload`, data);
      return response.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Failed to upload images');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeID) {
      alert('Employee ID is required');
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Images
      const profilePhotoUrl = await uploadImage(files.profilePhoto);
      const aadharCardUrl = await uploadImage(files.aadharCard);
      const panCardUrl = await uploadImage(files.panCard);

      const finalData = {
        ...formData,
        profilePhotoUrl,
        aadharCardUrl,
        panCardUrl,
        createdAt: new Date().toISOString()
      };

      // 2. Save to Firestore
      await axios.post(`${API_URL}/collection/employees/${formData.employeeID}`, finalData);

      // 3. Create Auth User
      await axios.post(`${API_URL}/auth/register`, {
        email: formData.email,
        password: formData.password,
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      alert('Employee added successfully!');
      navigate('/employees');
    } catch (error) {
      console.error('Submission failed:', error);
      const errorData = error.response?.data;
      const errorMsg = errorData?.details || errorData?.error || error.message || 'Failed to save employee';
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        {/* Header Section */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => navigate(-1)}
              className="action-btn"
              style={{ background: 'white', border: '1px solid var(--border)' }}
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Add Employee</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Fill in the details below to add a new employee to your organization.</p>
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

        <form className="add-employee-container" onSubmit={handleSubmit}>
          {/* Row 1: Profile and Personal Info */}
          <div className="form-grid">
            <div className="form-section">
              <h3 className="section-title">Profile Photo</h3>
              <div 
                className="upload-area" 
                style={{ height: '200px', position: 'relative', overflow: 'hidden' }}
                onClick={() => document.getElementById('profilePhotoInput').click()}
              >
                {previews.profilePhoto ? (
                  <img src={previews.profilePhoto} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <div className="upload-icon-bg">
                      <Camera size={24} />
                    </div>
                    <div className="upload-text">
                      <p>Upload Photo</p>
                      <span>JPG, PNG up to 2MB</span>
                    </div>
                  </>
                )}
                <input 
                  id="profilePhotoInput" 
                  type="file" 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'profilePhoto')} 
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="input-group">
                <div className="input-field">
                  <label>First Name <span>*</span></label>
                  <input type="text" name="firstName" placeholder="Enter first name" required onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Last Name <span>*</span></label>
                  <input type="text" name="lastName" placeholder="Enter last name" required onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Phone Number <span>*</span></label>
                  <div className="phone-input-group">
                    <select className="country-code">
                      <option>🇮🇳 +91</option>
                    </select>
                    <input type="text" name="phone" placeholder="Enter phone number" style={{ flex: 1 }} required onChange={handleInputChange} />
                  </div>
                </div>
              </div>
              <div className="input-group">
                <div className="input-field">
                  <label>Email Address <span>*</span></label>
                  <input type="email" name="email" placeholder="Enter email address" required onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Password <span>*</span></label>
                  <input type="password" name="password" placeholder="Enter password" required onChange={handleInputChange} />
                </div>
                <div className="input-field">
                  <label>Role <span>*</span></label>
                  <input type="text" name="role" placeholder="Enter role" required onChange={handleInputChange} />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Work and Identity */}
          <div className="form-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-section">
                <h3 className="section-title">Work Information</h3>
                <div className="input-group">
                  <div className="input-field">
                    <label>Employee ID <span>*</span></label>
                    <input type="text" name="employeeID" placeholder="Enter employee ID" required onChange={handleInputChange} />
                  </div>
                  <div className="input-field">
                    <label>Department <span>*</span></label>
                    <input type="text" name="department" placeholder="Enter department" required onChange={handleInputChange} />
                  </div>
                  <div className="input-field">
                    <label>Designation <span>*</span></label>
                    <input type="text" name="designation" placeholder="Enter designation" required onChange={handleInputChange} />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-title">Address</h3>
                <div className="input-group">
                  <div className="input-field">
                    <label>Address Line 1 <span>*</span></label>
                    <input type="text" name="address1" placeholder="Enter address line 1" required onChange={handleInputChange} />
                  </div>
                  <div className="input-field">
                    <label>Address Line 2</label>
                    <input type="text" name="address2" placeholder="Enter address line 2" onChange={handleInputChange} />
                  </div>
                </div>
                <div className="input-group">
                  <div className="input-field">
                    <label>City <span>*</span></label>
                    <input type="text" name="city" placeholder="Enter city" required onChange={handleInputChange} />
                  </div>
                  <div className="input-field">
                    <label>State <span>*</span></label>
                    <input type="text" name="state" placeholder="Enter state" required onChange={handleInputChange} />
                  </div>
                  <div className="input-field">
                    <label>Pincode <span>*</span></label>
                    <input type="text" name="pincode" placeholder="Enter pincode" required onChange={handleInputChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Identity Information</h3>
              <div className="input-field" style={{ marginBottom: '1.5rem' }}>
                <label>Aadhar Card Number <span>*</span></label>
                <input type="text" name="aadharNumber" placeholder="Enter Aadhar card number" required onChange={handleInputChange} />
              </div>
              <div className="input-field" style={{ marginBottom: '1.5rem' }}>
                <label>Aadhar Card Image <span>*</span></label>
                <div 
                  className="upload-area"
                  onClick={() => document.getElementById('aadharCardInput').click()}
                  style={{ position: 'relative', overflow: 'hidden', minHeight: '120px' }}
                >
                  {previews.aadharCard ? (
                    <img src={previews.aadharCard} alt="Aadhar Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <>
                      <div className="upload-icon-bg">
                        <Upload size={20} />
                      </div>
                      <div className="upload-text">
                        <p>Upload Aadhar Card</p>
                        <span>JPG, PNG, PDF up to 2MB</span>
                      </div>
                    </>
                  )}
                  <input 
                    id="aadharCardInput" 
                    type="file" 
                    hidden 
                    accept="image/*,.pdf" 
                    onChange={(e) => handleFileChange(e, 'aadharCard')} 
                  />
                </div>
              </div>
              <div className="input-field" style={{ marginBottom: '1.5rem' }}>
                <label>PAN Card Number <span>*</span></label>
                <input type="text" name="panNumber" placeholder="Enter PAN card number" required onChange={handleInputChange} />
              </div>
              <div className="input-field">
                <label>PAN Card Image <span>*</span></label>
                <div 
                  className="upload-area"
                  onClick={() => document.getElementById('panCardInput').click()}
                  style={{ position: 'relative', overflow: 'hidden', minHeight: '120px' }}
                >
                  {previews.panCard ? (
                    <img src={previews.panCard} alt="PAN Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <>
                      <div className="upload-icon-bg">
                        <Upload size={20} />
                      </div>
                      <div className="upload-text">
                        <p>Upload PAN Card</p>
                        <span>JPG, PNG, PDF up to 2MB</span>
                      </div>
                    </>
                  )}
                  <input 
                    id="panCardInput" 
                    type="file" 
                    hidden 
                    accept="image/*,.pdf" 
                    onChange={(e) => handleFileChange(e, 'panCard')} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Bank Details */}
          <div className="form-section" style={{ marginBottom: '1.5rem' }}>
            <h3 className="section-title">Bank Details</h3>
            <div className="input-group">
              <div className="input-field">
                <label>Bank Name <span>*</span></label>
                <input type="text" name="bankName" placeholder="Enter bank name" required onChange={handleInputChange} />
              </div>
              <div className="input-field">
                <label>Account Number <span>*</span></label>
                <input type="text" name="accountNumber" placeholder="Enter account number" required onChange={handleInputChange} />
              </div>
              <div className="input-field">
                <label>IFSC Code <span>*</span></label>
                <input type="text" name="ifscCode" placeholder="Enter IFSC code" required onChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Row 4: Emergency Contact Details */}
          <div className="form-section" style={{ marginBottom: '1.5rem' }}>
            <h3 className="section-title">Emergency Contact Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Emergency Contact 1</p>
                <div className="input-group">
                   <div className="input-field">
                     <label>Relation <span>*</span></label>
                     <input type="text" name="emergency1.relation" placeholder="Enter relation" required onChange={handleInputChange} />
                   </div>
                   <div className="input-field">
                     <label>Name <span>*</span></label>
                     <input type="text" name="emergency1.name" placeholder="Enter full name" required onChange={handleInputChange} />
                   </div>
                   <div className="input-field">
                     <label>Mobile Number <span>*</span></label>
                     <div className="phone-input-group">
                       <select className="country-code"><option>🇮🇳 +91</option></select>
                       <input type="text" name="emergency1.mobile" placeholder="Enter mobile number" style={{ flex: 1 }} required onChange={handleInputChange} />
                     </div>
                   </div>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Emergency Contact 2</p>
                <div className="input-group">
                   <div className="input-field">
                     <label>Relation <span>*</span></label>
                     <input type="text" name="emergency2.relation" placeholder="Enter relation" required onChange={handleInputChange} />
                   </div>
                   <div className="input-field">
                     <label>Name <span>*</span></label>
                     <input type="text" name="emergency2.name" placeholder="Enter full name" required onChange={handleInputChange} />
                   </div>
                   <div className="input-field">
                     <label>Mobile Number <span>*</span></label>
                     <div className="phone-input-group">
                       <select className="country-code"><option>🇮🇳 +91</option></select>
                       <input type="text" name="emergency2.mobile" placeholder="Enter mobile number" style={{ flex: 1 }} required onChange={handleInputChange} />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" disabled={loading} onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {loading ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
