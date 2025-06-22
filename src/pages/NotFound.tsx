import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/" style={{ color: '#667eea', textDecoration: 'none' }}>
                Go back to home
            </a>
        </div>
    );
};

export default NotFound; 