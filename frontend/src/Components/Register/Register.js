import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Change 'username' to 'name'
            const response = await axios.post('https://trackx-3mni4ufp.b4a.run/api/v1/auth/register', { username: name, email, password });
            setSuccess('Registration successful!');
            setError(null); // Reset any previous errors
            console.log(response.data); // Handle successful response
        } catch (err) {
            // Log the error response to get detailed information
            console.error('Registration error:', err.response ? err.response.data : err.message);
            setError('Registration failed. Please try again.'); // You can customize this message based on the error type
            setSuccess(null); // Reset any previous success messages
        }
    };

    return (
        <RegisterStyled>
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleRegister}>
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account?<Link to="/login">Login to your Account</Link>
            </p> {}
        </RegisterStyled>
    );
}

const RegisterStyled = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;

    h2 {
        color: rgba(34, 34, 96, 1);
    }

    .error {
        color: red;
        margin-bottom: 1rem;
    }

    .success {
        color: green;
        margin-bottom: 1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        input {
            padding: 1rem;
            border-radius: 5px;
            border: 1px solid rgba(34, 34, 96, 0.3);
            width: 300px;
        }

        button {
            padding: 1rem;
            background-color: rgba(34, 34, 96, 1);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 300px;

            &:hover {
                background-color: rgba(34, 34, 96, 0.8);
            }
        }
    }
`;

export default Register;
