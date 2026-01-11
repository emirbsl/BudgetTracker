import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

const AddTransaction = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0]
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const { error } = await supabase
                .from('transactions')
                .insert([
                    {
                        ...formData,
                        user_id: user.id
                    }
                ])

            if (error) throw error

            navigate('/transactions')
        } catch (error) {
            console.error('Error adding transaction:', error)
            alert('Error adding transaction: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', border: 'none', cursor: 'pointer' }}>
                <ChevronLeft size={20} />
                Back to Transactions
            </button>

            <Card title="Add New Transaction">
                <form onSubmit={handleSubmit}>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'income' })}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: formData.type === 'income' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${formData.type === 'income' ? 'var(--success)' : 'transparent'}`,
                                color: formData.type === 'income' ? 'var(--success)' : 'var(--text-muted)',
                                fontWeight: 600
                            }}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: formData.type === 'expense' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${formData.type === 'expense' ? 'var(--danger)' : 'transparent'}`,
                                color: formData.type === 'expense' ? 'var(--danger)' : 'var(--text-muted)',
                                fontWeight: 600
                            }}
                        >
                            Expense
                        </button>
                    </div>

                    <Input
                        label="Amount ($)"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        style={{ fontSize: '1.5rem', fontWeight: 600 }}
                    />

                    <Input
                        label="Description"
                        placeholder="e.g. Grocery Shopping"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="food">Food & Dining</option>
                                <option value="transport">Transportation</option>
                                <option value="shopping">Shopping</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="bills">Bills & Utilities</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input
                            label="Date"
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <Button type="submit" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Transaction'}
                    </Button>

                </form>
            </Card>
        </div>
    )
}

export default AddTransaction
