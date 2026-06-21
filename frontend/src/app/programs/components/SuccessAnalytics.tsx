'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '@/components/ui/AppIcon';

interface SuccessData {
    program: string;
    successRate: number;
    averageImprovement: number;
    studentsEnrolled: number;
    topScorers: number;
}

interface SuccessAnalyticsProps {
    data: SuccessData[];
}

export default function SuccessAnalytics({ data }: SuccessAnalyticsProps) {
    const [viewType, setViewType] = useState<'bar' | 'line'>('bar');

    const chartData = data.map(item => ({
        name: item.program.split(' ')[0],
        'Success Rate': item.successRate,
        'Avg Improvement': item.averageImprovement,
    }));

    return (
        <div className="bg-card rounded-lg sm:rounded-xl shadow-subtle border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-success to-brand-primary p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Success Rate Analytics</h3>
                <p className="text-white/90 text-xs sm:text-sm">Track performance metrics across all programs</p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* View Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-2">
                        <Icon name="ChartBarIcon" size={18} className="sm:block w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                        <span className="text-xs sm:text-sm font-semibold text-text-primary">Visualization Type</span>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                        <button
                            onClick={() => setViewType('bar')}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-smooth ${viewType === 'bar' ? 'bg-brand-primary text-white' : 'bg-surface text-text-secondary hover:bg-brand-primary/10'
                                }`}
                        >
                            Bar
                        </button>
                        <button
                            onClick={() => setViewType('line')}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-smooth ${viewType === 'line' ? 'bg-brand-primary text-white' : 'bg-surface text-text-secondary hover:bg-brand-primary/10'
                                }`}
                        >
                            Line
                        </button>
                    </div>
                </div>

                {/* Chart */}
                <div className="w-full h-64 sm:h-80" aria-label="Program Success Rate Analytics Chart">
                    <ResponsiveContainer width="100%" height="100%">
                        {viewType === 'bar' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="Success Rate" fill="#2563eb" radius={[8, 8, 0, 0]} />
                                <Bar dataKey="Avg Improvement" fill="#10b981" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        ) : (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Line type="monotone" dataKey="Success Rate" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} />
                                <Line type="monotone" dataKey="Avg Improvement" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    {data.map((item, index) => (
                        <div key={index} className="bg-surface rounded-lg p-3 sm:p-4 border border-border">
                            <div className="text-xs font-medium text-text-secondary mb-2 truncate">{item.program}</div>
                            <div className="space-y-1.5 sm:space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-secondary">Success</span>
                                    <span className="text-xs sm:text-sm font-bold text-success">{item.successRate}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-secondary">Improve</span>
                                    <span className="text-xs sm:text-sm font-bold text-brand-primary">+{item.averageImprovement}%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-secondary">Students</span>
                                    <span className="text-xs sm:text-sm font-bold text-text-primary">{item.studentsEnrolled}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-text-secondary">Top</span>
                                    <span className="text-xs sm:text-sm font-bold text-accent">{item.topScorers}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Key Insights */}
                <div className="bg-brand-primary/5 rounded-lg p-3 sm:p-5 border border-brand-primary/20">
                    <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-3 flex items-center">
                        <Icon name="LightBulbIcon" size={16} className="sm:block w-4 h-4 sm:w-4.5 sm:h-4.5 text-accent mr-2" />
                        Key Insights
                    </h4>
                    <ul className="space-y-1.5 sm:space-y-2">
                        <li className="flex items-start space-x-2 text-xs sm:text-sm text-text-secondary">
                            <Icon name="CheckCircleIcon" size={14} className="sm:block w-3.5 h-3.5 sm:w-4 sm:h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Average success rate across all programs: <strong className="text-text-primary">95%</strong></span>
                        </li>
                        <li className="flex items-start space-x-2 text-xs sm:text-sm text-text-secondary">
                            <Icon name="CheckCircleIcon" size={14} className="sm:block w-3.5 h-3.5 sm:w-4 sm:h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Students show an average improvement of <strong className="text-text-primary">35%</strong> within 6 months</span>
                        </li>
                        <li className="flex items-start space-x-2 text-xs sm:text-sm text-text-secondary">
                            <Icon name="CheckCircleIcon" size={14} className="sm:block w-3.5 h-3.5 sm:w-4 sm:h-4 text-success mt-0.5 flex-shrink-0" />
                            <span>Over <strong className="text-text-primary">500+ students</strong> have achieved academic excellence with us</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}