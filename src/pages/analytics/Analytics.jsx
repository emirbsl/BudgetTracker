import React from 'react'
import Card from '../../components/ui/Card'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const Analytics = () => {
    const spendingData = [
        { name: 'Food', value: 350, color: '#8b5cf6' },
        { name: 'Transport', value: 180, color: '#ec4899' },
        { name: 'Entertainment', value: 110, color: '#f59e0b' },
        { name: 'Shopping', value: 45, color: '#10b981' },
        { name: 'Bills', value: 250, color: '#06b6d4' },
    ]

    const trendData = [
        { name: 'Jan', income: 4000, expense: 2400 },
        { name: 'Feb', income: 3000, expense: 1398 },
        { name: 'Mar', income: 2000, expense: 9800 },
        { name: 'Apr', income: 2780, expense: 3908 },
        { name: 'May', income: 1890, expense: 4800 },
        { name: 'Jun', income: 2390, expense: 3800 },
    ]

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1>Analytics</h1>
                <p className="text-muted">Visualize your financial habits</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <Card title="Spending by Category">
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={spendingData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {spendingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Income vs Expenses">
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="var(--success)" strokeWidth={2} />
                                <Line type="monotone" dataKey="expense" stroke="var(--danger)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card title="Insights">
                <p style={{ marginBottom: '0.5rem' }}>• Your spending on <strong>Entertainment</strong> is 10% higher than last month.</p>
                <p style={{ marginBottom: '0.5rem' }}>• Great job! You've saved <strong>20%</strong> of your income this month.</p>
                <p>• Estimated savings for next month: <strong>$540</strong></p>
            </Card>
        </div>
    )
}

export default Analytics
