import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Plus, Edit2, X, Save } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const Budgets = () => {
    const { user } = useAuth()
    const [budgets, setBudgets] = useState([])
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBudget, setEditingBudget] = useState(null)
    const [formData, setFormData] = useState({
        category: '',
        limit_amount: ''
    })

    // Categories for selection
    const CATEGORIES = [
        'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other'
    ]

    const fetchData = async () => {
        try {
            setLoading(true)
            // 1. Fetch Budgets
            const { data: budgetData, error: budgetError } = await supabase
                .from('budgets')
                .select('*')
                .eq('user_id', user.id)

            if (budgetError) throw budgetError

            // 2. Fetch Transactions (current month) to calculate spent
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
            const { data: txData, error: txError } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .eq('type', 'expense')
                .gte('date', startOfMonth)

            if (txError) throw txError

            setBudgets(budgetData || [])
            setTransactions(txData || [])
        } catch (error) {
            console.error('Error fetching data:', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const handleSaveBudget = async (e) => {
        e.preventDefault()
        try {
            if (editingBudget) {
                // Update
                const { error } = await supabase
                    .from('budgets')
                    .update({ limit_amount: parseFloat(formData.limit_amount) })
                    .eq('id', editingBudget.id)
                    .eq('user_id', user.id)

                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('budgets')
                    .insert([{
                        user_id: user.id,
                        category: formData.category,
                        limit_amount: parseFloat(formData.limit_amount)
                    }])

                if (error) throw error
            }

            closeModal()
            fetchData()
        } catch (error) {
            alert('Error saving budget: ' + error.message)
        }
    }

    const openModal = (budget = null) => {
        if (budget) {
            setEditingBudget(budget)
            setFormData({ category: budget.category, limit_amount: budget.limit_amount })
        } else {
            setEditingBudget(null)
            setFormData({ category: CATEGORIES[0], limit_amount: '' })
        }
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingBudget(null)
        setFormData({ category: '', limit_amount: '' })
    }

    // Process data for UI
    const processedBudgets = budgets.map(budget => {
        const spent = transactions
            .filter(t => t.category && t.category.toLowerCase() === budget.category.toLowerCase())
            .reduce((acc, curr) => acc + Number(curr.amount), 0)

        return {
            ...budget,
            spent,
            percentage: Math.min((spent / budget.limit_amount) * 100, 100),
            isOver: spent > budget.limit_amount
        }
    })

    const totalBudget = processedBudgets.reduce((acc, curr) => acc + curr.limit_amount, 0)
    const totalSpent = processedBudgets.reduce((acc, curr) => acc + curr.spent, 0)
    const totalPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Monthly Budgets</h1>
                    <p className="text-muted">Set limits to save more</p>
                </div>
                <Button className="flex-center" style={{ gap: '0.5rem' }} onClick={() => openModal()}>
                    <Plus size={18} />
                    Set New Budget
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(250px, 1fr)', gap: '2rem', alignItems: 'start' }}>

                {/* Budget List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {loading ? (
                        <p className="text-muted">Loading budgets...</p>
                    ) : processedBudgets.length === 0 ? (
                        <p className="text-muted">No budgets set. Click "Set New Budget" to start.</p>
                    ) : (
                        processedBudgets.map(budget => (
                            <Card key={budget.id} className="glass-card">
                                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {/* Simple color mapping or random */}
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                        <h4 style={{ margin: 0 }}>{budget.category}</h4>
                                    </div>
                                    <div style={{ fontWeight: 600 }}>
                                        ${budget.spent.toFixed(2)} <span className="text-muted" style={{ fontWeight: 400 }}>/ ${budget.limit_amount}</span>
                                    </div>
                                </div>

                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', margin: '0.75rem 0' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${budget.percentage}%`,
                                        background: budget.isOver ? 'var(--danger)' : 'var(--success)',
                                        transition: 'width 0.5s ease'
                                    }}></div>
                                </div>

                                <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                                    <span className="text-muted">{budget.isOver ? 'Over budget!' : `${(100 - budget.percentage).toFixed(0)}% remaining`}</span>
                                    <Button variant="outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', gap: '0.25rem' }} onClick={() => openModal(budget)}>
                                        <Edit2 size={12} /> Edit
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* Summary Chart */}
                <div style={{ position: 'sticky', top: '2rem' }}>
                    <Card title="Summary" className="glass-card">
                        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                            <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
                                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="4"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="var(--primary)"
                                        strokeWidth="4"
                                        strokeDasharray={`${totalPercentage > 100 ? 100 : totalPercentage}, 100`}
                                    />
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalPercentage.toFixed(0)}%</div>
                                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Spent</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p className="text-muted">Total Budget: <span style={{ color: 'var(--text-primary)' }}>${totalBudget.toLocaleString()}</span></p>
                            <p className="text-muted">Total Spent: <span style={{ color: 'var(--danger)' }}>${totalSpent.toLocaleString()}</span></p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ width: '100%', maxWidth: '400px', margin: '1rem' }}>
                        <Card
                            title={editingBudget ? "Edit Budget" : "Set New Budget"}
                            action={<button onClick={closeModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>}
                        >
                            <form onSubmit={handleSaveBudget}>
                                <div className="input-group" style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                        disabled={!!editingBudget} // Disable category edit to keep unique constraint simple
                                        style={editingBudget ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    label="Limit Amount ($)"
                                    type="number"
                                    value={formData.limit_amount}
                                    onChange={(e) => setFormData({ ...formData, limit_amount: e.target.value })}
                                    required
                                />
                                <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
                                    {editingBudget ? 'Update Limit' : 'Set Budget'}
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Budgets
