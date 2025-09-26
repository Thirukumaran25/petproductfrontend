import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getMediaUrl } from '../api/api'

function OrderComplete() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderData = location.state?.order

  if (!orderData) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <p className="text-gray-600 mb-6">Please try placing your order again.</p>
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
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-green-100 border border-green-300 rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-green-700 max-w-2xl mx-auto mb-2">
            Thank you for your purchase! Your order #{orderData.id} has been confirmed.
          </p>
          <p className="text-green-600 text-sm">
            We will notify you by email once your order has been shipped.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">#{orderData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-medium text-lg">₹{orderData.total.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">
                  {orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Secure Payment'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium">
                  {new Date(orderData.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Address</h2>
            <div className="space-y-2">
              <div className="font-medium">{orderData.first_name} {orderData.last_name}</div>
              <div className="text-gray-600">{orderData.address}</div>
              {orderData.address2 && <div className="text-gray-600">{orderData.address2}</div>}
              <div className="text-gray-600">{orderData.city}, {orderData.state} {orderData.pincode}</div>
              <div className="text-gray-600">{orderData.country}</div>
              <div className="text-gray-600">Phone: {orderData.phone}</div>
              <div className="text-gray-600">Email: {orderData.email}</div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8 bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Items</h2>
          <div className="space-y-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                {item.image1 && (
                  <img
                    className="w-16 h-16 object-cover rounded"
                    src={getMediaUrl(item.image1)}
                    alt={item.productname}
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{item.productname}</div>
                  <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                  {item.selectedSize && (
                    <div className="text-sm text-gray-600">Size: {item.selectedSize}kg</div>
                  )}
                </div>
                <div className="font-medium">₹{(Number(item.price) * item.quantity).toFixed(0)}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>₹{orderData.total.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
          <button 
            className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-colors"
            onClick={() => navigate('/dog')}
          >
            View Products
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderComplete