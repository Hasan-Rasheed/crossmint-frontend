import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'

function App() {
  const [showMerchantForm, setShowMerchantForm] = useState(false)

  const handleSignupClick = () => {
    setShowMerchantForm(true)
  }

  const handleCloseMerchantForm = () => {
    setShowMerchantForm(false)
  }

  return (
    <>
      <LandingPage onSignupClick={handleSignupClick} />
      <Dashboard isOpen={showMerchantForm} onClose={handleCloseMerchantForm} />
    </>
  )
}

export default App
