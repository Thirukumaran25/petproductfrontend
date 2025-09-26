import { useState, useEffect } from 'react'
import { getCartItemCount } from '../api/api'

export const useCart = () => {
  const [cartItemCount, setCartItemCount] = useState(0)

  const updateCartCount = () => {
    setCartItemCount(getCartItemCount())
  }

  useEffect(() => {
    // Initial load
    updateCartCount()

    // Listen for storage changes
    const handleStorageChange = () => {
      updateCartCount()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom cart update events
    window.addEventListener('cartUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleStorageChange)
    }
  }, [])

  return { cartItemCount, updateCartCount }
}