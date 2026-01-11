import React from 'react'

const Input = ({ label, id, error, className = '', ...props }) => {
    return (
        <div className={`input-group ${className}`} style={{ marginBottom: '1rem' }}>
            {label && (
                <label htmlFor={id} style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {label}
                </label>
            )}
            <input id={id} {...props} style={error ? { borderColor: 'var(--danger)' } : {}} />
            {error && <span className="text-danger text-sm" style={{ marginTop: '0.25rem', display: 'block' }}>{error}</span>}
        </div>
    )
}

export default Input
