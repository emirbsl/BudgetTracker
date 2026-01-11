import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Users, UserPlus } from 'lucide-react'

const Split = () => {
    const [splits] = useState([
        { id: 1, title: 'House Rent', total: 1200, myShare: 400, owedTo: 'Landlord', status: 'Paid' },
        { id: 2, title: 'Dinner at Mario\'s', total: 85, myShare: 21.25, owedTo: 'Sarah', status: 'Unpaid' },
    ])

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Bill Splitter</h1>
                    <p className="text-muted">Share expenses with friends</p>
                </div>
                <Button className="flex-center" style={{ gap: '0.5rem' }}>
                    <UserPlus size={18} />
                    Create Group
                </Button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>

                <Card title="Quick Split">
                    <form>
                        <Input label="Total Amount" type="number" placeholder="0.00" />
                        <Input label="Number of People" type="number" placeholder="2" />
                        <div style={{ textAlign: 'center', margin: '1.5rem 0', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                            <p className="text-muted">Each person pays</p>
                            <h2>$0.00</h2>
                        </div>
                        <Button style={{ width: '100%' }}>Calculate</Button>
                    </form>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3>Active Splits</h3>
                    {splits.map(split => (
                        <Card key={split.id} className="glass-card">
                            <div className="flex-between">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.75rem', background: 'rgba(6, 182, 212, 0.2)', borderRadius: '12px' }}>
                                        <Users size={20} style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0 }}>{split.title}</h4>
                                        <span className="text-muted text-sm">Owed by you</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>${split.myShare}</div>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        color: split.status === 'Paid' ? 'var(--success)' : 'var(--warning)'
                                    }}>
                                        {split.status}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Split
