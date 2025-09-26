import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, removeFromCart, updateQuantity, getMediaUrl } from '../api/api'


function Cart() {
  const [items, setItems] = useState([])
  const [coupon, setCoupon] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail) {
      navigate('/login')
      return
    }
    setItems(getCart())
  }, [navigate])

  const subtotal = items.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0)
  const shipping = items.length > 0 ? 99 : 0
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <div>Your cart is empty.</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Items & Coupon */}
        <div className="lg:col-span-2">
          {/* Items header row */}
          <div className="hidden md:grid grid-cols-12 text-sm font-semibold text-gray-600 px-4">
            <div className="col-span-1">Remove</div>
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-1 text-right">Sub Total</div>
          </div>
          <div className="mt-2 divide-y bg-white rounded-md shadow">
            {items.map(it => (
              <div key={it.id} className="grid grid-cols-12 items-center p-4">
                <button
                  onClick={() => { const next = removeFromCart(it.id, it.selectedSize); setItems(next) }}
                  className="col-span-1 text-red-500 text-lg"
                  aria-label="Remove item"
                >
                  ×
                </button>
                <div className="col-span-6 flex items-center gap-4">
                  {it.image1 && (
                    <img
                      className="w-16 h-16 object-cover rounded"
                      src={getMediaUrl(it.image1)}
                      alt={it.productname}
                    />
                  )}
                  <div>
                    <div className="font-semibold">{it.productname}</div>
                  </div>
                </div>
                <div className="col-span-2 text-right">₹ {Number(it.price).toFixed(0)}</div>
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <button onClick={() => { const next = updateQuantity(it.id, it.quantity - 1, it.selectedSize); setItems(next) }} className="w-7 h-7 border rounded">−</button>
                  <span className="min-w-6 text-center">{it.quantity}</span>
                  <button onClick={() => { const next = updateQuantity(it.id, it.quantity + 1, it.selectedSize); setItems(next) }} className="w-7 h-7 border rounded">+</button>
                </div>
                <div className="col-span-1 text-right font-semibold">₹ {(Number(it.price) * it.quantity).toFixed(0)}</div>
              </div>
            ))}
          </div>

          {/* Coupon */}
          <div className="mt-6 flex gap-3">
            <input
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 border rounded-full px-4 py-2"
            />
            <button className="bg-blue-600 text-white px-5 py-2 rounded-full">Apply coupon</button>
          </div>

          {/* Promo boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-green-300 rounded p-6 text-center font-semibold">
              Free products
              <div className="font-normal">dog food combo 5 kg, turkey</div>
            </div>
            <div className="bg-green-300 rounded p-6 text-center font-semibold">
              Free products
              <div className="font-normal">dog food 2 kg turkey</div>
            </div>
            <div className="bg-green-300 rounded p-6 text-center font-semibold">
              Free products
              <div className="font-normal">dog food 2 kg chicken</div>
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-bold mb-4">Card Totals</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span>Sub total</span>
                <span>₹ {subtotal.toFixed(0)}</span>
              </div>
              <div className="border-b pb-3">
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Flat rate : <span className="text-blue-600">₹99.00</span></span>
                </div>
                <div className="text-right text-sm text-gray-600">Shipping to Madhya Pradesh.</div>
                <div className="text-right text-blue-600 text-sm">Change address</div>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹ {total.toFixed(0)}</span>
              </div>
              <a href="/checkout" className="block w-full bg-blue-600 text-white py-3 rounded-full font-semibold text-center">Proceed to Checkout</a>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Payment methods</h4>
            <div className="flex items-center gap-4 text-2xl">
              <span>GPay</span>
              <span>📱</span>
              <span>💳</span>
              <span>🅿</span>
              <span>VISA</span>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-700 space-y-4">
            <div>
              <div className="font-semibold">Delivery information:</div>
              <p>Although we don’t think you’ll ever want one, we’ll gladly provide a refund if it’s requested within 14 days of purchase.</p>
            </div>
            <div>
              <div className="font-semibold">14 Days Money Back Guarantee:</div>
              <p>Although we don’t think you’ll ever want one, we’ll gladly provide a refund if it’s requested within 14 days of purchase.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart