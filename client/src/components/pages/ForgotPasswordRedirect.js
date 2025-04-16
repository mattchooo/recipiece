import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import './Signup.css';

function ResetPassword() {
    const { token, id } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/reset-password/${token}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const result = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(result.error || "Reset failed.");
            }
        } catch (err) {
            console.error("Reset error:", err);
            setError("Server error.");
        }
    };

    return (
        <div>
            <div className="signup-page">
                <h1>Reset Password</h1>
                {error && <h2>{error}</h2>}
                <form className="signup-form" onSubmit={handleReset}>
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            </div>
            <Footer />
        </div>
    );
}

export default ResetPassword;
