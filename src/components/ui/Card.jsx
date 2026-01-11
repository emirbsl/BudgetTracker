import React from 'react'

const Card = ({ children, className = '', title, action }) => {
    return (
        <div className={`glass-card ${className}`}>
            {(title || action) && (
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                    {title && <h3 style={{ margin: 0 }}>{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    )
}

export default Card
