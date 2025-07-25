import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleSwitchToSignup = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  const handleLoginSuccess = (user) => {
    onAuthSuccess?.(user);
  };

  const handleSignupSuccess = (user) => {
    // After successful signup, switch to login
    setIsLogin(true);
    // You could also auto-login here if you want
  };

  return (
    <>
      {isLogin ? (
        <Login
          onSwitchToSignup={handleSwitchToSignup}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Signup
          onSwitchToLogin={handleSwitchToLogin}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </>
  );
}