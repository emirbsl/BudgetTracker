import React from 'react'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { User, Mail, Camera } from 'lucide-react'

const Profile = () => {
    const { user } = useAuth()

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'var(--bg-card)', border: '2px dashed var(--glass-border)', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <User size={64} className="text-muted" />
                        <button style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-lg)' }}>
                            <Camera size={18} color="white" />
                        </button>
                    </div>
                    <h3>{user?.email?.split('@')[0] || 'User'}</h3>
                    <p className="text-muted">Student Member</p>
                </div>

                <Card title="Personal Information">
                    <form>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input label="First Name" defaultValue="Ali" />
                            <Input label="Last Name" defaultValue="Baba" />
                        </div>
                        <Input label="Email" defaultValue={user?.email} disabled />
                        <Input label="Bio" placeholder="Tell us a little about yourself..." />

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button>Save Changes</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    )
}

export default Profile
