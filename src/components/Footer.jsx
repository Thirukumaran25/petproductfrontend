import React from 'react'

function Footer() {
  return (
    <footer className="bg-blue-700 text-white py-10 px-6">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-1 mb-4 text-xl font-bold">
            <a href="/">
            <span role="img" aria-label="paws">🐾🐾</span>
            <span>PetPalooza</span></a>
          </div>
        </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* PetPalooza Links */}
        <div>
          <h3 className="font-bold mb-2">PetPalooza</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold mb-2">Categories</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/dog">Dog</a></li>
            <li><a href="/cat">Cat</a></li>
            <li><a href="#">Fish</a></li>
            <li><a href="#">Rats</a></li>
            <li><a href="#">Rabbits</a></li>
            <li><a href="#">Hamsters</a></li>
            <li><a href="#">Guinea pigs</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold mb-2">Support</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="#">Privacy policy</a></li>
            <li><a href="#">Refund & returns policy</a></li>
            <li><a href="#">Shipping policy</a></li>
            <li><a href="#">Terms & conditions</a></li>
          </ul>
        </div>

        {/* Social + Contact */}
        <div>
          <h3 className="font-bold mb-2">Follow</h3>
          <div className="flex gap-4 mb-4 text-xl">
            <a href="#"><i className="fab fa-facebook text-white hover:text-gray-200"></i></a>
            <a href="#"><i className="fab fa-instagram text-white hover:text-gray-200"></i></a>
            <a href="#"><i className="fab fa-youtube text-white hover:text-gray-200"></i></a>
            <a href="#"><i className="fab fa-whatsapp text-white hover:text-gray-200"></i></a>
          </div>

          <div>
            <h3 className="font-bold">Get in Touch</h3>
            <p className="text-sm mt-1">Call: +91-1234567890</p>
            <p className="text-sm">Email: support@petpalooza.com</p>
          </div>
        </div>

        {/* Subscribe */}
        <div>
          <h3 className="font-bold mb-2">For Subscribe,</h3>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 text-black rounded"
              required
            />
            <button
              type="submit"
              className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-200"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}

export default Footer
