import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import Card from '../../components/ui/Card'
import { Bell, Moon, Shield, CreditCard, HelpCircle, ToggleLeft, ToggleRight, Check } from 'lucide-react'

const Settings = () => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState({
        notifications_enabled: true,
        dark_theme: true,
        two_factor_auth: false
    })

    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from('user_settings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (error && error.code !== 'PGRST116') throw error

                if (data) {
                    setSettings({
                        notifications_enabled: data.notifications_enabled,
                        dark_theme: data.dark_theme,
                        two_factor_auth: data.two_factor_auth
                    })
                } else {
                    // If no settings exist yet, create default
                    const { error: insertError } = await supabase
                        .from('user_settings')
                        .insert([{ user_id: user.id }])

                    if (insertError) console.error('Error creating defaults:', insertError)
                }
            } catch (error) {
                console.error('Error fetching settings:', error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [user])

    const handleToggle = async (key) => {
        const newValue = !settings[key]
        setSettings(prev => ({ ...prev, [key]: newValue })) // Optimistic update

        try {
            const { error } = await supabase
                .from('user_settings')
                .upsert({
                    user_id: user.id,
                    [key]: newValue,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' })

            if (error) {
                throw error
                setSettings(prev => ({ ...prev, [key]: !newValue })) // Revert on error
            }
        } catch (error) {
            console.error('Error updating setting:', error.message)
            alert('Failed to save setting.')
        }
    }

    const items = [
        {
            key: 'notifications_enabled',
            icon: Bell,
            label: 'Notifications',
            desc: 'Manage your email and push notifications',
            isToggle: true
        },
        {
            key: 'dark_theme',
            icon: Moon,
            label: 'Dark Mode',
            desc: 'Toggle dark appearance',
            isToggle: true
        },
        {
            key: 'two_factor_auth',
            icon: Shield,
            label: 'Two-Factor Auth',
            desc: 'Enable extra security (Mock)',
            isToggle: true
        },
        { icon: CreditCard, label: 'Payment Methods', desc: 'Manage your connected cards', isToggle: false },
        { icon: HelpCircle, label: 'Help & Support', desc: 'FAQ and Contact Support', isToggle: false },
    ]

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Settings</h1>

            <Card className="glass-card">
                {items.map((item, index) => (
                    <div key={index} className="flex-between" style={{ padding: '1.5rem 0', borderBottom: index !== items.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                <item.icon size={20} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.label}</h4>
                                <p className="text-muted text-sm" style={{ margin: 0 }}>{item.desc}</p>
                            </div>
                        </div>

                        {item.isToggle ? (
                            <button
                                onClick={() => handleToggle(item.key)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: settings[item.key] ? 'var(--primary)' : 'var(--text-muted)' }}
                            >
                                {settings[item.key] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                        ) : (
                            <div style={{ color: 'var(--text-muted)', cursor: 'pointer' }}>&gt;</div>
                        )}
                    </div>
                ))}
            </Card>

            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Student Budget Tracker v1.1.0 • Connected to Supabase
            </div>
        </div>
    )
}

export default Settings
