import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Users, UserPlus, Save, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const Split = () => {
    const { user } = useAuth()
    const [splits, setSplits] = useState([])
    const [loading, setLoading] = useState(true)

    // Quick Split Form
    const [formData, setFormData] = useState({
        name: '',
        total_amount: '',
        number_of_people: ''
    })
    const [calculatedAmount, setCalculatedAmount] = useState(0)

    const fetchSplits = async () => {
        try {
            const { data, error } = await supabase
                .from('bill_splits')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) setSplits(data)
        } catch (error) {
            console.error('Error fetching splits:', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchSplits()
        }
    }, [user])

    // Calculate per person amount
    useEffect(() => {
        if (formData.total_amount && formData.number_of_people > 0) {
            const res = parseFloat(formData.total_amount) / parseInt(formData.number_of_people)
            setCalculatedAmount(res)
        } else {
            setCalculatedAmount(0)
        }
    }, [formData.total_amount, formData.number_of_people])

    const handleSaveSplit = async (e) => {
        e.preventDefault()
        try {
            if (!calculatedAmount) return

            const { error } = await supabase
                .from('bill_splits')
                .insert([{
                    user_id: user.id,
                    name: formData.name || 'Quick Split',
                    total_amount: parseFloat(formData.total_amount),
                    number_of_people: parseInt(formData.number_of_people),
                    amount_per_person: calculatedAmount,
                    status: 'Pending'
                }])

            if (error) throw error

            setFormData({ name: '', total_amount: '', number_of_people: '' })
            fetchSplits()
        } catch (error) {
            alert('Error saving split: ' + error.message)
        }
    }

    const handleMarkPaid = async (id) => {
        try {
            const { error } = await supabase
                .from('bill_splits')
                .update({ status: 'Paid' })
                .eq('id', id)

            if (error) throw error
            fetchSplits()
        } catch (error) {
            console.error('Error updating status:', error.message)
        }
    }

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Bill Splitter</h1>
                    <p className="text-muted">Share expenses with friends</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                <Card title="Quick Split & Save">
                    <form onSubmit={handleSaveSplit}>
                        <Input
                            label="Description (Optional)"
                            placeholder="e.g. Dinner, Rent"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label="Total Amount ($)"
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.total_amount}
                            onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                            required
                        />
                        <Input
                            label="Number of People"
                            type="number"
                            placeholder="2"
                            value={formData.number_of_people}
                            onChange={(e) => setFormData({ ...formData, number_of_people: e.target.value })}
                            required
                        />
                        <div style={{ textAlign: 'center', margin: '1.5rem 0', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                            <p className="text-muted">Each person pays</p>
                            <h2 style={{ color: 'var(--primary)' }}>${calculatedAmount.toFixed(2)}</h2>
                        </div>
                        <Button type="submit" style={{ width: '100%', gap: '0.5rem' }} className="flex-center">
                            <Save size={18} /> Save to History
                        </Button>
                    </form>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3>Active Splits History</h3>
                    {loading ? (
                        <p className="text-muted">Loading history...</p>
                    ) : splits.length === 0 ? (
                        <p className="text-muted">No split history found.</p>
                    ) : (
                        splits.map(split => (
                            <Card key={split.id} className="glass-card">
                                <div className="flex-between">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.2)', borderRadius: '12px' }}>
                                            <Users size={20} style={{ color: 'var(--accent)' }} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{split.name}</h4>
                                            <span className="text-muted text-sm">
                                                ${parseFloat(split.total_amount).toFixed(2)} / {split.number_of_people} people
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>${parseFloat(split.amount_per_person).toFixed(2)}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                color: split.status === 'Paid' ? 'var(--success)' : 'var(--warning)',
                                                fontWeight: 500
                                            }}>
                                                {split.status}
                                            </span>
                                            {split.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleMarkPaid(split.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)', padding: 0 }}
                                                    title="Mark as Paid"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

            </div>
        </div>
    )
}

export default Split
