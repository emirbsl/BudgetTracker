import React from 'react'
import Card from '../../components/ui/Card'
import { Bell, Moon, Shield, CreditCard, HelpCircle } from 'lucide-react'

const Settings = () => {
    const items = [
        { icon: Bell, label: 'Notifications', desc: 'Manage your email and push notifications' },
        { icon: Moon, label: 'Appearance', desc: 'Dark theme is enabled by default' },
        { icon: Shield, label: 'Security', desc: 'Change password and 2FA' },
        { icon: CreditCard, label: 'Payment Methods', desc: 'Manage your connected cards' },
        { icon: HelpCircle, label: 'Help & Support', desc: 'FAQ and Contact Support' },
    ]

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Settings</h1>

            <Card className="glass-card">
                {items.map((item, index) => (
                    <div key={index} className="flex-between" style={{ padding: '1.5rem 0', borderBottom: index !== items.length - 1 ? '1px solid var(--glass-border)' : 'none', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                <item.icon size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.label}</h4>
                                <p className="text-muted text-sm" style={{ margin: 0 }}>{item.desc}</p>
                            </div>
                        </div>
                        <div style={{ color: 'var(--text-muted)' }}>&gt;</div>
                    </div>
                ))}
            </Card>

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Student Budget Tracker v1.0.0
            </div>
        </div>
    )
}

export default Settings
