import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useCart } from '../context/useCart'
import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, CreditCard } from 'lucide-react'

const CheckOutPage = () => {
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const shipping = 5.99
    const tax = getTotalPrice() * 0.1
    const total = getTotalPrice() + shipping + tax

    const handleStripeCheckout = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch('http://localhost:3000/api/v1/order/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items
                }),
            })

            const data = await response.json()

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url
            } else {
                throw new Error('Failed to create checkout session')
            }
        } catch (err) {
            console.error('Checkout error:', err)
            setError('Failed to process checkout. Please try again.')
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-600 mb-6">Add some products to checkout</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item._id} className="flex items-center gap-4 pb-4 border-b">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.title}</h3>
                                            <p className="text-gray-600">${item.price}</p>

                                            {/* Quantity Controls */}
                                            <div className='flex items-center gap-3 mt-2'>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="font-medium w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax (10%)</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleStripeCheckout}
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Proceed to Payment
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckOutPage