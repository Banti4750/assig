import React from 'react'
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/useCart';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate()
    const { getItemCount } = useCart()
    return (
        <div className='border-b bg-stone-400 flex justify-around items-center px-6 py-4'>
            {/* logo */}
            <div className='text-2xl font-semibold text-black'>
                BuySome
            </div>

            <button className='relative hover:bg-stone-500 p-2 rounded-lg transition-colors' onClick={() => navigate('/checkout-page')}>
                <ShoppingCart className='w-6 h-6' />
                {/* Optional: Cart item count badge */}
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                    {getItemCount()}
                </span>
            </button>
        </div>
    )
}

export default Navbar