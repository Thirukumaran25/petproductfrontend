import React, { useEffect, useState } from "react";
import api, { getMediaUrl } from "../api/api";

function About() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [bRes, cRes] = await Promise.all([
          api.get("/aboutbanners/"),
          api.get("/aboutcategories/"),
        ]);
        setBanners(Array.isArray(bRes.data) ? bRes.data : []);
        setCategories(Array.isArray(cRes.data) ? cRes.data : []);
      } catch (e) {
        console.error("Failed to load about content", e);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm">
            <span className="text-gray-500">Home</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">About</span>
          </nav>
        </div>
      </div>

      {/* Banner 1 (with overlay) */}
      {banners.length > 0 && (
        <div className="relative mx-auto max-w-7xl mt-6">
          <img
            className="w-full h-auto object-cover rounded-md"
            src={getMediaUrl(banners[0].image)}
            alt={banners[0].title}
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] md:w-3/4 bg-black bg-opacity-70 text-white text-center px-6 py-4 rounded-lg">
            <h2 className="text-lg md:text-xl font-bold mb-2">Our Mission</h2>
            <p className="text-sm md:text-base leading-snug">
              Every day with every connection, Petpalooza passionate associates
              help bring pet parents closer to their pets so they can live more
              fulfilled life
            </p>
          </div>
        </div>
      )}

      {/* ANYTHING for PETS section */}
      <div className="px-4 sm:px-6 lg:px-8 mt-12 flex justify-center items-center">
        <div className="max-w-5xl p-6 sm:p-10 bg-green-300 text-center rounded-xl">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            ANYTHING for PETS®
          </h2>
          <p className="text-base leading-relaxed text-black">
            We love pets, and we believe loving pets makes us better people.
            That’s one of the many reasons we do Anything for Pets – because
            they will do anything for us. Anything for Pets is our commitment to
            pet parents, it’s how we do business and who we are as pet lovers.
            As the leader in pet care, we make our decisions based on how we can
            bring pet parents closer to their pets. From dressing in matching
            costumes, to finding the perfect treats and toys, we innovate
            solutions and unique, must-have products to create more ways for
            pets to be a part of our everyday lives. Our trusted and skilled
            associates share the same passion for pets as the pet parents we
            serve, helping pet parents choose from our offering of the largest
            variety of pet products and services in one convenient place - in
            your neighborhood or the palm of your hand. With more than 1,660
            locations in North America, we pride ourselves on our unrivaled
            variety of pet food, treats, toys, and apparel, as well as our
            services including training, grooming, boarding and more.
          </p>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="mt-12 px-4 sm:px-6 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="text-center border rounded-3xl shadow hover:shadow-lg transition"
              >
                <div className="px-6 py-4">
                  <img
                    className="w-full h-40 object-contain mb-3"
                    src={getMediaUrl(cat.image)}
                    alt={cat.title}
                  />
                </div>
                <div className="bg-blue-500 mx-6 my-4 text-white py-2 rounded-2xl text-lg font-semibold">
                  {cat.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banner 2 - Split layout (text + image) */}
      {banners.length > 1 && (
        <div className="flex flex-col lg:flex-row w-full mt-16">
          {/* Text section */}
          <div className="bg-green-300 flex items-center justify-center px-6 py-10 lg:w-1/2">
            <div className="max-w-xl text-black text-center lg:text-left">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                10 Reasons to Love #LifeAtPetSmart
              </h2>
              <p className="text-base leading-relaxed">
                Since 2020, we’ve committed over $250 million to increased wages
                and benefits to help ensure the health, safety, and well-being
                of associates. Our associates come to PetSmart because they love
                pets, and we want them to stay because they feel a deep sense of
                belonging and support in building a future for themselves here.
                Here are just ten reasons why #LifeAtPetSmart is so doggone
                great!
              </p>
            </div>
          </div>

          {/* Image section */}
          <div className="lg:w-1/2 w-full">
            <img
              className="w-full h-full object-cover"
              src={getMediaUrl(banners[1].image)}
              alt={banners[1].title}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default About;
