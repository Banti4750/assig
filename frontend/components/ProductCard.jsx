import React from 'react'
import { useCart } from '../context/useCart';

const ProductCard = ({ name, details, imageUrl, price, _id }) => {
    const { addItem, items } = useCart();

    // Check if item is already in cart
    const isInCart = items.some(item => item._id === _id);

    const handleAddToCart = () => {
        addItem({
            _id,
            name,
            details,
            imageUrl,
            price
        });
    };

    return (
        <div className='border-2 rounded-2xl p-4 hover:shadow-lg transition-shadow bg-white'>
            {/* Image Container */}
            <div className='w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-100'>
                <img
                    src={imageUrl}
                    alt={name}
                    className='w-full h-full object-cover'
                />
            </div>

            {/* Product Info */}
            <div className='space-y-2'>
                <h3 className='text-lg font-semibold text-gray-900 line-clamp-2'>
                    {name}
                </h3>

                <p className='text-sm text-gray-600 line-clamp-3'>
                    {details}
                </p>

                {/* Price and Action */}
                <div className='flex justify-between items-center pt-2'>
                    <span className='text-xl font-bold text-black'>
                        ${price}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        disabled={isInCart}
                        className={`px-4 py-2 rounded-lg transition-colors ${isInCart
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : 'bg-stone-400 hover:bg-stone-500 text-white'
                            }`}
                    >
                        {isInCart ? 'In Cart' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard