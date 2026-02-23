import React from 'react';
import StatCard from '../components/ui/StatCard';
import ActionButton from '../components/ui/ActionButton';
import StatusBadge from '../components/ui/StatusBadge';

const SupplierPortal = () => {
  return (
    <div className="portal-wrapper">
      <header className="portal-header">
        <div className="title-area">
          <h1>Supplier Portal</h1>
          <p>Manage supplier relationships and procurement</p>
        </div>
        <div className="action-area">
          <ActionButton label="Manage Vendors" icon="👁️" />
          <ActionButton label="Analytics" icon="👁️" />
          <ActionButton label="Vendor Directory" icon="🏢" />
          <ActionButton label="Add Vendor" icon="+" variant="primary" />
        </div>
      </header>

      <div className="stats-grid">
        <StatCard title="Total Vendors" value="87" subtext="Active suppliers" color="orange" icon="🏢" />
        <StatCard title="Pending Approvals" value="5" subtext="Awaiting review" color="yellow" icon="👥" />
        <StatCard title="Avg. Reliability" value="8.5/10" subtext="Supplier performance" color="green" icon="🏅" />
        <StatCard title="Total Contracts" value="142" subtext="Active agreements" color="blue" icon="📈" />
      </div>

      <div className="recent-vendors-section">
        <div className="section-header">
          <div className="section-title">
            <span className="orange-icon">🏢</span>
            <h3>Recent Vendors</h3>
          </div>
          <div className="ai-badge">✨ AI Optimized</div>
        </div>
        <div className="vendor-list-content">
          <p>Vendor list will appear here...</p>
        </div>
      </div>
    </div>
  );
};

export default SupplierPortal;