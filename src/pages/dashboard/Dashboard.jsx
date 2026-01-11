import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
    const { user } = useAuth()
    const [stats, setStats] = useState({
        income: 0,
        expenses: 0,
        balance: 0,
        monthlyBudget: 2000 // Mock default
    })
    const [recentTransactions, setRecentTransactions] = useState([])

    // NOTE: This will fail until Supabase tables are created. 
    // We will handle errors gracefully to show UI.
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return

            try {
                // Mocking data fetching for MVP display if DB is empty/missing
                // In real app: Fetch from 'transactions' table

                // Simulating data
                setStats({
                    income: 4500,
                    expenses: 1250,
                    balance: 3250,
                    monthlyBudget: 3000
                })

                setRecentTransactions([
                    { id: 1, title: 'Freelance Project', amount: 1200, type: 'income', date: '2023-11-01' },
                    { id: 2, title: 'Grocery', amount: 150, type: 'expense', date: '2023-11-02' },
                    { id: 3, title: 'Netflix', amount: 15, type: 'expense', date: '2023-11-03' },
                ])
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            }
        }
        fetchData()
    }, [user])

    const chartData = [
        { name: 'Mon', amount: 400 },
        { name: 'Tue', amount: 300 },
        { name: 'Wed', amount: 200 },
        { name: 'Thu', amount: 500 },
        { name: 'Fri', amount: 100 },
        { name: 'Sat', amount: 700 },
        { name: 'Sun', amount: 300 },
    ]

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
                <p className="text-muted">Welcome back, {user?.email}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid-responsive" style={{ marginBottom: '2rem' }}>
                <Card className="glass-card">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <span className="text-muted">Total Balance</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                            <DollarSign size={20} className="text-success" />
                        </div>
                    </div>
                    <h2>${stats.balance.toLocaleString()}</h2>
                    <div className="text-sm">
                        <span className="text-success">+12%</span> from last month
                    </div>
                </Card>

                <Card className="glass-card">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <span className="text-muted">Monthly Income</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}>
                            <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
                        </div>
                    </div>
                    <h2>${stats.income.toLocaleString()}</h2>
                    <div className="text-sm">
                        <span className="text-success">+5%</span> from last month
                    </div>
                </Card>

                <Card className="glass-card">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <span className="text-muted">Total Expenses</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                            <TrendingDown size={20} className="text-danger" />
                        </div>
                    </div>
                    <h2>${stats.expenses.toLocaleString()}</h2>
                    <div className="text-sm">
                        <span className="text-danger">+2%</span> from last month
                    </div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Chart Section */}
                <Card title="Activity Overview">
                    <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Transactions */}
                <Card title="Recent Transactions" action={<a href="/transactions" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>View All</a>}>
                    <div style={{ marginTop: '1rem' }}>
                        {recentTransactions.map(tx => (
                            <div key={tx.id} className="flex-between" style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {tx.type === 'income' ? <TrendingUp size={18} className="text-success" /> : <TrendingDown size={18} className="text-danger" />}
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 500 }}>{tx.title}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.date}</p>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 600, color: tx.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
                                    {tx.type === 'income' ? '+' : '-'}${tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
