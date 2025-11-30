import React, { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [is2FAOpen, setIs2FAOpen] = useState(false);
  const [code, setCode] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Csak admin felhasználó engedélyezett
    if (email !== 'admin123@gmail.com' || password !== 'admin123') {
      setError('Hibás email vagy jelszó.');
      return;
    }

    setError('');
    setIs2FAOpen(true); // megnyitja a 2FA popupot
  };

const handleVerify = () => {
  if (code === '123456') {
    localStorage.setItem('token', '12345abc');
    setIs2FAOpen(false);
    onLoginSuccess(); // jelzi az App.js-nek, hogy sikeres a login
  } else {
    alert('Hibás kód!');
  }
};


  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0b6623'
    }}>
      <form onSubmit={handleLogin} style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '300px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Bejelentkezés</h2>

<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={{
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: 'black'
  }}
/>

<input
  type="password"
  placeholder="Jelszó"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: 'black'
  }}
/>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Belépés
        </button>
      </form>

<Modal
  isOpen={is2FAOpen}
  onRequestClose={() => setIs2FAOpen(false)}
  style={{
    content: {
      width: '300px',
      height: '200px',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      backgroundColor: 'white',
      color: 'black'
    }
  }}
>

        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Kétfaktoros hitelesítés</h3>
  <input
  type="text"
  placeholder="Írd be a 6 számjegyű kódot"
  value={code}
  onChange={(e) => setCode(e.target.value)}
  style={{
    margin: '10px 0',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #0e0101ff',
    backgroundColor: 'white',
    color: 'black'
  }}
/>
        <button onClick={handleVerify} style={{
          padding: '8px 15px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Megerősítés
        </button>
      </Modal>
    </div>
  );
}

export default LoginPage;
