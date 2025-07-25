import { useState } from 'react'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'

export default function AuthContainer({ onAuthSuccess }) {
  const [currentView, setCurrentView] = useState('login') // 'login' or 'signup'

  const switchToSignup = () => setCurrentView('signup')
  const switchToLogin = () => setCurrentView('login')

  const handleLoginSuccess = (user) => {
    onAuthSuccess?.(user)
  }

  const handleSignupSuccess = (user) => {
    // After successful signup, switch to login
    setCurrentView('login')
    // You could show a success toast here
    alert('Account created successfully! Please sign in.')
  }

  return (
    <>
      {currentView === 'login' ? (
        <LoginPage 
          onSwitchToSignup={switchToSignup} 
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <SignupPage 
          onSwitchToLogin={switchToLogin}
          onSignupSuccess={handleSignupSuccess}
        />
      )}
    </>
  )
}