import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const Analytics = () => {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    // Processed Data States
    const [spendingData, setSpendingData] = useState([])
    const [trendData, setTrendData] = useState([])
    const [insights, setInsights] = useState([])

    // Colors for Pie Chart
    const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#6366f1']

    const fetchData = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: true })

            if (error) throw error
            if (data) {
                setTransactions(data)
                processCharts(data)
            }
        } catch (error) {
            console.error('Error fetching analytics:', error.message)
        } finally {
            setLoading(false)
        }
    }

    const processCharts = (data) => {
        // 1. Spending by Category (Pie Chart)
        const expenses = data.filter(t => t.type === 'expense')
        const categoryMap = expenses.reduce((acc, curr) => {
            const cat = curr.category || 'Uncategorized'
            acc[cat] = (acc[cat] || 0) + Number(curr.amount)
            return acc
        }, {})

        const pieData = Object.keys(categoryMap).map((cat, index) => ({
            name: cat,
            value: categoryMap[cat],
            color: COLORS[index % COLORS.length]
        }))
        setSpendingData(pieData)

        // 2. Income vs Expenses (Line Chart - 2026/Current Year)
        // Group by Month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const currentYear = new Date().getFullYear() // 2026 based on prompt context, but utilizing system date is safer or logic can force 2026 if requested.
        // Prompt asked for "2026 yılı verilerime göre", usually implies current active year context

        const monthlyData = months.map((month, index) => {
            const monthTransactions = data.filter(t => {
                const d = new Date(t.date)
                return d.getMonth() === index && d.getFullYear() === currentYear
            })

            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((acc, curr) => acc + Number(curr.amount), 0)

            const expense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((acc, curr) => acc + Number(curr.amount), 0)

            return { name: month, income, expense }
        })
        setTrendData(monthlyData)

        // 3. Generate Insights
        const newInsights = []

        // Insight 1: Highest Spending Category
        if (pieData.length > 0) {
            const highestCat = pieData.reduce((prev, current) => (prev.value > current.value) ? prev : current)
            newInsights.push(`Your highest spending category this year is **${highestCat.name}** ($${highestCat.value.toFixed(0)}).`)
        }

        // Insight 2: Total Savings Rate (Income vs Expense)
        const totalIncome = data.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0)
        const totalExpense = data.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0)

        if (totalIncome > 0) {
            const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100
            if (savingsRate > 0) {
                newInsights.push(`Great job! You've saved **${savingsRate.toFixed(0)}%** of your income overall.`)
            } else {
                newInsights.push(`Alert: Your expenses are exceeding your income by **${Math.abs(savingsRate).toFixed(0)}%**.`)
            }
        }

        // Insight 3: Monthly Average
        const currentMonthIndex = new Date().getMonth() + 1
        if (currentMonthIndex > 0) {
            const avgSpend = totalExpense / currentMonthIndex
            newInsights.push(`Your average monthly spending is **$${avgSpend.toFixed(0)}**.`)
        }

        setInsights(newInsights)
    }

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1>Analytics</h1>
                <p className="text-muted">Visualize your financial habits ({new Date().getFullYear()})</p>
            </div>

            {loading ? (
                <p className="text-muted">Loading analytics...</p>
            ) : transactions.length === 0 ? (
                <p className="text-muted">No data available. Add some transactions to see analytics.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
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
                                    <Tooltip
                                        formatter={(value) => `$${value}`}
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                    />
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
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                                        formatter={(value) => `$${value}`}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="var(--success)" strokeWidth={2} />
                                    <Line type="monotone" dataKey="expense" stroke="var(--danger)" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            )}

            {!loading && insights.length > 0 && (
                <Card title="Insights">
                    {insights.map((text, i) => (
                        <p key={i} style={{ marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: '• ' + text }}></p>
                    ))}
                </Card>
            )}
        </div>
    )
}

export default Analytics
