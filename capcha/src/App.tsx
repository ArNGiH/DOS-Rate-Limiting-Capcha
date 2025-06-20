import axios from 'axios';
import { useState } from 'react';
import './App.css';
import { Turnstile } from '@marsidev/react-turnstile';

function App() {
  const [token, setToken] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const handleReset = async () => {
    try {
      const res = await axios.post('http://localhost:3000/reset-password', {
        email: 'aryan@gmail.com',
        otp,
        newPassword,
        token,
      });
      console.log('Success:', res.data);
    } catch (e) {
      console.error('Failed:', e);
    }
  };

  return (
    <>
      <input
        placeholder="Otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <Turnstile
        siteKey="0x4AAAAAABhr0kGX0la-5zm5"
        onSuccess={(token) => setToken(token)}
      />

      <button onClick={handleReset}>Update Password</button>
    </>
  );
}

export default App;
