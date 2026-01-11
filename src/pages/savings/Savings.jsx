import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Plus, Target, Trophy, X, TrendingUp } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const Savings = () => {
    const { user } = useAuth()
    const [goals, setGoals] = useState([])
    const [loading, setLoading] = useState(true)

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState(null)

    // Forms
    const [newGoalData, setNewGoalData] = useState({ name: '', target_amount: '', target_date: '' })
    const [addAmount, setAddAmount] = useState('')

    const fetchGoals = async () => {
        try {
            const { data, error } = await supabase
                .from('savings_goals')
                .select('*')
                .eq('user_id', user.id)
                .order('target_date', { ascending: true })

            if (error) throw error
            if (data) setGoals(data)
        } catch (error) {
            console.error('Error fetching savings goals:', error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchGoals()
        }
    }, [user])

    // Create New Goal
    const handleCreateGoal = async (e) => {
        e.preventDefault()
        try {
            const { error } = await supabase
                .from('savings_goals')
                .insert([{
                    user_id: user.id,
                    name: newGoalData.name,
                    target_amount: parseFloat(newGoalData.target_amount),
                    current_amount: 0,
                    target_date: newGoalData.target_date
                }])

            if (error) throw error

            setIsAddModalOpen(false)
            setNewGoalData({ name: '', target_amount: '', target_date: '' })
            fetchGoals()
        } catch (error) {
            alert('Error creating goal: ' + error.message)
        }
    }

    // Update Amount
    const handleUpdateAmount = async (e) => {
        e.preventDefault()
        try {
            if (!selectedGoal || !addAmount) return

            const newAmount = Number(selectedGoal.current_amount) + Number(addAmount)

            const { error } = await supabase
                .from('savings_goals')
                .update({ current_amount: newAmount })
                .eq('id', selectedGoal.id)
                .eq('user_id', user.id)

            if (error) throw error

            setIsUpdateModalOpen(false)
            setSelectedGoal(null)
            setAddAmount('')
            fetchGoals()
        } catch (error) {
            alert('Error updating savings: ' + error.message)
        }
    }

    const openUpdateModal = (goal) => {
        setSelectedGoal(goal)
        setAddAmount('')
        setIsUpdateModalOpen(true)
    }

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Savings Goals</h1>
                    <p className="text-muted">Dream big, save smart</p>
                </div>
                <Button className="flex-center" style={{ gap: '0.5rem' }} onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} />
                    New Goal
                </Button>
            </div>

            {loading ? (
                <p className="text-muted">Loading goals...</p>
            ) : goals.length === 0 ? (
                <p className="text-muted">No savings goals yet. Create one to get started!</p>
            ) : (
                <div className="grid-responsive">
                    {goals.map(goal => {
                        const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
                        const isCompleted = goal.current_amount >= goal.target_amount

                        return (
                            <Card key={goal.id} className="glass-card">
                                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                    <div style={{ padding: '0.75rem', background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(236, 72, 153, 0.2)', borderRadius: '12px' }}>
                                        {isCompleted ? <Trophy size={24} className="text-success" /> : <Target size={24} className="text-secondary" />}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${Number(goal.current_amount).toLocaleString()}</div>
                                        <div className="text-muted text-sm">of ${Number(goal.target_amount).toLocaleString()}</div>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{goal.name}</h3>

                                <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${progress}%`,
                                        background: isCompleted ? 'var(--success)' : 'linear-gradient(90deg, var(--secondary) 0%, var(--primary) 100%)',
                                        borderRadius: '10px',
                                        transition: 'width 0.5s ease'
                                    }}></div>
                                </div>

                                <div className="flex-between">
                                    <span className="text-muted text-sm">Target: {goal.target_date}</span>
                                    {!isCompleted && (
                                        <Button variant="outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'flex', gap: '0.25rem' }} onClick={() => openUpdateModal(goal)}>
                                            <TrendingUp size={14} /> Add Funds
                                        </Button>
                                    )}
                                    {isCompleted && (
                                        <span style={{ fontWeight: 600, color: 'var(--success)' }}>Completed!</span>
                                    )}
                                </div>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Create Goal Modal */}
            {isAddModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ width: '100%', maxWidth: '400px', margin: '1rem' }}>
                        <Card title="New Savings Goal" action={<button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>}>
                            <form onSubmit={handleCreateGoal}>
                                <Input
                                    label="Goal Name"
                                    placeholder="New Phone, Vacation..."
                                    value={newGoalData.name}
                                    onChange={(e) => setNewGoalData({ ...newGoalData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Target Amount ($)"
                                    type="number"
                                    value={newGoalData.target_amount}
                                    onChange={(e) => setNewGoalData({ ...newGoalData, target_amount: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Target Date"
                                    type="date"
                                    value={newGoalData.target_date}
                                    onChange={(e) => setNewGoalData({ ...newGoalData, target_date: e.target.value })}
                                    required
                                />
                                <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Create Goal</Button>
                            </form>
                        </Card>
                    </div>
                </div>
            )}

            {/* Update Funds Modal */}
            {isUpdateModalOpen && selectedGoal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ width: '100%', maxWidth: '400px', margin: '1rem' }}>
                        <Card title={`Add to ${selectedGoal.name}`} action={<button onClick={() => setIsUpdateModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>}>
                            <form onSubmit={handleUpdateAmount}>
                                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                    <p className="text-muted">Current Saved</p>
                                    <h2 style={{ color: 'var(--primary)' }}>${Number(selectedGoal.current_amount).toLocaleString()}</h2>
                                </div>
                                <Input
                                    label="Amount to Add ($)"
                                    type="number"
                                    placeholder="e.g. 50"
                                    value={addAmount}
                                    onChange={(e) => setAddAmount(e.target.value)}
                                    required
                                    autoFocus
                                />
                                <Button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Add Funds</Button>
                            </form>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Savings
