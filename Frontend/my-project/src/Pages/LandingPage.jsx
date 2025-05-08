import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Welcome to the Face Detection Exam System</h1>
            <p>Your reliable platform for secure and efficient online exams.</p>
            <button 
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px'
                }}
                onClick={() => alert('Get Started Clicked!')}
            >
                Get Started
            </button>
            <button 
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#28A745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/hom')}
            >
                Go to /hom
            </button>
        </div>
    );
};

export default LandingPage;
