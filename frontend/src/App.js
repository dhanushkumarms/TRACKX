import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import { useGlobalContext } from './context/globalContext';
import ViewTransactions from './Components/ViewTransactions/ViewTransactions';

function App() {
    const { token, setToken } = useGlobalContext(); // Access global context
    const [active, setActive] = useState(0); // Default to 0 if no token

    // If there's no token, set active to 0 (Login or Register only)
    useEffect(() => {
        if (!token) {
            setActive(0); // Ensure Login/Register is shown when no token
        }
    }, [token]);

    // Handle login success
    const handleLogin = (token) => {
        setToken(token); // Store token in context
        setActive(1); // Redirect to dashboard after login
    };

    // Handle logout
    const handleLogout = () => {
        setToken(null); // Clear token on logout
        setActive(0); // Reset to default page on logout
    };

    // Control what content is displayed based on authentication and active page
    const displayData = () => {
        if (!token) {
            // Show only Login/Register when not authenticated
            return active === 2 ? <Register /> : <Login onLogin={handleLogin} />;
        }

        // When authenticated, display based on active page
        switch (active) {
            case 1:
                return <Dashboard onLogout={handleLogout} />;
            case 2:
                return <ViewTransactions />;
            case 3:
                return <Income />;
            case 4:
                return <Expenses />;
            default:
                return <Dashboard onLogout={handleLogout} />;
        }
    };

    // Memoize the Orb component to prevent unnecessary re-renders
    const orbMemo = useMemo(() => <Orb />, []);

    return (
        <AppStyled bg={bg} className="App">
            {orbMemo}
            <MainLayout>
                {/* Conditionally render Navigation only if token is present */}
                {token && <Navigation active={active} setActive={setActive} onLogout={handleLogout} />}
                <main>
                    {displayData()}
                </main>
            </MainLayout>
        </AppStyled>
    );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
