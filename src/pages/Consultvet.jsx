import React, { useEffect, useState } from 'react';
import api, { getMediaUrl } from '../api/api';

function Consultvet() {
  const [doctors, setDoctors] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [bRes, cRes] = await Promise.all([
          api.get('/consultbanners/'),
          api.get('/consultcategories/'),
        ]);
        setBanners(Array.isArray(bRes.data) ? bRes.data : []);
        setCategories(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (e) {
        console.error('Failed to load home content', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/vetdoctors/');
        setDoctors(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Failed to load doctors', e);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <p className='py-2 text-sm text-gray-500'>Home / Consult Vet</p>

      {banners.length > 0 && (
  <div className="relative w-full mt-6 rounded-md overflow-hidden">
    <img
      className="w-full h-80 lg:h-auto object-cover rounded-md"
      src={getMediaUrl(banners[0].image)}
      alt={banners[0].title}
    />

    {/* Overlay */}
    <div className="absolute inset-0 flex items-end justify-center p-4 sm:p-6">
      <div className="bg-black bg-opacity-70 text-white text-center w-full max-w-md sm:max-w-xl p-4 sm:p-6 rounded-lg">
        <p className="text-sm sm:text-base leading-snug">
          Every day with every connection, Petpalooza passionate associates
          help bring pet parents closer to their pets so they can live more
          fulfilled life
        </p>
        <button className='bg-blue-600 text-white font-bold text-sm sm:text-base mt-3 px-4 py-2 rounded'>
          Consult Now
        </button>
      </div>
    </div>
  </div>
)}


      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 text-center text-base sm:text-xl font-bold bg-blue-600 text-white rounded-lg mt-10'>
        <p>Verified Doctors</p>
        <p>Free Follow-up</p>
        <p>Medicine Delivery</p>
      </div>

      {categories.length > 0 && (
        <div className='my-10'>
          <h2 className="text-xl font-semibold mb-6 text-center">Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="text-center">
                <div className="bg-blue-300/60 rounded-full p-4">
                  <img
                    className="w-full h-20 object-contain mx-auto mb-2"
                    src={getMediaUrl(cat.image)}
                    alt={cat.title}
                  />
                </div>
                <div className="text-sm sm:text-base font-medium mt-1">{cat.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='bg-emerald-400 text-center py-8 mt-10 rounded-lg'>
        <p className="text-lg sm:text-xl font-medium">
          Get stress-free Pet Care from the comfort of your home
        </p>
        <button className='bg-blue-700 text-white py-2 px-6 mt-4 text-base sm:text-xl font-bold rounded'>
          Consult Now
        </button>
      </div>

      <h2 className="text-xl font-bold text-center my-10">
        Access our expert vets from anywhere
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {doctors.map(doc => (
          <div key={doc.id} className="rounded-2xl border border-gray-300 shadow-md p-6 text-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mx-auto mb-4">
              <img className="w-full h-full object-cover" src={getMediaUrl(doc.image)} alt={doc.name} />
            </div>
            <div className="text-lg sm:text-xl font-semibold">{doc.name}</div>
            <div className="text-gray-700 mt-1 text-sm sm:text-base">
              {doc.speciality} | {doc.experience_years}+ Years
            </div>
            {doc.qualification && (
              <div className="text-gray-600 text-sm mt-1">{doc.qualification}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Consultvet;
