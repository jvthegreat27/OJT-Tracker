import React, { useState } from 'react';
import { useOJT } from '../context/OJTContext';

const Login = () => {
  const { interns, loginIntern, addIntern } = useOJT();
  
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration form state
  const [newInternName, setNewInternName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [studentId, setStudentId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [establishment, setEstablishment] = useState('');
  const [program, setProgram] = useState('');
  const [targetHours, setTargetHours] = useState(600);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      const result = await loginIntern(username.trim(), password.trim());
      if (!result.success) {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Validation
    if (!newInternName.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    if (!newUsername.trim()) {
      setError('Please enter a username');
      return;
    }
    
    if (newUsername.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    
    if (!studentId.trim()) {
      setError('Please enter your Student ID');
      return;
    }
    
    if (!newPassword) {
      setError('Please enter a password');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (interns.some(i => i.username.toLowerCase() === newUsername.trim().toLowerCase())) {
      setError('Username already exists. Please choose another.');
      return;
    }
    
    if (interns.some(i => i.studentId && i.studentId.toLowerCase() === studentId.trim().toLowerCase())) {
      setError('Student ID already exists. Please check your ID.');
      return;
    }
    
    const newIntern = addIntern(
      newInternName.trim(),
      newUsername.trim(),
      newPassword,
      establishment.trim(),
      program.trim(),
      parseInt(targetHours) || 500,
      new Date(startDate).toISOString(),
      studentId.trim()
    );
    
    setSuccessMessage('Account created successfully! Please login.');
    setIsRegistering(false);
    setUsername(newUsername.trim());
    
    // Clear registration form
    setNewInternName('');
    setNewUsername('');
    setStudentId('');
    setNewPassword('');
    setConfirmPassword('');
    setEstablishment('');
    setProgram('');
    setTargetHours(600);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h1>OJT Hours Tracker</h1>
          <p>Track your internship hours efficiently</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Username or Student ID</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username or student ID"
                className="form-control"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-control"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              Login
            </button>

            <div className="form-divider">
              <span>or</span>
            </div>

            <button 
              type="button" 
              className="btn btn-secondary btn-block"
              onClick={() => { setIsRegistering(true); setError(''); setSuccessMessage(''); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Register New Intern
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={newInternName}
                onChange={(e) => setNewInternName(e.target.value)}
                placeholder="Enter your full name"
                className="form-control"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Choose a username"
                className="form-control"
              />
              <small className="form-hint">At least 3 characters</small>
            </div>

            <div className="form-group">
              <label>Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g., 2021-00001"
                className="form-control"
              />
              <small className="form-hint">You can use this to login</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create password"
                    className="form-control"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <small className="form-hint">At least 6 characters</small>
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="form-control"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>OJT Establishment/Office</label>
              <input
                type="text"
                value={establishment}
                onChange={(e) => setEstablishment(e.target.value)}
                placeholder="e.g., City Mayor's Office, DTI Regional Office"
                className="form-control"
              />
              <small className="form-hint">Name of the government office where you're doing OJT</small>
            </div>

            <div className="form-group">
              <label>Program/Course</label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                placeholder="e.g., BS Information Technology, BS Business Administration"
                className="form-control"
              />
              <small className="form-hint">Your academic program or course</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Hours</label>
                <input
                  type="number"
                  value={targetHours}
                  onChange={(e) => setTargetHours(e.target.value)}
                  placeholder="500"
                  className="form-control"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-control"
                />
                <small className="form-hint">When did you start OJT?</small>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              Create Account
            </button>

            <div className="form-divider">
              <span>or</span>
            </div>

            <button 
              type="button" 
              className="btn btn-secondary btn-block"
              onClick={() => { setIsRegistering(false); setError(''); }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
