import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './Dashboard';
import Employees from './pages/Employees';
import EmployeeDetails from './pages/EmployeeDetails';
import AddEmployee from './pages/AddEmployee';
import Projects from './pages/Projects';
import Timesheet from './pages/Timesheet';
import LeaveRequests from './pages/LeaveRequests';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Holidays from './pages/Holidays';
import Login from './pages/Login';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  useEffect(() => {
    // DevTools Blocking Logic
    const blockDevTools = import.meta.env.VITE_BLOCK_DEVTOOLS === 'true';
    
    if (blockDevTools) {
      const handleContextMenu = (e) => e.preventDefault();
      const handleKeyDown = (e) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);

      // Advanced debugger blocking
      const interval = setInterval(() => {
        (function() {
          try {
            (function(a) {
              if (("" + a / a).length !== 1 || a % 20 === 0) {
                (function() {}.constructor("debugger")());
              } else {
                (function() {}.constructor("debugger")());
              }
              a++;
            })(0);
          } catch (e) {}
        })();
      }, 1000);

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
        clearInterval(interval);
      };
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#334155',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '0.875rem',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#0f172a',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/employees/add" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
          <Route path="/employees/:id" element={<ProtectedRoute><EmployeeDetails /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/timesheet" element={<ProtectedRoute><Timesheet /></ProtectedRoute>} />
          <Route path="/leave" element={<ProtectedRoute><LeaveRequests /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetails /></ProtectedRoute>} />
          <Route path="/holidays" element={<ProtectedRoute><Holidays /></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
