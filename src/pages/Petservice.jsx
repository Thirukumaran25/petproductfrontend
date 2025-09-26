import React from "react";

function Petservice() {
  return (
    <div className="bg-white text-gray-800">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm">
            <span className="text-gray-500">Home</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Pet service</span>
          </nav>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto my-6 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 shadow-2xl border rounded-3xl p-4 sm:p-6">
          {[
            { icon: "✂️", label: "Grooming" },
            { icon: "🏨", label: "PetsHotel" },
            { icon: "🦴", label: "Diggie Day Camp" },
            { icon: "🎓", label: "Training" },
            { icon: "🚑", label: "Veterinary care" },
            { icon: "💖", label: "Adoption" },
          ].map((service, index) => (
            <div key={index} className="text-center py-10 bg-emerald-400 rounded-xl">
              <p className="text-2xl">{service.icon}</p>
              <p className="text-lg mt-2 font-medium">{service.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pet Services Description */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Pet Services</h1>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          Whether it's pamper day, playdate, sleepover, training class or veterinary visit, we provide the best in pet
          services with highly trained, passionate associates. From our pet hotel & doggie day camp as an alternative
          to pet sitting, to our dog training and grooming as an alternative to DIY.
        </p>
      </div>

      {/* Summer Specials Section */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-blue-500 rounded-xl p-6 text-white text-center space-y-4">
          <h2 className="font-bold text-xl">Summer Special</h2>
          <p>
            Upgrade a salon visit or overnight stay, with a strawberry ice cream spritz, ₹350+ in coupon savings & more
          </p>
          <button className="font-bold bg-white text-blue-500 rounded-2xl py-2 px-6">Book Now</button>
        </div>
        <div className="bg-emerald-400 rounded-xl p-6 text-center space-y-4">
          <h2 className="font-bold text-xl text-gray-900">Summer Special</h2>
          <p className="text-gray-800">
            Check out deals, offers & events in grooming, boarding, day camp, & training
          </p>
          <button className="font-bold bg-blue-500 text-white py-2 px-6 rounded-2xl">Book Now</button>
        </div>
      </div>

      {/* Promotions Section */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="border rounded-xl p-6 text-center space-y-4">
          <p>
            <strong>Yappy Hour</strong><br />
            ₹150 OFF on salon walk-in Services<br />
            Monday thru Friday
          </p>
          <button className="font-bold bg-blue-500 text-white py-2 px-6 rounded-2xl">Learn More</button>
        </div>
        <div className="border rounded-xl p-6 text-center space-y-4">
          <p>
            <strong>ONLY ₹1299</strong> any 6-week Training Class<br />
            (that's ₹800 a class)<br />
            Valid thru 7/6
          </p>
          <button className="font-bold bg-blue-500 text-white py-2 px-6 rounded-2xl">Enroll Now</button>
        </div>
        <div className="border rounded-xl p-6 text-center space-y-4">
          <p>
            Travelling without your pet this summer?<br />
            Book our reliable pet hotel services!
          </p>
          <button className="font-bold bg-blue-500 text-white py-2 px-6 rounded-2xl">Book Stay</button>
        </div>
      </div>
    </div>
  );
}

export default Petservice;
