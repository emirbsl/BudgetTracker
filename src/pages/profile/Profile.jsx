import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { User, Camera } from 'lucide-react'

const Profile = () => {
    const { user, refreshProfile } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: ''
    })

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, bio')
                    .eq('id', user.id)
                    .single()

                if (error && error.code !== 'PGRST116') {
                    throw error
                }

                if (data) {
                    setFormData({
                        first_name: data.first_name || '',
                        last_name: data.last_name || '',
                        bio: data.bio || ''
                    })
                }
            } catch (error) {
                console.error('Error fetching profile:', error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [user])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const updates = {
                id: user.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                bio: formData.bio,
                email: user.email, // Include email for new inserts
                updated_at: new Date().toISOString()
            }

            const { error } = await supabase
                .from('profiles')
                .upsert(updates, { onConflict: 'id' })

            if (error) throw error

            await refreshProfile() // Update global state (Sidebar etc.)
            alert('Profile updated successfully!')
        } catch (error) {
            alert('Error updating profile: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px dashed var(--glass-border)', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <User size={64} className="text-muted" />
                        <button style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-lg)' }}>
                            <Camera size={18} color="white" />
                        </button>
                    </div>
                    {loading ? (
                        <h3>...</h3>
                    ) : (
                        <h3>{formData.first_name || formData.last_name ? `${formData.first_name} ${formData.last_name}`.trim() : user?.email?.split('@')[0]}</h3>
                    )}
                    <p className="text-muted">Student Member</p>
                </div>

                <Card title="Personal Information">
                    <form onSubmit={handleSave}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                label="First Name"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                placeholder="Enter first name"
                            />
                            <Input
                                label="Last Name"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                placeholder="Enter last name"
                            />
                        </div>
                        <Input label="Email" defaultValue={user?.email} disabled />
                        <Input
                            label="Bio"
                            placeholder="Tell us a little about yourself..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        />

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" disabled={saving || loading}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default Profile
