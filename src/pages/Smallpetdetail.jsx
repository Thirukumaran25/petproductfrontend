
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api,{ getSmallpetProduct, addToCart, getMediaUrl } from "../api/api";



function Smallpetdetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState("image1");
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sections, setSections] = useState([])


    useEffect(() => {
    const load = async () => {
      try {
        const [sRes] = await Promise.all([
          api.get('/homesections/'),
        ])
        setSections(Array.isArray(sRes.data) ? sRes.data : [])
      } catch (e) {
        console.error('Failed to load home content', e)
      }
    }
    load()
  }, [])


  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        setError("Invalid product ID in URL.");
        return;
      }
      try {
        const res = await getSmallpetProduct(id);
        setProduct(res.data);
        setSelectedSize(res.data?.sizeinKG?.[0] || null);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setError("Failed to load product");
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const keys = ["image1", "image2", "image3", "image4", "image5"];
    return keys
      .map((k) => product[k])
      .filter(Boolean)
      .map((src) => getMediaUrl(src));
  }, [product]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!product) return null;

  const activeUrl = getMediaUrl(product[activeImage] || product.image1);

  const handleAdd = async () => {
    try {
      await addToCart({ ...product, selectedSize }, qty);
      navigate("/cart");
    } catch (error) {
      if (error.code === "LOGIN_REQUIRED") {
        navigate("/login");
      } else {
        console.error("Failed to add to cart:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-sm text-gray-500 py-2">
        Home / Dog / {product.productname}
      </div>
      <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <img
            src={activeUrl}
            alt={product.productname}
            className="w-full rounded-lg shadow"
          />
          {gallery.length > 0 && (
            <div className="mt-4 flex gap-4 overflow-auto">
              {["image1", "image2", "image3", "image4", "image5"].map(
                (k, i) => {
                  const raw = product[k];
                  if (!raw) return null;

                  const url = getMediaUrl(raw);
                  const isActive = activeImage === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setActiveImage(k)}
                      className={`border rounded-md p-1 ${
                        isActive ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <img
                        src={url}
                        alt={`thumb-${i}`}
                        className="w-28 h-28 object-cover rounded"
                      />
                    </button>
                  );
                }
              )}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold leading-snug">
            {product.productname}
          </h1>
          <div className="mt-3 text-lg">
            <span className="font-semibold">Coupon code:</span>{" "}
            <span className="font-bold">
              {product.id ? 9000 + Number(product.id) : "—"}
            </span>
          </div>
          {product.brand && (
            <div className="mt-1 text-xl">
              Brand: <span className="font-semibold">{product.brand}</span>
            </div>
          )}

          {product.productdetail && (
            <p className="mt-4 text-gray-700 leading-relaxed">
              {product.productdetail}
            </p>
          )}

          <ul className="mt-4 list-disc list-inside text-gray-700 space-y-1">
            {product.manufactured && (
              <li>MADE IN {product.manufactured.toUpperCase()}</li>
            )}
            {product.importername && (
              <li>Importer name- {product.importername}</li>
            )}
            {product.address && <li>Importer Address- {product.address}</li>}
          </ul>

          <div className="mt-6 text-xl">
            <span className="font-semibold">MRP: </span>
            <span className="text-2xl font-bold">
              ₹ {Number(product.price).toFixed(0)}
            </span>
            <span className="ml-2 text-gray-600 text-base">
              Inclusive of all taxes
            </span>
          </div>

          {Array.isArray(product.sizeinKG) && product.sizeinKG.length > 0 && (
            <div className="mt-5">
              <div className="font-semibold mb-2">Available Size:</div>
              <div className="flex gap-3">
                {product.sizeinKG.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    // FIX 3: Added backticks for template literal in className
                    className={`px-4 py-2 rounded border ${
                      selectedSize === sz
                        ? "bg-gray-800 text-white"
                        : "bg-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <div className="font-semibold mb-2">Quantity:</div>
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 border rounded"
              >
                −
              </button>
              <span className="min-w-8 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 border rounded"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => {
                try {
                  handleAdd();
                } catch (e) {
                  if (e.code === "LOGIN_REQUIRED") navigate("/login");
                }
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold"
            >
              Add to cart
            </button>
            <button
              className="bg-black text-white px-6 py-3 rounded-full font-semibold"
              onClick={() => {
                const item = {
                  id: product.id,
                  productname: product.productname,
                  price: Number(product.price),
                  image1: product.image1,
                  quantity: qty,
                  selectedSize,
                };
                // require login for buy now as well
                const user = localStorage.getItem("userEmail");
                if (!user) {
                  navigate("/login");
                  return;
                }
                navigate("/checkout", { state: { buyNowItem: item } });
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Description Section */}
        <div className="w-full md:w-1/2 p-4 order-2 md:order-1">
          <h1 className="font-bold text-2xl">Product Description</h1>
          <div className="p-2">
            <h1 className="font-semibold">{product.descriptiontitle1}</h1>
            <p>{product.descriptiondetail1}</p>
            <h1 className="font-semibold">{product.descriptiontitle2}</h1>
            <p>{product.descriptiondetail2}</p>
            <h1 className="font-semibold">{product.descriptiontitle3}</h1>
            <p>{product.descriptiondetail3}</p>
            <h1 className="font-semibold">{product.descriptiontitle4}</h1>
            <p>{product.descriptiondetail4}</p>
            <h1 className="font-semibold">{product.descriptiontitle5}</h1>
            <p>{product.descriptiondetail5}</p>
          </div>
        </div>
        {/* Image Section */}
        <div className="w-full md:w-1/2 order-1 md:order-2">
          <img
            src={
              product.image1
                ? product.image1.startsWith("http")
                  ? product.image1
                  : getMediaUrl(product.image1)
                : "placeholder.jpg"
            }
            alt={product.productname}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

    <h1 className="text-3xl font-semibold text-center py-10">Recently Viewed products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 m-4 gap-6">
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
    </div>
  );
}

export default Smallpetdetail