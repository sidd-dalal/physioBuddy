import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    signOut(auth);
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials');
    }
  }

  return (
    <div className="admin-login-bg">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span role="img" aria-label="lock" style={{fontSize: 36}}>🔒</span>
        </div>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="admin-login-btn">Login</button>
          {error && <div className="admin-login-error">{error}</div>}
        </form>
      </div>
    </div>
  );
}