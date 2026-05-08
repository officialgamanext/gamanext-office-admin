import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './../CSS/StatCard.css';

const StatCard = ({ label, value, trend, trendType, icon, iconBg, iconColor }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrapper" style={{ background: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        <div className={`stat-trend ${trendType === 'up' ? 'trend-up' : 'trend-down'}`}>
          {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{trend}</span>
          <span className="trend-text">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
