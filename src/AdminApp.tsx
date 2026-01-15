import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import AdminNavbar from './components/admin/AdminNavbar';
import DashboardPage from './pages/admin/DashboardPage';
import FoldersPage from './pages/admin/FoldersPage';
import FolderDetailPage from './pages/admin/FolderDetailPage';
import PhotosPage from './pages/admin/PhotosPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import ReportsPage from './pages/admin/ReportsPage';
import SettingsPage from './pages/admin/SettingsPage';

const AdminApp: React.FC = () => {
  return (
    <Router>
      <div className="admin-app">
        <AdminNavbar />
        
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/folders" element={<FoldersPage />} />
          <Route path="/admin/folders/:folderName" element={<FolderDetailPage />} />
          <Route path="/admin/photos" element={<PhotosPage />} />
          <Route path="/admin/payments" element={<PaymentsPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AdminApp;