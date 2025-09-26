import React, { useEffect, useRef, useState } from 'react'
import api, { getMediaUrl } from '../api/api'

export const Home = () => {
  const [banners, setBanners] = useState([])
  const [categories, setCategories] = useState([])
  const [sections, setSections] = useState([])
  const [services, setServices] = useState([])
   const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 4000); // Change every 4s

    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);


  useEffect(() => {
    const load = async () => {
      try {
        const [bRes, cRes, sRes, svRes] = await Promise.all([
          api.get('/homebanners/'),
          api.get('/homecategories/'),
          api.get('/homesections/'),
          api.get('/homeservices/'),
        ])
        setBanners(Array.isArray(bRes.data) ? bRes.data : [])
        setCategories(Array.isArray(cRes.data) ? cRes.data : [])
        setSections(Array.isArray(sRes.data) ? sRes.data : [])
        setServices(Array.isArray(svRes.data) ? svRes.data : [])
      } catch (e) {
        console.error('Failed to load home content', e)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="overflow-hidden w-full">
      {/* 👇 Container to reduce width */}
      <div className="mx-auto h-[28rem] max-w-full overflow-hidden border rounded-xl shadow-lg">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-700 ease-in-out"
          style={{ width: `${banners.length * 100}%` }}
        >
          {banners.map((banner, idx) => (
            <div
              key={idx}
              className="flex w-full flex-shrink-0"
            >
              {/* Alternating layout */}
              {idx % 2 === 0 ? (
                <>
                  <img
                    className="w-[40rem] shadow "
                    src={getMediaUrl(banner.image)}
                    alt={banner.title}
                  />
                  <div className='w-[40rem] bg-emerald-200 text-center flex flex-col justify-center items-center p-4'>
                    <p className='text-xl font-bold py-4'>🌧️ Monsoon Edition for Dogs</p>
                    <p className='text-4xl'>☂️</p>
                    <h2 className="font-bold text-lg mt-2">{banner.title}</h2>
                    <p className="text-sm">Water proof</p>
                    <button className='bg-blue-600 text-white font-bold text-sm py-2 px-6 border-2 rounded-xl mt-4'>Shop Now</button>
                  </div>
                </>
              ) : (
                <>
                  <div className='w-[40rem] bg-blue-600 text-white p-6 flex flex-col justify-center'>
                    <h2 className="text-xl font-bold">{banner.title}</h2>
                    <p className='my-6 text-sm'>
                      SAVE 35% on first order plus stack limited-time deals <br />
                      on top Auto-ship items, see terms
                    </p>
                    <button className='bg-white text-black font-semibold text-sm py-2 px-6 rounded-xl'>Shop Now</button>
                  </div>
                  <img
                    className="w-[40rem] shadow"
                    src={getMediaUrl(banner.image)}
                    alt={banner.title}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>

      
      {categories.length > 0 && (
        <div>
          <h3 className="text-3xl font-semibold py-10 text-center mb-6">Shop by Pet</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map(cat => (
              <div key={cat.id} className="text-center">
                <div className="bg-green-300/60 rounded-full px-6 py-4 overflow-hidden text-center">
                  <img className="w-full h-40 object-contain mb-3" src={getMediaUrl(cat.image)} alt={cat.title} />
                </div>
                <div className="text-xl font-semibold">{cat.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h1 className="text-3xl font-semibold text-center py-10">Top Rated Calming products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {sections.map(section => (
        <div key={section.id}>
          <div className=" border p-2">
            <div className=" justify-items-center">
              <img className="w-60 h-40 rounded-xl" src={getMediaUrl(section.banner_image)} alt={section.title} />
              <h3 className="mt-3 text-sm ">{section.title}</h3>
              <p>⭐⭐⭐⭐⭐</p>
              {section.subtitle && <p className="text-gray-700">₹ {section.subtitle}</p>}
            </div>
          </div>
        </div>
      ))}
      </div>

    {banners.length > 1 && (
        <div class="flex duration-700 mt-10 ease-in-out" data-carousel-item>
          <div className='w-1/2 bg-blue-600 text-white p-4'>
            <h2 className=" mt-3 text-2xl font-bold">{banners[0].title}</h2>
            <p className='my-10'>SAVE 35% on first order plus stack limited-time deals <br />
            on top Auroship-items,see terms</p>
            <button className='bg-white text-black font-semibold font-xl py-2 px-6 rounded-2xl'>Shop Now</button>
          </div>
            <img
            className="w-1/2 shadow"
            src={getMediaUrl(banners[1].image)}
            alt={banners[1].title}
          />
        </div>
      )}

      <div className='bg-emerald-400 p-10 my-10 rounded-3xl flex justify-around'>
        <div>
          <p className='text-xl font-semibold'>Buy 1 blue wilderness Dry dog foog,13-28lbs, <br />
            get 2free wild cut Toppers*</p>
        </div>
        <div>
          <button className='bg-blue-600 text-white font-bold text-xl py-2 px-8 border-2 rounded-2xl'>Shop Now</button>
        </div>
      </div>

      {services.length > 0 && (
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-center">Pet Services</h3>
          <p className='mb-6 text-center'>Treats Rewards members earn points on every service</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(s => (
              <div key={s.id} className="rounded-2xl overflow-hidden bg-white shadow">
                <img className="w-full h-56 object-cover" src={getMediaUrl(s.image)} alt={s.title} />
                <div className="bg-blue-600 text-white text-center py-3 text-xl font-semibold">{s.title}</div>
                <div className="p-4 text-center text-gray-700">{s.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
