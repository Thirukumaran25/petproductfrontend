import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCart, clearCart, createOrder, getMediaUrl, getUserProfile, updateUserProfile } from '../api/api'

function Checkout() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'secure'
  })
  const [saveInfo, setSaveInfo] = useState(false)
  const [coupon, setCoupon] = useState('')
  
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) {
      navigate('/login')
      return
    }

    // NOTE: This assumes getCart is synchronous and returns the cart items directly.
    // In a real app, if getCart is an async API call, this logic needs to be inside an async function.
    const stateItem = location.state?.buyNowItem
    if (stateItem) {
      setItems([stateItem])
    } else {
      setItems(getCart()) // Assuming getCart() fetches local/browser cart
    }

    // Load user profile if logged in
    loadUserProfile()
  }, [location.state, navigate])

  const loadUserProfile = async () => {
    try {
      const response = await getUserProfile()
      const profile = response.data
      setFormData(prev => ({
        ...prev,
        // Ensure the email from localStorage is used as the primary email input
        email: localStorage.getItem('userEmail') || '',
        firstName: profile.user?.first_name || '',
        lastName: profile.user?.last_name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        address: profile.address || '',
        address2: profile.address2 || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || ''
      }))
    } catch (error) {
      console.error('Failed to load user profile:', error)
    }
  }

  const subtotal = useMemo(() => items.reduce((s, it) => s + Number(it.price) * it.quantity, 0), [items])
  const shipping = items.length ? 99 : 0
  const total = subtotal + shipping

  const validateForm = () => {
    const newErrors = {}

    // Required fields validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^[0-9]{6}$/.test(formData.pincode.replace(/\D/g, ''))) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleOrder = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      // Save user profile if "Save info" is checked and user is logged in
      const userEmail = localStorage.getItem('userEmail')
      if (saveInfo && userEmail) {
        try {
          // NOTE: It is better to use profile fields like user_id or profile_id 
          // to uniquely identify the profile to update, but sticking to provided API
          await updateUserProfile({
            phone: formData.phone,
            country: formData.country,
            address: formData.address,
            address2: formData.address2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          })
        } catch (profileError) {
          console.error('Failed to save user profile:', profileError)
          // Continue with order even if profile save fails
        }
      }

      // Create order
      const orderData = {
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        country: formData.country,
        address: formData.address,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: items,
        subtotal,
        shipping,
        total,
      }

      const response = await createOrder(orderData)
      
      // Clear cart if this was a normal cart checkout
      if (!location.state?.buyNowItem) {
        // NOTE: The implementation of clearCart needs to also update the state/context of the parent application (like useCart hook)
        await clearCart()
      }

      // Redirect to order complete page with order data
      navigate('/order-complete', {
        state: {
          order: {
            ...orderData,
            id: response.data.id,
            created_at: response.data.created_at
          }
        }
      })
      
    } catch (error) {
      console.error('Order creation failed:', error)
      setErrors({ submit: 'Failed to create order. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-full"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {errors.submit}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={(e) => e.preventDefault()}> 
            {/* Contact Section */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    // FIX: Template literal fixed
                    className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Email (for order updates)"
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" />
                  <span>Send me order updates, news and offers on Email and WhatsApp</span>
                </div>
              </div>
            </div>

            {/* Delivery Section */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country/Region *</label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    // FIX: Template literal fixed
                    className={`w-full border rounded px-3 py-2 ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Country/Region"
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      // FIX: Template literal fixed
                      className={`w-full border rounded px-3 py-2 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="First name"
                      autoComplete="given-name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      // FIX: Template literal fixed
                      className={`w-full border rounded px-3 py-2 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Last name"
                      autoComplete="family-name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    // FIX: Template literal fixed
                    className={`w-full border rounded px-3 py-2 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Address"
                    autoComplete="address-line1"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite (Optional)</label>
                  <input
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Apartment, suite (Optional)"
                    autoComplete="address-line2"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      // FIX: Template literal fixed
                      className={`w-full border rounded px-3 py-2 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="City"
                      autoComplete="address-level2"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      // FIX: Template literal fixed
                      className={`w-full border rounded px-3 py-2 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="State"
                      autoComplete="address-level1"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      // FIX: Template literal fixed
                      className={`w-full border rounded px-3 py-2 ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Pincode"
                      autoComplete="postal-code"
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    // FIX: Template literal fixed
                    className={`w-full border rounded px-3 py-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Phone"
                    autoComplete="tel"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <input 
                    type="checkbox" 
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                  />
                  <span>Save this information for next time</span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 border rounded px-4 py-3 cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="secure"
                    checked={formData.paymentMethod === 'secure'}
                    onChange={handleInputChange}
                  />
                  <span>Secure transaction (UPI, Cards, Wallets, Net banking)</span>
                </label>
                <label className="flex items-center gap-3 border rounded px-4 py-3 cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>
          </form>

          <button 
            onClick={handleOrder}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold rounded-full px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>

        {/* Right: Order summary */}
        <div>
          <div className="bg-green-200/60 rounded-lg p-6 sticky lg:top-4">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-6">
              {items.map((it, index) => (
                <div key={it.id || `item-${index}`} className="flex items-center gap-3">
                  {it.image1 && (
                    <img
                      className="w-16 h-16 object-cover rounded"
                      src={getMediaUrl(it.image1)}
                      alt={it.productname}
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm leading-snug">{it.productname}</div>
                    <div className="text-xs text-gray-700">Quantity: {it.quantity}</div>
                    {/* Assuming selectedSize is an attribute of the item */}
                    {it.selectedSize && <div className="text-xs text-gray-700">Size: {it.selectedSize}</div>} 
                  </div>
                  {/* Assuming price is the price per unit */}
                  <div className="text-sm font-medium">₹{(Number(it.price) * it.quantity).toFixed(0)}</div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input 
                  value={coupon} 
                  onChange={e => setCoupon(e.target.value)} 
                  className="flex-1 border rounded px-3 py-2 text-sm" 
                  placeholder="Discount code or gift card" 
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Apply</button>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t pt-2">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout