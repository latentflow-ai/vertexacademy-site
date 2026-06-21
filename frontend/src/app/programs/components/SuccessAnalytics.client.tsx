'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '@/components/ui/AppIcon';

interface SuccessAnalyticsProps {
    data: { label: string; value: number }[];
}

export default function SuccessAnalyticsClient({ data }: SuccessAnalyticsProps) {
    const chartData = data || [];

    return (
        <div>
            <div className="mb-6 flex items-center gap-3">
                <Icon name="ChartBarIcon" size={20} className="text-brand-primary" />
                <h3 className="text-lg font-semibold">Program Success Analytics</h3>
            </div>
            <div className="w-full h-64 sm:h-80" aria-label="Program Success Rate Analytics Chart">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#2563EB" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
