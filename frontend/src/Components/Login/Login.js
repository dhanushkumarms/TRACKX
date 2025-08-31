import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useGlobalContext } from '../../context/globalContext';

const BASE_URL = "https://trackx-3mni4ufp.b4a.run/api/v1/auth/";

function Login({ onLogin }) {
    const { setToken } = useGlobalContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log({email,})
        try {
            console.log(email,password);
            const response = await axios.post(`${BASE_URL}login`, { email, password })
            const token = response.data.token; // Assuming the token is returned in this format
            setToken(token); // Store token in global context
            onLogin(token); // Call onLogin to set the authenticated state
        } catch (err) {
            console.log(email,password)
            setError('Invalid credentials'); // Handle error appropriately
            console.error(err);
        }
    };

    return (
        <LoginStyled>
            <h2>Login</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={ handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button type="submit">Login</button>
            </form>
            <p>
                New here? <Link to="/register">Create an account</Link>
            </p> {}
        </LoginStyled>
    );
}

const LoginStyled = styled.div`
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

    p {
        margin-top: 1rem;
        font-size: 1rem;
        color: rgba(34, 34, 96, 0.6);

        a {
            color: rgba(34, 34, 96, 1);
            text-decoration: underline;

            &:hover {
                color: rgba(34, 34, 96, 0.8);
            }
        }
    }
`;

export default Login;
