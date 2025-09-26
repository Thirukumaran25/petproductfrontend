import React, { useEffect, useState } from 'react'
import api from '../api/api'
import { Link, useNavigate } from 'react-router-dom'
import { loadUserCart, clearCartForUser, getMediaUrl } from '../api/api'
import { useCart } from '../hooks/useCart'

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userEmail, setUserEmail] = useState(null)
    const [logoData, setLogoData] = useState(null); 
    const { cartItemCount } = useCart()
    const navigate = useNavigate()

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await api.get('/logo/')
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setLogoData(response.data[0])
        }
      } catch (error) {
        console.error("Failed to fetch logo:", error)
      }
    }
    
    fetchLogo()
  }, [])


    useEffect(() => {
      const email = localStorage.getItem('userEmail')
      setUserEmail(email)
      
      if (email) {
        loadUserCart().catch(error => {
          console.error('Failed to load user cart:', error)
        })
      }

      const handleStorageChange = (e) => {
        if (e.key === 'userEmail') {
          setUserEmail(e.newValue)
        }
      }
      window.addEventListener('storage', handleStorageChange)
      const handleLogin = () => {
        const email = localStorage.getItem('userEmail')
        setUserEmail(email)
      }
      
      window.addEventListener('userLogin', handleLogin)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('userLogin', handleLogin)
      }
    }, [])

    const logout = () => {
      const currentUser = localStorage.getItem('userEmail')
      if (currentUser) {
        clearCartForUser(currentUser)
      }
      localStorage.removeItem('userEmail')
      localStorage.removeItem('authToken')
      setUserEmail(null)
      navigate('/')
    }

    const handleCartClick = () => {
      if (!userEmail) {
        navigate('/login')
        return
      }
      navigate('/cart')
    }
    
  return (
    <div className="w-full">
      {/* Top Contact Bar */}
      <div className="bg-gray-100 px-4 py-2 flex justify-between items-center text-sm text-black">
        <div className="flex items-center gap-2">
          <i className="fas fa-phone" />
          <span>+91-1234567890</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-envelope" />
          <span>Support@petpalooza.com</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-blue-700 text-white px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center flex-wrap">
          {/* Logo & Search */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="justify-items-center  text-lg font-bold">
              <img src={logoData?.logo ? getMediaUrl(logoData.logo) : ''} alt="Logo" />
              <span>PetPalooza</span>
            </div>

            {/* Search (hidden on small screens) */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search for products"
                className="pl-4 pr-10 py-2 rounded-full bg-white text-black w-64"
              />
              <i className="fas fa-search absolute right-3 top-2.5 text-gray-600" />
            </div>
          </div>

          {/* Hamburger (mobile only) */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {/* FIX: Correctly concatenate/use a template literal inside JSX {} */}
              <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-2xl`} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link to="/" className="text-yellow-400">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            {userEmail ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-green-300">
                  <i className="fas fa-user-check" />
                  <span className="text-xs">{userEmail.split('@')[0]}</span>
                </div>
                <button onClick={logout} className="flex items-center gap-1 hover:text-red-300 transition-colors">
                  <i className="fas fa-sign-out-alt" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1 hover:text-yellow-300 transition-colors">
                <i className="fas fa-sign-in-alt" />
                <span>Log In</span>
              </Link>
            )}
            <button onClick={handleCartClick} className="relative hover:text-yellow-300 transition-colors">
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar for mobile */}
          <div className="block md:hidden mt-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products"
              className="pl-4 pr-10 py-2 bg-white rounded-full text-black w-full"
            />
            <i className="fas fa-search absolute right-3 top-2.5 text-gray-600" />
          </div>
        </div>

        {/* Collapsible Mobile Menu */}
        {menuOpen && (
          <div className="mt-4 flex flex-col gap-4 text-center justify-items-center text-sm font-semibold md:hidden">
            <Link to="/" className="text-yellow-400">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            {userEmail ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <i className="fas fa-user-check" />
                  <span>Welcome, {userEmail.split('@')[0]}</span>
                </div>
                <button onClick={logout} className="flex items-center justify-center gap-2 hover:text-red-300 transition-colors">
                  <i className="fas fa-sign-out-alt" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center justify-center gap-2 hover:text-yellow-300 transition-colors">
                <i className="fas fa-sign-in-alt" />
                <span>Log In</span>
              </Link>
            )}
            <button onClick={handleCartClick} className="flex items-center justify-center gap-2 hover:text-yellow-300 transition-colors">
              <i className="fas fa-shopping-cart text-xl" />
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Menu Section */}
        <div className="flex flex-wrap gap-4 justify-center mt-4 text-white font-semibold text-sm text-center">
            <Link to="/dog">Dog ▾</Link>
            <Link to="/cat">Cat ▾</Link>
            <Link to="/smallpet">Small pets ▾</Link>
            <Link to="/petservice">Pet Service ▾</Link>
            <Link to="#">Shop by Brand ▾</Link>
            <Link to="#">Shop by Breed ▾</Link>
            <Link to="/consultvet">Consult a Vet</Link>
        </div>
      </div>
    </div>
  )
}

export default Header