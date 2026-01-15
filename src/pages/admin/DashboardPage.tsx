import React from 'react';
import Dashboard from '../../components/admin/Dashboard';
import './AdminPage.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="admin-page">
      <Dashboard />
    </div>
  );
};

export default DashboardPage;