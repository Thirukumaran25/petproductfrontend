import React, { useState } from 'react'
import { loginUser, registerUser, loadUserCart, syncCartToBackend, migrateGuestCartToUser } from '../api/api'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [reg, setReg] = useState({ first_name: '', last_name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Email and password required'); return }
    try {
      // Validate credentials server-side
      await loginUser({ email, password })
      localStorage.setItem('userEmail', email)
      
      // Migrate guest cart to user cart
      migrateGuestCartToUser(email)
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('userLogin'))
      
      // Load user's cart from backend
      try {
        await loadUserCart()
      } catch (cartError) {
        console.error('Failed to load user cart:', cartError)
        // Try to sync local cart to backend
        try {
          await syncCartToBackend()
        } catch (syncError) {
          console.error('Failed to sync cart to backend:', syncError)
        }
      }
      
      navigate('/')
    } catch (err) {
      const exists = err.response?.data?.exists
      if (exists === false) {
        setReg(r => ({ ...r, email }))
        setShowRegister(true)
        setError('No account found. Please register.')
      } else {
        setError(err.response?.data?.detail || 'Invalid credentials')
      }
    }
  }

  const submitRegister = async (e) => {
    e.preventDefault()
    try {
      await registerUser(reg)
      setShowRegister(false)
      localStorage.setItem('userEmail', reg.email)
      
      // Migrate guest cart to user cart
      migrateGuestCartToUser(reg.email)
      
      // Dispatch custom event to update header
      window.dispatchEvent(new CustomEvent('userLogin'))
      
      // Sync local cart to backend for new user
      try {
        await syncCartToBackend()
      } catch (syncError) {
        console.error('Failed to sync cart to backend:', syncError)
      }
      
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Account</h1>
      <div className="bg-green-300 rounded-md p-3 text-center font-semibold mb-6 grid grid-cols-2">
        <div>Returning customer</div>
        <div>New customer</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="font-semibold">Email</div>
              <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div>
              <div className="font-semibold">Password</div>
              <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full">Log in</button>
          </form>
          <div className="mt-2 text-sm text-gray-600">Forgot your password?</div>
        </div>

        <div>
          <div className="p-4">
            <div className="mb-4">Register with us for a faster checkout, to track the status of your order and more.</div>
            <button onClick={()=>setShowRegister(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full">Create an account</button>
          </div>
        </div>
      </div>

      {showRegister && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[560px] max-w-[92vw] p-6 relative">
            <button className="absolute top-3 right-3 text-2xl" onClick={()=>setShowRegister(false)}>×</button>
            <h2 className="text-xl font-semibold mb-4">Sign up for a free account at Petpalooza.</h2>
            <form onSubmit={submitRegister} className="space-y-4">
              <div>
                <div className="font-semibold">First Name</div>
                <input className="w-full border rounded px-3 py-2" value={reg.first_name} onChange={e=>setReg({...reg, first_name: e.target.value})} />
              </div>
              <div>
                <div className="font-semibold">Last Name</div>
                <input className="w-full border rounded px-3 py-2" value={reg.last_name} onChange={e=>setReg({...reg, last_name: e.target.value})} />
              </div>
              <div>
                <div className="font-semibold">Email</div>
                <input className="w-full border rounded px-3 py-2" value={reg.email} onChange={e=>setReg({...reg, email: e.target.value})} />
              </div>
              <div>
                <div className="font-semibold">Password</div>
                <input type="password" className="w-full border rounded px-3 py-2" value={reg.password} onChange={e=>setReg({...reg, password: e.target.value})} />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full">Create an account</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login