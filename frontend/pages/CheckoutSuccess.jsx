import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/useCart'
import Navbar from '../components/Navbar'
import { CheckCircle, ArrowLeft } from 'lucide-react'

const CheckoutSuccess = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { clearCart } = useCart()
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        if (sessionId) {
            clearCart()
        }
    }, [sessionId, clearCart])

    return (
        <>
            <Navbar />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Payment Successful!
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Thank you for your purchase. Your order has been confirmed.
                    </p>

                    <p className="text-sm text-gray-500 mb-6">
                        Order ID: {sessionId?.substring(0, 20)}...
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 border border-gray-300 px-5 py-3 rounded-lg hover:bg-gray-100 transition"
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutSuccess
