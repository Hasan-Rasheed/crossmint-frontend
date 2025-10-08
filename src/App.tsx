import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './components/Dashboard'
import LandingPage from './components/LandingPage'
import AdminPanel from './components/Admin/AdminPanel'

function App() {
  const [showMerchantForm, setShowMerchantForm] = useState(false)

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
              <LandingPage onSignupClick={handleSignupClick} />
              <Dashboard isOpen={showMerchantForm} onClose={handleCloseMerchantForm} />
            </>
          }
        />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  )
}

export default App
