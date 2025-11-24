import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import BuyToken from './components/Buy/BuyToken';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? <Navigate to="/buytoken" /> : <LoginPage onLoginSuccess={() => setLoggedIn(true)} />
          }
        />
        <Route
          path="/buytoken"
          element={
            loggedIn ? <BuyToken /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
