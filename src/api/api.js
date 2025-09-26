import axios from 'axios'

const API_BASE_URL = 'https://petproductbackend.onrender.com/api'
const MEDIA_BASE_URL = 'https://petproductbackend.onrender.com'


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}` 
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userEmail')
      localStorage.removeItem('authToken')
    }
    return Promise.reject(error)
  }
)

// ==================== PRODUCTS API ====================


export const getDogProducts = () => {
  return api.get('/dogproduct/')
}

export const getDogProduct = (id) => {
  return api.get(`/dogproduct/${id}/`)
}


export const getCatProducts = () => {
  return api.get('/catproduct/')
}
export const getCatProduct = (id) => {
  return api.get(`/catproduct/${id}/`)
}


export const getSmallpetProducts = () => {
  return api.get('/smallpetproduct/')
}


export const getSmallpetProduct = (id) => {
  return api.get(`/smallpetproduct/${id}/`)
}

// ==================== HOME PAGE API ====================

export const getHomeBanners = () => {
  return api.get('/homebanners/')
}

export const getHomeCategories = () => {
  return api.get('/homecategories/')
}


// ==================== About PAGE API ====================


export const getAboutBanners = () => {
  return api.get('/homebanners/')
}

export const getAboutCategories = () => {
  return api.get('/homecategories/')
}


// ==================== Consultvet PAGE API ====================

export const getConsultBanners = () => {
  return api.get('/consultbanners/')
}

export const getConsultCategories = () => {
  return api.get('/consultcategories/')
}

// ==================== AUTHENTICATION API ====================


export const registerUser = async (userData) => {
  const response = await api.post('/register/', userData)
  const token = response.data?.token 
  if (token) {
    localStorage.setItem('authToken', token)
  }
  
  return response
}


export const loginUser = async (credentials) => {
  const response = await api.post('/login/', credentials)
  const token = response.data?.token
  if (token) {
    localStorage.setItem('authToken', token)
  }
  
  return response
}

/**
 * Check if user exists
 * @param {string} email - Email to check
 * @returns {Promise} Axios response with exists boolean
 */
export const checkUser = (email) => {
  return api.get('/check-user/', {
    params: { email }
  })
}

// ==================== ORDERS API ====================

/**
 * Create a new order
 * @param {Object} orderData - Order data
 * @returns {Promise} Axios response with order data
 */
export const createOrder = (orderData) => {
  return api.post('/orders/', orderData)
}

// ==================== USER PROFILE API ====================

/**
 * Get user profile
 * @returns {Promise} Axios response with user profile data
 */
export const getUserProfile = () => {
  return api.get('/user-profile/')
}

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} Axios response with updated profile data
 */
export const updateUserProfile = (profileData) => {
  return api.put('/user-profile/', profileData)
}

/**
 * Get all orders
 * @returns {Promise} Axios response with orders array
 */
export const getOrders = () => {
  return api.get('/orders/')
}

/**
 * Get a specific order by ID
 * @param {number|string} id - Order ID
 * @returns {Promise} Axios response with order data
 */
export const getOrder = (id) => {
  // FIX: Use backticks (`) for template literal
  return api.get(`/orders/${id}/`)
}

// ==================== CART UTILITIES (LOCAL STORAGE) ====================

/**
 * Get cart key for current user
 * @returns {string} Cart key for the current user
 */
const getCartKey = () => {
  const userEmail = localStorage.getItem('userEmail')
  return userEmail ? `cart_items_${userEmail}` : 'cart_items_guest'
}

/**
 * Get cart items from localStorage for current user
 * @returns {Array} Array of cart items
 */
export const getCart = () => {
  try {
    const cartKey = getCartKey()
    const raw = localStorage.getItem(cartKey)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.log(e);
    return []
  }
}

/**
 * Save cart items to localStorage for current user
 * @param {Array} items - Cart items to save
 */
export const saveCart = (items) => {
  const cartKey = getCartKey()
  localStorage.setItem(cartKey, JSON.stringify(items))
  // Dispatch custom event for cart updates
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}

/**
 * Add product to cart (localStorage only)
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Array} Updated cart items
 */
export const addToCartLocal = (product, quantity = 1) => {
  const items = getCart()
  // Find item by both product ID and selected size (if applicable)
  const index = items.findIndex(it => 
    it.id === product.id && 
    (it.selectedSize === product.selectedSize || (it.selectedSize === null && product.selectedSize === null))
  )
  
  const newItem = {
    id: product.id,
    productname: product.productname,
    price: Number(product.price),
    image1: product.image1,
    // Ensure selectedSize is included for correct identification if available
    selectedSize: product.selectedSize || null, 
    quantity,
  }

  if (index >= 0) {
    items[index].quantity += quantity
  } else {
    items.push(newItem)
  }
  
  saveCart(items)
  return items
}

// ==================== CART UTILITIES (SYNC) ====================

/**
 * Add product to cart (requires login and syncs with backend)
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Array} Updated cart items
 * @throws {Error} LOGIN_REQUIRED error if user not logged in
 */
export const addToCart = async (product, quantity = 1) => {
  const user = localStorage.getItem('userEmail')
  
  if (!user) {
    // User not logged in, throw error
    const error = new Error('LOGIN_REQUIRED')
    error.code = 'LOGIN_REQUIRED'
    throw error
  }
  
  // User is logged in, sync with backend
  try {
    await api.post('/cart/add_item/', {
      product_id: product.id,
      quantity: quantity,
      // Pass selected size if needed by the backend
      selected_size: product.selectedSize || null, 
    })
    // Also update localStorage for client-side display consistency
    return addToCartLocal(product, quantity)
  } catch (error) {
    console.error('Failed to sync cart with backend:', error)
    // Fallback to localStorage only if backend failed for non-auth reasons
    return addToCartLocal(product, quantity)
  }
}

/**
 * Remove product from cart
 * @param {number|string} productId - Product ID to remove
 * @returns {Array} Updated cart items
 */
export const removeFromCart = async (productId, selectedSize = null) => {
  const user = localStorage.getItem('userEmail')
  
  if (user) {
    try {
      await api.delete('/cart/remove_item/', {
        data: { product_id: productId }
      })
    } catch (error) {
      console.error('Failed to sync cart removal with backend:', error)
    }
  }
  
  // Always update localStorage - remove by both product ID and selected size
  const items = getCart().filter(it => 
    !(it.id === productId && 
      (it.selectedSize === selectedSize || (it.selectedSize === null && selectedSize === null)))
  )
  saveCart(items)
  return items
}

/**
 * Update product quantity in cart
 * @param {number|string} productId - Product ID
 * @param {number} quantity - New quantity
 * @returns {Array} Updated cart items
 */
export const updateQuantity = async (productId, quantity, selectedSize = null) => {
  const user = localStorage.getItem('userEmail')
  
  if (user) {
    try {
      await api.put('/cart/update_item/', {
        product_id: productId,
        quantity: quantity
      })
    } catch (error) {
      console.error('Failed to sync cart update with backend:', error)
    }
  }
  
  // Always update localStorage - find by both product ID and selected size
  const items = getCart()
  const index = items.findIndex(it => 
    it.id === productId && 
    (it.selectedSize === selectedSize || (it.selectedSize === null && selectedSize === null))
  )
  if (index >= 0) {
    items[index].quantity = Math.max(1, quantity)
  }
  saveCart(items)
  return items
}

/**
 * Clear all items from cart for current user
 */
export const clearCart = async () => {
  const user = localStorage.getItem('userEmail')
  
  if (user) {
    try {
      await api.delete('/cart/clear/')
    } catch (error) {
      console.error('Failed to sync cart clear with backend:', error)
    }
  }
  
  // Always clear localStorage for current user
  saveCart([])
}

/**
 * Clear cart for a specific user (used during logout)
 * @param {string} userEmail - Email of user to clear cart for
 */
export const clearCartForUser = (userEmail) => {
  const cartKey = `cart_items_${userEmail}`
  localStorage.removeItem(cartKey)
}

/**
 * Migrate guest cart to user cart when user logs in
 * @param {string} userEmail - Email of the user logging in
 */
export const migrateGuestCartToUser = (userEmail) => {
  const guestCartKey = 'cart_items_guest'
  const userCartKey = `cart_items_${userEmail}`
  
  // Get guest cart items
  const guestItems = JSON.parse(localStorage.getItem(guestCartKey) || '[]')
  
  if (guestItems.length > 0) {
    // Get existing user cart items
    const userItems = JSON.parse(localStorage.getItem(userCartKey) || '[]')
    
    // Merge guest cart with user cart (avoid duplicates)
    guestItems.forEach(guestItem => {
      const existingIndex = userItems.findIndex(userItem => 
        userItem.id === guestItem.id && 
        (userItem.selectedSize === guestItem.selectedSize || 
         (userItem.selectedSize === null && guestItem.selectedSize === null))
      )
      
      if (existingIndex >= 0) {
        // Add quantities together
        userItems[existingIndex].quantity += guestItem.quantity
      } else {
        // Add new item
        userItems.push(guestItem)
      }
    })
    
    // Save merged cart
    localStorage.setItem(userCartKey, JSON.stringify(userItems))
    
    // Clear guest cart
    localStorage.removeItem(guestCartKey)
    
    // Dispatch cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }
}

// ==================== CART BACKEND SYNC ====================

/**
 * Get user's cart from backend
 * @returns {Promise} Cart data from backend
 */
export const getCartFromBackend = async () => {
  try {
    // This route is protected and requires the Auth Token
    const response = await api.get('/cart/')
    return response.data
  } catch (error) {
    console.error('Failed to fetch cart from backend:', error)
    throw error
  }
}

/**
 * Sync localStorage cart with backend
 * @returns {Promise} Updated cart data
 */
export const syncCartToBackend = async () => {
  const localCart = getCart()
  try {
    // This route is protected and requires the Auth Token
    const response = await api.post('/cart/sync_from_local/', {
      items: localCart
    })
    return response.data
  } catch (error) {
    console.error('Failed to sync cart to backend:', error)
    throw error
  }
}

/**
 * Load user's cart from backend and update localStorage
 * @returns {Promise} Cart data
 */
export const loadUserCart = async () => {
  try {
    const backendCart = await getCartFromBackend()
    
    // Convert backend cart format to localStorage format
    const localCartItems = backendCart.items.map(item => ({
      id: item.product.id,
      productname: item.product.productname,
      price: Number(item.product.price),
      image1: item.product.image1,
      quantity: item.quantity,
      selectedSize: item.selected_size || null, // Ensure size is captured if available
    }))
    
    // Update localStorage
    saveCart(localCartItems)
    
    return backendCart
  } catch (error) {
    console.error('Failed to load user cart:', error)
    throw error
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get media URL for images
 * @param {string} imagePath - Image path from API
 * @returns {string} Full URL for the image
 */
export const getMediaUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  // FIX: Use backticks (`) for template literal
  return `${MEDIA_BASE_URL}${imagePath}`
}

/**
 * Calculate cart total
 * @returns {number} Total price of all items in cart
 */
export const getCartTotal = () => {
  const items = getCart()
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

/**
 * Get cart item count
 * @returns {number} Total number of items in cart
 */
export const getCartItemCount = () => {
  const items = getCart()
  return items.reduce((count, item) => count + item.quantity, 0)
}

// ==================== EXPORT DEFAULT API INSTANCE ====================

// Export the raw axios instance for any custom requests
export default api

// ==================== CONVENIENCE EXPORTS ====================

// Export all API functions as a single object for easier importing
export const API = {
  // Products
  getDogProducts,
  getDogProduct,
  
  // Home page
  getHomeBanners,
  getHomeCategories,
  
  // Authentication
  registerUser,
  loginUser,
  checkUser,
  
  // Orders
  createOrder,
  getOrders,
  getOrder,
  
  // User Profile
  getUserProfile,
  updateUserProfile,
  
  // Cart
  getCart,
  saveCart,
  addToCart,
  addToCartLocal,
  removeFromCart,
  updateQuantity,
  clearCart,
  
  // Cart Backend Sync
  getCartFromBackend,
  syncCartToBackend,
  loadUserCart,
  
  // Utilities
  getMediaUrl,
  getCartTotal,
  getCartItemCount,
}
