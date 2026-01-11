import React, { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Plus, Search, Filter, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const Transactions = () => {
    const { user } = useAuth()
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const fetchTransactions = async () => {
            try {
                const { data, error } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('date', { ascending: false })

                if (error) {
                    throw error
                }

                if (data) {
                    setTransactions(data)
                }
            } catch (error) {
                console.error('Error fetching transactions:', error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [user])

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1>Transactions</h1>
                    <p className="text-muted">Manage your income and expenses</p>
                </div>
                <Link to="/transactions/add">
                    <Button className="flex-center" style={{ gap: '0.5rem' }}>
                        <Plus size={18} />
                        Add Transaction
                    </Button>
                </Link>
            </div>

            <Card>
                <div className="flex-between" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            style={{ paddingLeft: '2.5rem', background: 'rgba(255,255,255,0.03)' }}
                        />
                    </div>
                    <Button variant="outline" className="flex-center" style={{ gap: '0.5rem' }}>
                        <Filter size={18} />
                        Filter
                    </Button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '1rem' }}>Transaction</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No transactions found. Add one to get started!
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    background: tx.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {tx.type === 'income' ? <ArrowDownLeft size={16} className="text-success" /> : <ArrowUpRight size={16} className="text-danger" />}
                                                </div>
                                                <span style={{ fontWeight: 500 }}>{tx.title}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{tx.category || '-'}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{tx.date}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '100px',
                                                fontSize: '0.8rem',
                                                background: tx.status === 'Completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                                color: tx.status === 'Completed' ? 'var(--success)' : 'var(--warning)'
                                            }}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
                                            {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}

export default Transactions
