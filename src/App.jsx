import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dog from "./pages/Dog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderComplete from "./pages/OrderComplete";
import Login from "./pages/Login";
import Contact from "./pages/Contact";
import Consultvet from "./pages/Consultvet";
import Cat from "./pages/Cat";
import Smallpet from "./pages/Smallpet";
import Catdetail from "./pages/Catdetail";
import Smallpetdetail from "./pages/Smallpetdetail";
import About from "./pages/About";
import Petservice from "./pages/Petservice";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-complete" element={<OrderComplete />} />
          <Route path="/dog" element={<Dog />} />
          <Route path="/cat" element={<Cat />} />
          <Route path="/smallpet" element={<Smallpet />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cat/:id" element={<Catdetail />} />
          <Route path="/smallpet/:id" element={<Smallpetdetail />} />
          <Route path="/consultvet" element={<Consultvet />} />
          <Route path="/petservice" element={<Petservice />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  );
}

export default App;