import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDogProducts, addToCart, getMediaUrl } from '../api/api'


function Dog() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()


  const [selectedBrands, setSelectedBrands] = useState(new Set())
  const [selectedSizes, setSelectedSizes] = useState(new Set())
  const [sortBy, setSortBy] = useState('best') 
  const [sortOpen, setSortOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)


  const uiBrands = ['Aeolus', 'All For Paws', 'Arden Grange', 'Bayer', 'Beaphar']
  const uiSizes = ['X', 'Small', 'S', 'M', 'Medium']
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getDogProducts()
        setProducts(response.data)
        setAllProducts(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch products')
        setLoading(false)
        console.error('Error fetching products:', err)
      }
    }

    fetchProducts()
  }, [])

  const distinctBrands = useMemo(() => {
    return Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean))).sort()
  }, [allProducts])

  const distinctSizes = useMemo(() => {
    const sizes = []
    allProducts.forEach(p => {
      if (Array.isArray(p.sizeinKG)) sizes.push(...p.sizeinKG.map(String))
    })
    return Array.from(new Set(sizes)).sort((a, b) => {
      const numA = Number(a)
      const numB = Number(b)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return String(a).localeCompare(String(b))
    })
  }, [allProducts])


  const filtered = useMemo(() => {
    let list = [...allProducts]
    if (selectedBrands.size > 0) {
      list = list.filter(p => selectedBrands.has(p.brand))
    }
    if (selectedSizes.size > 0) {
      list = list.filter(p => Array.isArray(p.sizeinKG) && p.sizeinKG.some(s => selectedSizes.has(String(s))))
    }
    switch (sortBy) {
      case 'price_low':
        list.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'price_high':
        list.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case 'top':
        list.sort((a, b) => Number(b.ratings) - Number(a.ratings))
        break
      default:
        break
    }
    return list
  }, [allProducts, selectedBrands, selectedSizes, sortBy])


  const toggleBrand = (brand) => {
    const next = new Set(selectedBrands)
    next.has(brand) ? next.delete(brand) : next.add(brand)
    setSelectedBrands(next)
  }

  const toggleSize = (size) => {
    const next = new Set(selectedSizes)
    next.has(String(size)) ? next.delete(String(size)) : next.add(String(size))
    setSelectedSizes(next)
  }

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm">
            <span className="text-gray-500">Home</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Dog</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 underline">Dog</h1>

          <div className="relative">
            <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="font-semibold">Sort by</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-20">
                {[
                  { k: 'best', label: 'Best sellers' },
                  { k: 'relevance', label: 'Relevance' },
                  { k: 'price_low', label: 'Price: Low - High' },
                  { k: 'price_high', label: 'Price: High - Low' },
                  { k: 'new', label: 'New Arrivals' },
                  { k: 'top', label: 'Top Rated' },
                ].map(opt => (
                  <button 
                    key={opt.k} 
                    onClick={() => { setSortBy(opt.k); setSortOpen(false) }} 
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${sortBy === opt.k ? 'text-black font-semibold' : ''}`}
                  >
                    {sortBy === opt.k && <span className="mr-2">✓</span>}{opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-8 hidden lg:block"> 
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Deals</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop" 
                    alt="Stress-Free Summer" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white mb-1">Stress- Free Summer</h3>
                    <p className="text-white/90 text-sm">Keep your pup calm along all season</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Products Grid */}
          <div className={`lg:col-span-9 ${!filtersOpen ? 'block' : 'hidden lg:grid'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {filtered.map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    onClick={() => navigate(`/product/${product.id}`)}
                    src={product.image1 ? (product.image1.startsWith('http') ? product.image1 : getMediaUrl(product.image1)) : 'placeholder.jpg'} 
                    alt={product.productname}
                    className="w-full h-40 object-cover cursor-pointer"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold">
                    {Array.isArray(product.sizeinKG) && product.sizeinKG.length > 0 ? `${product.sizeinKG[0]}` : ''}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <span 
                      onClick={() => navigate(`/product/${product.id}`)} 
                      className="cursor-pointer hover:underline"
                    >
                      {product.productname}
                    </span>
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          // FIX: Template literal fixed for className
                          className={`w-4 h-4 ${i < product.ratings ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({product.ratings || 0})</span>
                  </div>

                  <div className="">
                    <div>
                      <span className="text-xl font-bold text-gray-900">₹ {product.price}</span>
                    </div>
                      {Array.isArray(product.sizeinKG) && product.sizeinKG.length > 0 && (
                        <span className="text-sm bg-black p-2 text-white rounded-xl my-4 ">{product.sizeinKG[0]}</span>
                      )}
                  </div>
                    <button onClick={async () => {
                      try {
                        await addToCart(product, 1);
                        navigate('/cart')
                      } catch (e) {
                        // Assuming the API error handling sets a code or flag for login
                        if (e.code === 'LOGIN_REQUIRED') navigate('/login')
                      }
                    }} className="bg-blue-600 text-white px-3 py-2 my-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Add to Cart
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Filters Popup */}
        {filtersOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-auto p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} className="text-blue-600">Close</button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Brand</h3>
                  <div className="bg-gray-100 rounded p-3 space-y-2 max-h-48 overflow-auto">
                    {(distinctBrands.length ? distinctBrands : uiBrands).map(b => (
                      <label key={b} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={selectedBrands.has(b)} onChange={() => toggleBrand(b)} />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Size</h3>
                  <div className="bg-gray-100 rounded p-3 space-y-2 max-h-48 overflow-auto">
                    {(distinctSizes.length ? distinctSizes : uiSizes).map(s => (
                      <label key={s} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={selectedSizes.has(String(s))} onChange={() => toggleSize(s)} />
                        <span>{s} {typeof s === 'number' || (typeof s === 'string' && !isNaN(Number(s))) ? 'kg' : ''}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <button onClick={() => setFiltersOpen(false)} className="w-full bg-blue-600 text-white py-2 rounded-lg">Apply Filters</button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Arrows (Pagination) */}
        {filtered.length > 3 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2 border border-gray-300 rounded-full hover:bg-gray-50 bg-blue-600 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dog