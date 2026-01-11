import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Plus, Target, Trophy } from 'lucide-react'

const Savings = () => {
    const [goals] = useState([
        { id: 1, name: 'New Laptop', target: 2000, current: 1500, deadline: '2023-12-31' },
        { id: 2, name: 'Summer Trip', target: 5000, current: 800, deadline: '2024-06-01' },
        { id: 3, name: 'Emergency Fund', target: 10000, current: 2500, deadline: '2024-12-31' },
    ])

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Savings Goals</h1>
                    <p className="text-muted">Dream big, save smart</p>
                </div>
                <Button className="flex-center" style={{ gap: '0.5rem' }}>
                    <Plus size={18} />
                    New Goal
                </Button>
            </div>

            <div className="grid-responsive">
                {goals.map(goal => {
                    const progress = Math.min((goal.current / goal.target) * 100, 100)

                    return (
                        <Card key={goal.id} className="glass-card">
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <div style={{ padding: '0.75rem', background: 'rgba(236, 72, 153, 0.2)', borderRadius: '12px' }}>
                                    <Target size={24} className="text-secondary" />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>${goal.current.toLocaleString()}</div>
                                    <div className="text-muted text-sm">of ${goal.target.toLocaleString()}</div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{goal.name}</h3>

                            <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                                <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--secondary) 0%, var(--primary) 100%)', borderRadius: '10px' }}></div>
                            </div>

                            <div className="flex-between">
                                <span className="text-muted text-sm">Target: {goal.deadline}</span>
                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{progress.toFixed(0)}%</span>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

export default Savings
