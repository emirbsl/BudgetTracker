import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import { supabase } from '../../lib/supabase'

const SignUp = () => {
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // 1. Sign up auth
        const { data: authData, error: authError } = await signUp({
            email: formData.email,
            password: formData.password
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        // 2. Create profile entry
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: authData.user.id,
                    full_name: formData.fullName,
                    email: formData.email
                }])

            if (profileError) {
                console.error('Error creating profile:', profileError)
            }
        }

        navigate('/') // Usually triggers "Confirm your email" flow, but for MVP we might redirect
        setLoading(false)
    }

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #db2777 0%, #0f172a 100%)' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p className="text-muted">Start tracking your budget today</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        {error && <div className="text-danger text-sm" style={{ marginBottom: '1rem' }}>{error}</div>}

                        <Button type="submit" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        <span className="text-muted">Already have an account? </span>
                        <Link to="/login" style={{ color: 'var(--secondary)', textDecoration: 'none', fontWeight: 500 }}>
                            Sign In
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default SignUp
