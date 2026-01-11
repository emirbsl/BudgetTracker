import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard,
    History,
    PlusCircle,
    CreditCard,
    PieChart,
    PiggyBank,
    Users,
    User,
    Settings,
    LogOut,
    Wallet
} from 'lucide-react'

const Layout = () => {
    const { signOut, user, userProfile } = useAuth()
    const location = useLocation()

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: History, label: 'Transactions', path: '/transactions' },
        { icon: PlusCircle, label: 'Add New', path: '/transactions/add' },
        { icon: CreditCard, label: 'Subscriptions', path: '/subscriptions' },
        { icon: Wallet, label: 'Budgets', path: '/budgets' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: PiggyBank, label: 'Savings', path: '/savings' },
        { icon: Users, label: 'Split Bill', path: '/split' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ]

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--bg-secondary)',
                borderRight: '1px solid var(--glass-border)',
                position: 'fixed',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem'
            }}>
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={20} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, background: 'linear-gradient(to right, #fff, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        BudgetTracker
                    </h2>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto' }}>
                    <ul style={{ listStyle: 'none' }}>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = location.pathname === item.path
                            return (
                                <li key={item.path} style={{ marginBottom: '0.5rem' }}>
                                    <Link
                                        to={item.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem 1rem',
                                            borderRadius: 'var(--radius-sm)',
                                            textDecoration: 'none',
                                            color: isActive ? 'white' : 'var(--text-muted)',
                                            background: isActive ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0) 100%)' : 'transparent',
                                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Icon size={20} />
                                        <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0 0.5rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                            <User size={18} />
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                {userProfile?.first_name || userProfile?.last_name
                                    ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim()
                                    : user?.email}
                            </p>
                            {(userProfile?.first_name || userProfile?.last_name) && (
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={signOut}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.75rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            borderRadius: 'var(--radius-sm)',
                            justifyContent: 'center',
                            fontWeight: 500
                        }}
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '260px', padding: '2rem', width: 'calc(100% - 260px)' }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Layout
