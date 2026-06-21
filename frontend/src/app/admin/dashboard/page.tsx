'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface DashboardData {
  totalEnquiries: number;
  totalCampusVisits: number;
  enrolledStudents: number;
  recentActivityCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'visits' | 'settings'>(
    'overview'
  );

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }

    fetchDashboardData(token);
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`
        : 'http://localhost:5000/api/admin/dashboard';

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Vertex Academy Management System</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
          >
            <Icon name="ArrowLeftOnRectangleIcon" className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        {activeTab === 'overview' && dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon="EnvelopeIcon"
              label="Total Enquiries"
              value={dashboardData.totalEnquiries}
              trend="+12% from last month"
              color="blue"
            />
            <StatCard
              icon="MapPinIcon"
              label="Campus Visits"
              value={dashboardData.totalCampusVisits}
              trend="+8% from last month"
              color="green"
            />
            <StatCard
              icon="UserGroupIcon"
              label="Enrolled Students"
              value={dashboardData.enrolledStudents}
              trend="+24% from last month"
              color="purple"
            />
            <StatCard
              icon="SparklesIcon"
              label="Recent Activity"
              value={dashboardData.recentActivityCount}
              trend="Last 7 days"
              color="orange"
            />
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-700">
          {['overview', 'inquiries', 'visits', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'inquiries' && (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Enrollment Inquiries</h2>
              <p className="text-slate-400">Inquiry management features coming soon...</p>
            </div>
          )}

          {activeTab === 'visits' && (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Campus Visit Requests</h2>
              <p className="text-slate-400">Visit request management features coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Settings</h2>
              <p className="text-slate-400">Admin settings coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  trend: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard = ({ icon, label, value, trend, color }: StatCardProps) => {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  };

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
  };

  return (
    <div
      className={`bg-white/[0.04] ${colors[color]} backdrop-blur-xl border rounded-xl p-6 hover:shadow-lg transition-shadow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-slate-700/50 ${iconColors[color]}`}>
          <Icon name={icon} className="w-6 h-6" />
        </div>
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className="text-xs text-slate-500">{trend}</p>
    </div>
  );
};
