import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

const Login = () => {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const { error } = await signIn(formData)
        if (error) {
            setError(error.message)
        } else {
            navigate('/')
        }
        setLoading(false)
    }

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'radial-gradient(circle at center, #2e1065 0%, #0f172a 100%)' }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p className="text-muted">Enter your credentials to access your account</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit}>
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
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        <span className="text-muted">Don't have an account? </span>
                        <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                            Sign Up
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Login
