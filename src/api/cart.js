// Simple cart utilities using localStorage

const CART_KEY = 'cart_items'

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.log(e);
    return []
    
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function addToCart(product, quantity = 1) {
  const user = localStorage.getItem('userEmail')
  if (!user) {
    // Signal to callers that login is required by throwing a specific object
    const error = new Error('LOGIN_REQUIRED')
    error.code = 'LOGIN_REQUIRED'
    throw error
  }
  const items = getCart()
  const index = items.findIndex(it => it.id === product.id)
  if (index >= 0) {
    items[index].quantity += quantity
  } else {
    items.push({
      id: product.id,
      productname: product.productname,
      price: Number(product.price),
      image1: product.image1,
      quantity,
    })
  }
  saveCart(items)
  return items
}

export function removeFromCart(productId) {
  const items = getCart().filter(it => it.id !== productId)
  saveCart(items)
  return items
}

export function updateQuantity(productId, quantity) {
  const items = getCart()
  const index = items.findIndex(it => it.id === productId)
  if (index >= 0) {
    items[index].quantity = Math.max(1, quantity)
  }
  saveCart(items)
  return items
}

export function clearCart() {
  saveCart([])
}