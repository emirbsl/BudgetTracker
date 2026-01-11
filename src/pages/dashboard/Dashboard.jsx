import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        income: 0,
        expenses: 0,
        balance: 0
    })
    const [recentTransactions, setRecentTransactions] = useState([])
    const [activityData, setActivityData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return

            try {
                // 1. Fetch All Transactions for Stats
                const { data: allTx, error: statsError } = await supabase
                    .from('transactions')
                    .select('amount, type, date')
                    .eq('user_id', user.id)

                if (statsError) throw statsError

                // Calculate Stats
                let totalIncome = 0
                let totalExpenses = 0

                // For Activity Chart (Last 7 Days)
                const last7Days = [...Array(7)].map((_, i) => {
                    const d = new Date()
                    d.setDate(d.getDate() - (6 - i))
                    return d.toISOString().split('T')[0]
                })

                const dailyActivity = last7Days.reduce((acc, date) => {
                    acc[date] = 0
                    return acc
                }, {})

                if (allTx) {
                    allTx.forEach(tx => {
                        const amount = Number(tx.amount)
                        if (tx.type === 'income') {
                            totalIncome += amount
                        } else {
                            totalExpenses += amount
                            // Add to daily activity if it's an expense within last 7 days
                            if (dailyActivity[tx.date] !== undefined) {
                                dailyActivity[tx.date] += amount
                            }
                        }
                    })
                }

                setStats({
                    income: totalIncome,
                    expenses: totalExpenses,
                    balance: totalIncome - totalExpenses
                })

                // Format Chart Data
                const chartData = Object.keys(dailyActivity).map(date => {
                    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
                    return { name: dayName, amount: dailyActivity[date] }
                })
                setActivityData(chartData)

                // 2. Fetch Recent Transactions (Limit 5)
                const { data: recentTx, error: recentError } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('date', { ascending: false })
                    .limit(5)

                if (recentError) throw recentError

                setRecentTransactions(recentTx || [])

            } catch (error) {
                console.error('Error fetching dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user])

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
                    {loading ? (
                        <h2>...</h2>
                    ) : (
                        <h2 style={{ color: stats.balance >= 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
                            ${stats.balance.toLocaleString()}
                        </h2>
                    )}
                    <div className="text-sm text-muted">Current net worth</div>
                </Card>

                <Card className="glass-card">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <span className="text-muted">Total Income</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}>
                            <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
                        </div>
                    </div>
                    {loading ? <h2>...</h2> : <h2>${stats.income.toLocaleString()}</h2>}
                    <div className="text-sm text-muted">Lifetime income</div>
                </Card>

                <Card className="glass-card">
                    <div className="flex-between" style={{ marginBottom: '1rem' }}>
                        <span className="text-muted">Total Expenses</span>
                        <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                            <TrendingDown size={20} className="text-danger" />
                        </div>
                    </div>
                    {loading ? <h2>...</h2> : <h2>${stats.expenses.toLocaleString()}</h2>}
                    <div className="text-sm text-muted">Lifetime spending</div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Chart Section */}
                <Card title="Spending Activity (Last 7 Days)">
                    <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    formatter={(value) => [`$${value}`, 'Spending']}
                                />
                                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Recent Transactions */}
                <Card title="Recent Transactions" action={<a href="/transactions" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>View All</a>}>
                    <div style={{ marginTop: '1rem' }}>
                        {loading ? (
                            <p className="text-muted">Loading transactions...</p>
                        ) : recentTransactions.length === 0 ? (
                            <p className="text-muted">No recent transactions.</p>
                        ) : (
                            recentTransactions.map(tx => (
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
                                        {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
