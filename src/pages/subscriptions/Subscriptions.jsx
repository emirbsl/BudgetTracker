import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Plus, Calendar, AlertCircle, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const Subscriptions = () => {
    const { user } = useAuth()
    const [subscriptions, setSubscriptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        cycle: 'Monthly',
        next_payment_date: ''
    })

    const fetchSubscriptions = async () => {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .order('next_payment_date', { ascending: true })

            if (error) throw error
            if (data) setSubscriptions(data)
        } catch (error) {
            console.error('Error fetching subscriptions:', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchSubscriptions()
        }
    }, [user])

    const handleAddSubscription = async (e) => {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from('subscriptions')
                .insert([
                    {
                        user_id: user.id,
                        name: formData.name,
                        price: parseFloat(formData.price),
                        cycle: formData.cycle,
                        next_payment_date: formData.next_payment_date
                    }
                ])

            if (error) throw error

            setIsModalOpen(false)
            setFormData({ name: '', price: '', cycle: 'Monthly', next_payment_date: '' })
            fetchSubscriptions() // Refresh list
        } catch (error) {
            alert('Error adding subscription: ' + error.message)
        }
    }

    const totalMonthly = subscriptions
        .filter(s => s.cycle === 'Monthly')
        .reduce((acc, curr) => acc + curr.price, 0) || 0

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Subscriptions</h1>
                    <p className="text-muted">Track your recurring payments</p>
                </div>
                <Button className="flex-center" style={{ gap: '0.5rem' }} onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} />
                    Add Subscription
                </Button>
            </div>

            <div className="grid-responsive">
                {/* Summary Card */}
                <Card className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.4) 0%, rgba(15, 23, 42, 0) 100%)' }}>
                    <div className="flex-between">
                        <div>
                            <p className="text-muted">Total Monthly Cost</p>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: 0 }}>${totalMonthly.toFixed(2)}</h2>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                            <Calendar size={32} />
                        </div>
                    </div>
                </Card>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Active Subscriptions</h3>

            {loading ? (
                <p className="text-muted">Loading subscriptions...</p>
            ) : subscriptions.length === 0 ? (
                <p className="text-muted">No subscriptions found. Add one above.</p>
            ) : (
                <div className="grid-responsive">
                    {subscriptions.map(sub => (
                        <Card key={sub.id} className="glass-card">
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '48px', height: '48px', borderRadius: '12px',
                                        background: 'var(--bg-secondary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.25rem', fontWeight: 700,
                                        border: '1px solid var(--glass-border)'
                                    }}>
                                        {sub.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{sub.name}</h4>
                                        <span className="text-muted text-sm">{sub.cycle} Plan</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>${sub.price}</div>
                                </div>
                            </div>
                            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                                <span className="text-muted">Next billing: <span style={{ color: 'var(--text-primary)' }}>{sub.next_payment_date}</span></span>
                                <span style={{ color: 'var(--success)', fontWeight: 500 }}>Active</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Simple Modal Implementation */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ width: '100%', maxWidth: '500px', margin: '1rem' }}>
                        <Card title="Add Subscription" action={<button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>}>
                            <form onSubmit={handleAddSubscription}>
                                <Input
                                    label="Service Name"
                                    placeholder="Netflix, Spotify..."
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <Input
                                        label="Price ($)"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cycle</label>
                                        <select
                                            value={formData.cycle}
                                            onChange={(e) => setFormData({ ...formData, cycle: e.target.value })}
                                            required
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>
                                <Input
                                    label="Next Payment Date"
                                    type="date"
                                    value={formData.next_payment_date}
                                    onChange={(e) => setFormData({ ...formData, next_payment_date: e.target.value })}
                                    required
                                />
                                <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Add Subscription</Button>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Subscriptions
