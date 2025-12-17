import './App.css'
import Productpage from '../pages/Productpage'
import { CartProvider } from '../context/useCart'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CheckOutPage from '../pages/CheckOutPage';
import CheckoutSuccess from '../pages/CheckoutSuccess';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Productpage />} />
            <Route path='/checkout-page' element={<CheckOutPage />} />
            <Route path='/checkout-success' element={<CheckoutSuccess />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App