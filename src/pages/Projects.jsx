import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Briefcase,
  Loader2,
  Trash2,
  Edit3
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import '../CSS/Projects.css';
import '../CSS/Employees.css'; 
import '../CSS/AddEmployee.css'; 

const API_URL = import.meta.env.VITE_API_URL;

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    startDate: '',
    status: 'New'
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/collection/projects`);
      const sorted = response.data.sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
      setProjects(sorted);
    } catch (error) {
      console.error('Error fetching projects:', error);
      if (error.response?.status === 404) {
        setProjects([]);
      } else {
        toast.error('Failed to fetch projects');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({ id: '', name: '', startDate: '', status: 'New' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setIsEditMode(true);
    setFormData(project);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate) {
      toast.error('Please fill in all fields');
      return;
    }

    setSaveLoading(true);
    const loadToast = toast.loading(isEditMode ? 'Updating project...' : 'Creating project...');
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/collection/projects/${formData.id}`, formData);
        toast.success('Project updated successfully!', { id: loadToast });
      } else {
        const projectID = `PRJ${Date.now().toString().slice(-6)}`;
        const projectData = {
          ...formData,
          id: projectID,
          createdAt: new Date().toISOString()
        };
        await axios.post(`${API_URL}/collection/projects/${projectID}`, projectData);
        toast.success('Project created successfully!', { id: loadToast });
      }
      
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error(error.response?.data?.details || 'Failed to save project', { id: loadToast });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (projectID) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const loadToast = toast.loading('Deleting project...');
    try {
      await axios.delete(`${API_URL}/collection/projects/${projectID}`);
      toast.success('Project deleted successfully!', { id: loadToast });
      fetchProjects();
    } catch (error) {
      toast.error('Delete failed', { id: loadToast });
    }
  };

  const filteredProjects = projects.filter(prj => {
    const matchesSearch = prj.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prj.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || prj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div className="projects-container">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Projects</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Manage and track your organizational projects.</p>
            </div>
            <button 
              className="add-employee-btn"
              onClick={handleOpenAdd}
            >
              <Plus size={18} />
              <span>Add Project</span>
            </button>
          </div>

          <div className="table-card">
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
               <div className="search-bar" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input 
                    type="text" 
                    placeholder="Search by name or ID..." 
                    style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Filter size={18} color="#64748b" />
                 <select 
                   style={{ padding: '0.65rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', background: 'white', fontSize: '0.875rem' }}
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                 >
                   <option value="All">All Status</option>
                   <option value="New">New</option>
                   <option value="In Progress">In Progress</option>
                   <option value="Done">Done</option>
                 </select>
               </div>
            </div>

            <table className="project-table">
              <thead>
                <tr>
                  <th>Project ID</th>
                  <th>Project Name</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <Loader2 size={32} className="animate-spin" color="var(--primary)" />
                        <span>Loading projects...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                      {projects.length === 0 ? 'No projects found.' : 'No projects match your filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((prj) => (
                    <tr key={prj.id}>
                      <td><span style={{ color: '#64748b', fontWeight: 500 }}>{prj.id}</span></td>
                      <td><span className="project-name-cell" style={{ fontWeight: 600 }}>{prj.name}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                          <Calendar size={14} /> {prj.startDate}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${prj.status?.toLowerCase().replace(' ', '')}`}>
                          {prj.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                          <button 
                            className="edit-btn" 
                            title="Edit"
                            onClick={() => handleOpenEdit(prj)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f0f9ff', color: '#0ea5e9', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                          <button 
                            className="delete-btn" 
                            title="Delete"
                            onClick={() => handleDelete(prj.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff1f2', color: '#e11d48', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{isEditMode ? 'Edit Project' : 'Add New Project'}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSave}>
                <div className="input-field" style={{ marginBottom: '1.25rem' }}>
                  <label>Project Name <span>*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter project name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="input-field" style={{ marginBottom: '1.25rem' }}>
                  <label>Start Date <span>*</span></label>
                  <input 
                    type="date" 
                    required 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                
                <div className="input-field" style={{ marginBottom: '2rem' }}>
                  <label>Status <span>*</span></label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    style={{ flex: 1, padding: '0.6rem' }}
                    onClick={() => setIsModalOpen(false)}
                    disabled={saveLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-btn" 
                    style={{ flex: 1, padding: '0.6rem', justifyContent: 'center' }}
                    disabled={saveLoading}
                  >
                    {saveLoading ? <Loader2 size={18} className="animate-spin" /> : (isEditMode ? 'Update Project' : 'Save Project')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
