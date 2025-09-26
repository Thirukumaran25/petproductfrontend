import React from 'react'
import { useNavigate } from 'react-router-dom'

function Card({ icon, title, subtitle }) {
  return (
    <div className="bg-white border rounded-xl p-5 flex items-start justify-between hover:shadow transition-shadow">
      <div className="flex items-start gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="font-semibold">{title}</div>
          {subtitle && (
            <div className="text-sm text-gray-600 leading-snug mt-1">{subtitle}</div>
          )}
        </div>
      </div>
      <div className="text-blue-600 text-lg">→</div>
    </div>
  )
}

function Contact() {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>

      {/* Sign in help banner */}
      <div className="bg-white border rounded-2xl p-5 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="text-3xl">👤</div>
          <div>
            <div className="font-semibold">Getting help is easy</div>
            <div className="text-sm text-gray-600">Sign in to get help with recent orders</div>
          </div>
        </div>
        <button onClick={()=>navigate('/login')} className="bg-blue-600 text-white rounded-lg px-5 py-2">Sign in</button>
      </div>

      <div className="font-semibold mb-3">Quick Links</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card icon="🚚" title="Track order" subtitle={(
          <>
            View the status of your
            <br/>order
          </>
        )} />
        <Card icon="📦" title="Return order" subtitle="Return and view the items in your order" />
        <Card icon="💬" title="Chat with vet" subtitle="View the status of your order" />
      </div>

      <div className="font-semibold mb-3">Browse Topics</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Card icon="🧾" title="Order related" />
        <Card icon="↩" title="Return & cancellations related" />
        <Card icon="💳" title="Payments & refund related" />
        <Card icon="❓" title="General enquiry" />
      </div>

      <div>
        <div className="text-lg font-semibold mb-3">Get in touch</div>
        <div className="text-gray-700 mb-3">If you have any inquiries, feel free to contact us</div>
        <div className="flex items-center gap-3 mb-2"><span>📞</span> <span>Call to 1234567890</span></div>
        <div className="flex items-center gap-3"><span>✉</span> <span>support@petpalooza.com</span></div>
      </div>
    </div>
  )
}

export default Contact