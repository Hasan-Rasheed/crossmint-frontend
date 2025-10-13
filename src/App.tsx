import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import AdminPanel from './components/Admin/AdminPanel'
import LoginForm from './components/Login/Login'

function App() {
  const [showMerchantForm, setShowMerchantForm] = useState(false)
  const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(false);

  const handleLoginClick = () => {
    setIsSignUpFormOpen(true);
  };

  const handleCloseSignupForm = () => {
    setIsSignUpFormOpen(false);
  };

  const handleSignupClick = () => {
    setShowMerchantForm(true)
  }

  const handleCloseMerchantForm = () => {
    setShowMerchantForm(false)
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage onSignupClick={handleSignupClick} handleLoginClick={handleLoginClick}  />
              <Dashboard isOpen={showMerchantForm} onClose={handleCloseMerchantForm} />
              {isSignUpFormOpen && <LoginForm isOpen={isSignUpFormOpen} onClose={handleCloseSignupForm} />}
            </>
          }
        />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  )
}

export default App
