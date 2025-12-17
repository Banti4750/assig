import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'

const ShowAllProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    async function fetchProducts() {
        try {
            setLoading(true)
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/product`)
            setProducts(response.data.products)
            setError(null)
        } catch (error) {
            console.error("Error fetching products:", error)
            setError("Failed to load products. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <p className='text-xl text-gray-600'>Loading products...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <div className='text-center'>
                    <p className='text-xl text-red-600 mb-4'>{error}</p>
                    <button
                        onClick={fetchProducts}
                        className='bg-stone-400 hover:bg-stone-500 text-white px-6 py-2 rounded-lg transition-colors'
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <h2 className='text-3xl font-bold mb-6 text-gray-900'>All Products</h2>

            {products.length === 0 ? (
                <p className='text-center text-gray-600'>No products available.</p>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            _id={product._id}
                            name={product.name}
                            details={product.details}
                            imageUrl={product.imageUrl}
                            price={product.price}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ShowAllProducts